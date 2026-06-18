package com.CMS.RegisterAuthenticatedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.CMS.Config.JwtUtil;
import com.CMS.Register.entity.Register;
import com.CMS.Register.entity.Register.UserType;
import com.CMS.RegisterRepository.RegisterRepo;

@Service("authService")
public class RegisterAuthenticated {
	@Autowired
	private RegisterRepo regRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

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

		return register != null ? "User information save successfully.." : "user record not save..";

	}

	@Autowired
	private AuthenticationManager authenticationManager;

	public String login(String email, String password) {
		//Register user = regRepo.findByEmail(email);
		Register user = regRepo.findByEmail(email)
		        .orElseThrow(() -> new RuntimeException("User not found"));
		System.out.println("Email = " + email);
		if (user == null) {
			throw new RuntimeException("You are not a registered user. Please register before login.");
		}
		System.out.println(regRepo.findByEmail(email));
		System.out.println("Login username = " + email);
		System.out.println("Login password = " + password);

		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(email, password));

		System.out.println("Authentication = " + authentication.isAuthenticated());

		//return jwtUtil.generateToken(email);
		 return jwtUtil.generateToken(
	                user.getEmail(),
	                user.getUserType().name()
	        );
	}
}
