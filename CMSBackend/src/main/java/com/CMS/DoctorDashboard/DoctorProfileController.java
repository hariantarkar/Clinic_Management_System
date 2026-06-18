package com.CMS.DoctorDashboard;

import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.Config.JwtUtil;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class DoctorProfileController {

	@Autowired
	private DoctorRepository doctorRepo;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	
	
	@GetMapping("/doctor/profile")
	public ResponseEntity<?> getMyProfile(HttpServletRequest request) {

	    String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(401).body("Token Missing");
	    }

	    String email = jwtUtil.verifyToken(authHeader);
	    System.out.println("Email from token = " + email);

	    Optional<Doctor> optionalDoctor = doctorRepo.findByEmail(email);
	    System.out.println("Doctor Found = " + optionalDoctor.isPresent());
	    if (optionalDoctor.isEmpty()) {
	        return ResponseEntity.badRequest().body("Doctor Not Found");
	    }

	    return ResponseEntity.ok(optionalDoctor.get());
	}
	
	
	/*
	 * @PutMapping("/doctor/Update/profile") public ResponseEntity<?> updateProfile(
	 * 
	 * @RequestBody DoctorProfileUpdate dto, Principal principal) {
	 * 
	 * String email = principal.getName();
	 * 
	 * Optional<Doctor> optionalDoctor = doctorRepo.findByEmail(email);
	 * 
	 * if(optionalDoctor.isPresent()) {
	 * 
	 * Doctor doctor = optionalDoctor.get();
	 * 
	 * doctor.setEmail(dto.getEmail());
	 * doctor.setContactNumber(dto.getContactNumber());
	 * 
	 * doctorRepo.save(doctor);
	 * 
	 * return ResponseEntity.ok("Profile Updated Successfully"); } return
	 * ResponseEntity.badRequest().body("Doctor Not Found"); }
	 */
	
	@Autowired
	private RegisterRepo registerRepo;
	

	/*public ResponseEntity<?> updateProfile(
	        @RequestBody DoctorProfileUpdate dto,
	        Principal principal) {

	    String email = principal.getName();

	    Optional<Doctor> optionalDoctor = doctorRepo.findByEmail(email);

	    if (optionalDoctor.isPresent()) {

	        Doctor doctor = optionalDoctor.get();

	        // Update Doctor table
	        doctor.setEmail(dto.getEmail());
	        doctor.setContactNumber(dto.getContactNumber());

	        // Update Register table
	        Register register = doctor.getRegister();

	        if (register != null) {
	            register.setEmail(dto.getEmail());
	            register.setContact(dto.getContactNumber());

	            registerRepo.save(register);
	        }

	        doctorRepo.save(doctor);

	        return ResponseEntity.ok("Profile Updated Successfully");
	    }

	    return ResponseEntity.badRequest().body("Doctor Not Found");
	}*/
	@PutMapping("/doctor/Update/profile")
	public ResponseEntity<?> updateProfile(
	        @RequestBody DoctorProfileUpdate dto,
	        Principal principal) {

	    String oldEmail = principal.getName();

	    Doctor doctor = doctorRepo.findByEmail(oldEmail)
	            .orElseThrow(() -> new RuntimeException("Doctor Not Found"));

	    Register register = registerRepo.findByEmail(oldEmail)
	            .orElseThrow(() -> new RuntimeException("Register Not Found"));

	    // Update Doctor table
	    doctor.setEmail(dto.getEmail());
	    doctor.setContactNumber(dto.getContactNumber());

	    // Update Register table
	    register.setEmail(dto.getEmail());
	    register.setContact(dto.getContactNumber());

	    doctorRepo.save(doctor);
	    registerRepo.save(register);

	    return ResponseEntity.ok("Profile Updated Successfully");
	}
}
