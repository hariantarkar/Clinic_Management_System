	package com.CMS.RegisterController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.Register.entity.Register;
import com.CMS.RegisterAuthenticatedService.RegisterAuthenticated;

import jakarta.validation.Valid;

@RestController
public class RegisterController {
	@Autowired
	RegisterAuthenticated authService;
	
	@PostMapping("/auth/reg")
	public ResponseEntity<String>registerUser( @Valid @RequestBody Register register){
		
		String msg=authService.register(register);
		
		return new ResponseEntity<String>(msg,HttpStatus.CREATED);
		
		
	}
}
