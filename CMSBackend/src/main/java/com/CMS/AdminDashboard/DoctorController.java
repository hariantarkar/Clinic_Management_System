package com.CMS.AdminDashboard;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.PaitentDashboard.AppointmentEntity;
import com.CMS.PaitentDashboard.AppointmentRepository;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

import jakarta.validation.Valid;

@RestController
public class DoctorController {

	 @Autowired
	    private DoctorService doctorService;
	 @Autowired
	 private RegisterRepo registerRepository;
	 
	 @Autowired
	 private DoctorRepository doctorRepository;
	 
	 @Autowired 
	 private AppointmentRepository  AppointRepo;
		
	 @PostMapping("/admin/addNewDoctor")
	 public ResponseEntity<?> addDoctor(@Valid @RequestBody Doctor doctor) {

	     if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
	         throw new RuntimeException("Doctor already exists in system");
	     }
	     return ResponseEntity.status(HttpStatus.CREATED)
	             .body(doctorService.addDoctor(doctor));
	 }
	 @Autowired
	 private jakarta.validation.Validator validator;

	 @PostMapping("/admin/addDoctorFromRegistration/{registerId}")
	 public ResponseEntity<?> addDoctorFromRegistration(
	         @PathVariable int registerId,
	         @RequestBody Doctor doctorDetails) {   // <-- @Valid removed here

	     Register register = registerRepository.findById(registerId)
	             .orElseThrow(() -> new RuntimeException("Registration not found"));

	     if (register.getUserType() != Register.UserType.doctor) {
	         throw new RuntimeException("This registration is not a doctor registration");
	     }

	     if (doctorRepository.findByEmail(register.getEmail()).isPresent()) {
	         throw new RuntimeException("Doctor already exists in system");
	     }

	     doctorDetails.setdName(register.getName());
	     doctorDetails.setEmail(register.getEmail());
	     doctorDetails.setRegister(register);
	     if (doctorDetails.getActive() == null) {
	         doctorDetails.setActive(true);
	     }

	     // manual validation now that dName/email are populated
	     var violations = validator.validate(doctorDetails);
	     if (!violations.isEmpty()) {
	         Map<String, String> errors = new HashMap<>();
	         violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
	         return ResponseEntity.badRequest().body(errors);
	     }

	     return ResponseEntity.status(HttpStatus.CREATED)
	             .body(doctorService.addDoctor(doctorDetails));
	 }
	 @GetMapping("/admin/totalDoctors")
	 public ResponseEntity<?> getTotalDoctors() {
	     long totalDoctors = doctorRepository.count();
	     Map<String, Object> response = new HashMap<>();
	     response.put("totalDoctors", totalDoctors);
	     return ResponseEntity.ok(response);
	 }
	 @GetMapping("/admin/getAllDoctors")
	 public ResponseEntity<List<Doctor>> getAllDoctors() {
	     return ResponseEntity.ok(doctorService.getAllDoctors());
	 }
	 @GetMapping("/admin/getDoctor/{doctorId}")
	 public ResponseEntity<Doctor> getDoctorById(@PathVariable Long doctorId) {
	     return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
	 }
	 @PutMapping("/admin/updateDoctor/{doctorId}")
	 public ResponseEntity<Doctor> updateDoctor(
	         @PathVariable Long doctorId,
	         @RequestBody Doctor doctor) {

	     return ResponseEntity.ok(
	             doctorService.updateDoctor(doctorId, doctor));
	 }
	 @DeleteMapping("/admin/deleteDoctor/{doctorId}")
	 public ResponseEntity<String> deleteDoctor(
	         @PathVariable Long doctorId) {

	     doctorService.deleteDoctor(doctorId);

	     return ResponseEntity.ok("Doctor deleted successfully");
	 }
	 @GetMapping("/admin/completedCheckupsByDoctor")
	 public ResponseEntity<?> getCompletedCheckupsByDoctor(
	         @RequestParam Long doctorId,
	         @RequestParam String date) {
	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));
	     LocalDate localDate = LocalDate.parse(date);
	     LocalDateTime start = localDate.atStartOfDay();
	     LocalDateTime end = localDate.atTime(23, 59, 59);
	     long totalCompleted =
	             AppointRepo.countByDoctorDoctorIdAndStatusAndAppointmentDateBetween(
	                     doctorId,
	                     "COMPLETED",
	                     start,
	                     end);
	     Map<String, Object> response = new HashMap<>();
	     response.put("doctorId", doctor.getDoctorId());
	     response.put("doctorName", doctor.getdName());
	     response.put("doctorEmail", doctor.getEmail());
	     response.put("date", date);
	     response.put("totalCompletedCheckups", totalCompleted);
	     return ResponseEntity.ok(response);
	 }
	 @GetMapping("/admin/cancelledAppointmentsByDoctor")
	 public ResponseEntity<?> getCancelledAppointmentsByDoctor(
	         @RequestParam Long doctorId,
	         @RequestParam String date) {

	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));
	     LocalDate localDate = LocalDate.parse(date);
	     LocalDateTime start = localDate.atStartOfDay();
	     LocalDateTime end = localDate.atTime(23, 59, 59);
	     long totalCancelled =
	             AppointRepo.countByDoctorDoctorIdAndStatusAndAppointmentDateBetween(
	                     doctorId,
	                     "CANCELLED",
	                     start,
	                     end);

	     Map<String, Object> response = new HashMap<>();
	     response.put("doctorId", doctor.getDoctorId());
	     response.put("doctorName", doctor.getdName());
	     response.put("doctorEmail", doctor.getEmail());
	     response.put("date", date);
	     response.put("totalCancelledAppointments", totalCancelled);
	     return ResponseEntity.ok(response);
	 }
	 @GetMapping("/admin/dayWiseTotalAppointments")
	 public ResponseEntity<?> getDayWiseTotalAppointments(
	         @RequestParam Long doctorId,
	         @RequestParam String date) {
	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));
	     LocalDate localDate = LocalDate.parse(date);
	     LocalDateTime start = localDate.atStartOfDay();
	     LocalDateTime end = localDate.atTime(23, 59, 59);
	     long totalAppointments =
	    		 AppointRepo
	                     .countByDoctorDoctorIdAndAppointmentDateBetween(
	                             doctorId,
	                             start,
	                             end);

	     Map<String, Object> response = new HashMap<>();
	     response.put("doctorId", doctor.getDoctorId());
	     response.put("doctorName", doctor.getdName());
	     response.put("date", date);
	     response.put("totalAppointments", totalAppointments);

	     return ResponseEntity.ok(response);
	 }
	 @GetMapping("/admin/pendingDoctors")
	 public ResponseEntity<List<Register>> getPendingDoctors() {

	     List<Register> pendingDoctors =
	             registerRepository.findPendingDoctorRegistrations();

	     return ResponseEntity.ok(pendingDoctors);
	 }
	 @PutMapping("/admin/setDoctorActiveStatus/{doctorId}")
	 public ResponseEntity<?> setDoctorActiveStatus(
	         @PathVariable Long doctorId,
	         @RequestParam boolean active) {

	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));

	     if (!active) {
	         List<AppointmentEntity> upcoming =
	        		 AppointRepo.findUpcomingActiveAppointmentsForDoctor(doctorId, LocalDateTime.now());

	         if (!upcoming.isEmpty()) {
	             throw new RuntimeException(
	                 "Cannot deactivate doctor: has " + upcoming.size() + " current or upcoming appointment(s)"
	             );
	         }
	     }

	     doctor.setActive(active);
	     doctorRepository.save(doctor);
	     return ResponseEntity.ok(doctor);
	 }
}
