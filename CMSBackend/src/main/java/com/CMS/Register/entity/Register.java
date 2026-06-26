package com.CMS.Register.entity;

import java.time.LocalDateTime;

import org.hibernate.usertype.UserType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
@Entity
@Table(name = "register")
public class Register {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rid")
	private int id;
	@NotBlank(message = "Full name is required")
	@Pattern(
		    regexp = "^[A-Za-z]+(\\s+[A-Za-z]+)+$",
		    message = "Full name must contain at least first and last name and only letters"
		)
	@Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
	@Column(name = "name", nullable = false)
	private String name;
	@NotBlank(message = "Email is required")
	@Pattern(
		    regexp = "^[A-Za-z0-9]+[A-Za-z0-9._%+-]*@[A-Za-z0-9-]+\\.[A-Za-z]{2,3}$",
		    message = "Enter a valid email address"
		)
	@Email(message = "Please enter a valid email address")
	@Column(name = "email", unique = true, nullable = false)
	private String email;
	@NotBlank(message = "Contact number is required")
	@Pattern(
	    regexp = "^[0-9]{10}$",
	    message = "Contact number must be exactly 10 digits"
	)
	@Column(name = "contact", unique = true, nullable = false)
	private String contact;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public enum UserType {
		admin, patient, doctor
	}
	@NotBlank(message = "Password is required")
	@Size(min = 6,
	      message = "Password must be between 6 and 20 characters")
	@Column(name = "password")
	private String password;
	@Enumerated(EnumType.STRING)
	@Column(name = "user_type")
	private UserType userType = UserType.patient;

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}
	
	@Column(name = "otp")
	private String otp;

	@Column(name = "otp_expiry")
	private LocalDateTime otpExpiry;

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

	public LocalDateTime getOtpExpiry() {
		return otpExpiry;
	}

	public void setOtpExpiry(LocalDateTime otpExpiry) {
		this.otpExpiry = otpExpiry;
	}
	
}
