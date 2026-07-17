package com.CMS.LoginHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.RegisterAuthenticatedService.RegisterAuthenticated;

import jakarta.validation.Valid;

@RestController
public class LoginController {

	@Autowired
	private RegisterAuthenticated authService;
	

	@PostMapping("/auth/login")
	public ResponseEntity<LoginResponse> login(
	        @Valid @RequestBody LoginRequest request) {
	 
	    LoginResponse response = authService.login(
	            request.getEmail(),
	            request.getPassword());
	    		
	 
	    return ResponseEntity.ok(response);
	}
	
	

}
