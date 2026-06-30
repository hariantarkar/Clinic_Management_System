package com.CMS.DoctorDashboard;

import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
import jakarta.validation.Valid;

@RestController
public class DoctorProfileController {

	@Autowired
	private DoctorRepository doctorRepo;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private RegisterRepo registerRepo;
	
	
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
	@PutMapping("/doctor/Update/profile")
	public ResponseEntity<?> updateProfile(
	        @Valid @RequestBody DoctorProfileUpdate dto,
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
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
	    Map<String, String> errors = new HashMap<>();
	    ex.getBindingResult().getFieldErrors().forEach(error ->
	        errors.put(error.getField(), error.getDefaultMessage())
	    );
	    return ResponseEntity.badRequest().body(errors);
	}
}
