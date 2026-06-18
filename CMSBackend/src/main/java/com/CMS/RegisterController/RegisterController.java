	package com.CMS.RegisterController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.Register.entity.Register;
import com.CMS.RegisterAuthenticatedService.RegisterAuthenticated;

@RestController
public class RegisterController {
	@Autowired
	RegisterAuthenticated authService;
	
	@PostMapping("/auth/reg")
	public ResponseEntity<String>registerUser(@RequestBody Register register){
		
		String msg=authService.register(register);
		
		return new ResponseEntity<String>(msg,HttpStatus.CREATED);
		
		
	}
}
