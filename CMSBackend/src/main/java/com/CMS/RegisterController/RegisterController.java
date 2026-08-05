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
	
	/*
	 * @PostMapping("/auth/reg") public
	 * ResponseEntity<String>registerUser( @Valid @RequestBody Register register){
	 * 
	 * String msg=authService.register(register);
	 * 
	 * return new ResponseEntity<String>(msg,HttpStatus.CREATED);
	 * 
	 * 
	 * }
	 */
	
	@PostMapping("/auth/reg")
	public ResponseEntity<String> registerUser(@Valid @RequestBody Register register) {

	    // Public self-registration may only ever create a patient or doctor
	    // account. "doctor" here is just a request for admin review via the
	    // Pending Doctors flow — it does not grant doctor access by itself.
	    // Admin accounts must never be creatable through this endpoint.
	    if (register.getUserType() == null) {
	        register.setUserType(Register.UserType.patient);
	    } else if (register.getUserType() == Register.UserType.admin) {
	        throw new RuntimeException("Invalid registration request");
	    }

	    String msg = authService.register(register);
	    return new ResponseEntity<String>(msg, HttpStatus.CREATED);
	}
}
