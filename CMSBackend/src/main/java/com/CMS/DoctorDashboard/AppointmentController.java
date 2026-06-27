package com.CMS.DoctorDashboard;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.AdminDashboard.DoctorService;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.PaitentDashboard.AppointmentRepository;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class AppointmentController {
	
 
 @Autowired
 private DoctorRepository doctorRepository;
 
 @Autowired 
 private AppointmentRepository  AppointRepo;
	
	 @GetMapping("/doctor/completedCheckupsByDoctor")
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
	 @GetMapping("/doctor/cancelledAppointmentsByDoctor")
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
	 @GetMapping("/doctor/dayWiseTotalAppointments")
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
}
