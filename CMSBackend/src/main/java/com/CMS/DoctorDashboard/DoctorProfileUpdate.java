package com.CMS.DoctorDashboard;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class DoctorProfileUpdate {
	@NotBlank(message = "Email is required")
	  @Pattern(
			    regexp = "^(?!.*\\.\\.)(?!.*\\.@)(?!.*@\\.)(?!@)[A-Za-z0-9]+(?:\\.[A-Za-z0-9]+)*@[A-Za-z0-9-]+\\.[A-Za-z]{2,}$",
			    message = "Enter a valid email address"
			)
	 @Column(name="email",nullable = false, unique = true)
	 private String email;
	 @NotBlank(message = "Contact number is required")
	    @Pattern(
	    	    regexp = "^[6-9]\\d{9}$",
	    	    message = "Contact number must be a valid 10-digit Indian mobile number"
	    	)
	    @Column(name="contactNumber",nullable = false, unique = true)
	    private String contactNumber;
	
	    public String getEmail() {
	        return email;
	    }

	    public void setEmail(String email) {
	        this.email = email;
	    }

	    public String getContactNumber() {
	        return contactNumber;
	    }

	    public void setContactNumber(String contactNumber) {
	        this.contactNumber = contactNumber;
	    }
}
