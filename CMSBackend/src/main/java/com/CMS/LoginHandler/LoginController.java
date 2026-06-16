package com.CMS.LoginHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.RegisterAuthenticatedService.RegisterAuthenticated;

@RestController
public class LoginController {

	@Autowired
	private RegisterAuthenticated authService;
	
	@PostMapping("/auth/login")
	public ResponseEntity<LoginResponse> login(
	        @RequestBody LoginRequest request) {

	    String token = authService.login(
	            request.getEmail(),
	            request.getPassword());

	    LoginResponse response = new LoginResponse("Login Successfull", token);

	    response.setMessage("Login Successfully");
	    response.setToken(token);
	    return ResponseEntity.ok(response);
	}
	@GetMapping("/user/profile")
	public String profile() {
	    return "Welcome User";
	}
}
