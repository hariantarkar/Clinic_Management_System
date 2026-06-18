package com.CMS.PasswordHandler;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.LoginHandler.ResetPasswordRequest;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class PasswordController {

    private final PasswordEncoder passwordEncoder;

	@Autowired
	RegisterRepo RegRepo;

    PasswordController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Autowired
    private EmailService emailService;

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        
        Register user = RegRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("Email not found");
        }

        String otp = String.valueOf(
                (int)((Math.random() * 900000) + 100000));

        user.setOtp(otp);
        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(1));

        RegRepo.save(user);

        emailService.sendOtp(
                user.getEmail(),
                otp);

        return ResponseEntity.ok(
                "OTP sent to registered email");
    }
	
	@PostMapping("/auth/reset-password")
	public ResponseEntity<String> resetPassword(
	        @RequestBody ResetPasswordRequest request) {

	    //Register user = RegRepo.findByEmail(request.getEmail());

	   
	    Register user = RegRepo.findByEmail(request.getEmail())
	            .orElseThrow(() -> new RuntimeException("User not found"));
	    if (user == null) {
	        return ResponseEntity.badRequest()
	                .body("User not found");
	    }
	    if (user.getOtp() == null || user.getOtpExpiry() == null) {
	        return ResponseEntity.badRequest()
	                .body("No active OTP found");
	    }
	    if (!request.getOtp().equals(user.getOtp())) {
	        return ResponseEntity.badRequest()
	                .body("Invalid OTP");
	    }

	    if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
	        return ResponseEntity.badRequest()
	                .body("OTP Expired");
	    }

	    user.setPassword(
	            passwordEncoder.encode(
	                    request.getNewPassword()));

	    user.setOtp(null);
	    user.setOtpExpiry(null);

	    RegRepo.save(user);

	    return ResponseEntity.ok(
	            "Password updated successfully");
	}
}
