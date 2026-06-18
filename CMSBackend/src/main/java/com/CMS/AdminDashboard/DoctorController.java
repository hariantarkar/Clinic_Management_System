package com.CMS.AdminDashboard;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class DoctorController {

	 @Autowired
	    private DoctorService doctorService;
	 @Autowired
	 private RegisterRepo registerRepository;
	 
	 @Autowired
	 private DoctorRepository doctorRepository;
		/*
		 * @PostMapping("/admin/addNewDoctor") public ResponseEntity<Doctor>
		 * addDoctor(@RequestBody Doctor doctor) { return
		 * ResponseEntity.status(HttpStatus.CREATED)
		 * .body(doctorService.addDoctor(doctor)); }
		 */
		/*
		 * @PostMapping("/admin/addNewDoctor") public ResponseEntity<?>
		 * addDoctor(@RequestBody Doctor doctor) {
		 * 
		 * Register register = registerRepository .findByEmail(doctor.getEmail())
		 * .orElseThrow(() -> new RuntimeException("Doctor not registered"));
		 * 
		 * if (register.getUserType() != Register.UserType.doctor) { throw new
		 * RuntimeException("This user is not registered as doctor"); } if
		 * (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) { throw new
		 * RuntimeException("Doctor already exists in system"); }
		 * 
		 * return ResponseEntity.status(HttpStatus.CREATED)
		 * .body(doctorService.addDoctor(doctor)); }
		 */
	 @PostMapping("/admin/addNewDoctor")
	 public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {

	     if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
	         throw new RuntimeException("Doctor already exists in system");
	     }

	     return ResponseEntity.status(HttpStatus.CREATED)
	             .body(doctorService.addDoctor(doctor));
	 }
	 @GetMapping("/admin/getAllDoctors")
	 public ResponseEntity<List<Doctor>> getAllDoctors() {
	     return ResponseEntity.ok(doctorService.getAllDoctors());
	 }
	 @GetMapping("/admin/getDoctor/{doctorId}")
	 public ResponseEntity<Doctor> getDoctorById(@PathVariable Long doctorId) {
	     return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
	 }
	 @PatchMapping("/admin/updateDoctor/{doctorId}")
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
}
