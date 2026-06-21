package com.CMS.LoginHandler;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {
	
	@NotBlank(message = "Email is required")
	@Pattern(
		    regexp = "^[A-Za-z0-9]+[A-Za-z0-9._%+-]*@[A-Za-z0-9-]+\\.[A-Za-z]{2,3}$",
		    message = "Enter a valid email address"
		)
	private String email;
	@NotBlank(message = "Password is required")
	@Size(min = 6, max = 20,
	      message = "Password length must be 6 ")
	private String password;
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
