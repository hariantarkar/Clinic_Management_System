package com.CMS.RegisterAuthenticatedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.Config.JwtUtil;
import com.CMS.LoginHandler.LoginResponse;
import com.CMS.Register.entity.Register;
import com.CMS.Register.entity.Register.UserType;
import com.CMS.RegisterRepository.RegisterRepo;

import jakarta.persistence.Id;

@Service("authService")
public class RegisterAuthenticated {
	@Autowired
	private RegisterRepo regRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
@Autowired
private DoctorRepository doctorRepository;
	
	@Autowired
	private JwtUtil jwtUtil;

	public String register(Register reg) {

		if (regRepo.findByEmail(reg.getEmail()).isPresent()) {
	        throw new RuntimeException("Email already registered");
	    }
		if (regRepo.findByContact(reg.getContact()) != null) {
			throw new RuntimeException("Contact already registered or present");
		}
		// Default role if not provided
		if (reg.getUserType() == null) {
			reg.setUserType(UserType.patient);
		}

		reg.setPassword(passwordEncoder.encode(reg.getPassword()));
		Register register = regRepo.save(reg);

		return register != null ? "User Register successfull.." : "Something went wrong ..";

	}

	@Autowired
	private AuthenticationManager authenticationManager;

	public LoginResponse login(String email, String password) {

	    Register user = regRepo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    try {
	        authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                        email,
	                        password));

	    } catch (BadCredentialsException e) {
	        throw new RuntimeException("Invalid email or password");
	    }

	    // A "doctor" Register row only means the person requested doctor
	    // access at signup — it doesn't grant it. Block login until an admin
	    // has approved them by creating the matching Doctor profile.
	    if (user.getUserType() == Register.UserType.doctor
	            && !doctorRepository.existsByRegister_Id(user.getId())) {
	        throw new RuntimeException("Your doctor registration is pending admin approval");
	    }

	    String token = jwtUtil.generateToken(
	                user.getEmail(),
	                user.getUserType().name()
	        );

	    return new LoginResponse(
	            "Login Successful",
	            token,
	            user.getUserType().name(),
	            (long) user.getId(),
	            user.getName());
	}
	}