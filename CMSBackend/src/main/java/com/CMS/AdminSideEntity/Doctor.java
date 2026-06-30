package com.CMS.AdminSideEntity;

import com.CMS.Register.entity.Register;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "doctors")
public class Doctor {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long doctorId;
	 @NotBlank(message = "Doctor name is required")
	 @Pattern(
			    regexp = "^(?=[A-Za-z. ]*$)(?!.*\\..*\\.)[A-Za-z]+(?:\\.[A-Za-z]+)?(?: [A-Za-z]+)*$",
			    message = "Doctor name can contain only alphabets, spaces, and at most one dot"
			)
	    @Size(min = 3, max = 50, message = "Doctor name must be between 3 and 50 characters")
	    @Column(name="dname",nullable = false)
	    private String dName;
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
	    @NotBlank(message = "Qualification is required")
	    @Size(max = 100, message = "Qualification cannot exceed 100 characters")
	    @Column(name="qualification",nullable=false)
	    private String qualification;
	    @NotNull(message = "Experience is required")
	    @Min(value = 0, message = "Experience cannot be negative")
	    @Column(name="experienceYears",nullable=false)
	    @Max(value = 60, message = "Experience cannot exceed 60 years")
	    private Integer experienceYears;
	    @NotBlank(message = "Specialization is required")
	    @Size(max = 100, message = "Specialization cannot exceed 100 characters")
	    @Column(name="specialization",nullable = false)
	    private String specialization;

	    public Long getDoctorId() {
			return doctorId;
		}

		public void setDoctorId(Long doctorId) {
			this.doctorId = doctorId;
		}

		public String getdName() {
			return dName;
		}

		public void setdName(String dName) {
			this.dName = dName;
		}

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

		public String getQualification() {
			return qualification;
		}

		public void setQualification(String qualification) {
			this.qualification = qualification;
		}

		public Integer getExperienceYears() {
			return experienceYears;
		}

		public void setExperienceYears(Integer experienceYears) {
			this.experienceYears = experienceYears;
		}

		public String getSpecialization() {
			return specialization;
		}

		public void setSpecialization(String specialization) {
			this.specialization = specialization;
		}

		public Double getConsultationFee() {
			return consultationFee;
		}

		public void setConsultationFee(Double consultationFee) {
			this.consultationFee = consultationFee;
		}

		public Boolean getActive() {
			return active;
		}

		public void setActive(Boolean active) {
			this.active = active;
		}
		 @NotNull(message = "Consultation fee is required")
		    @DecimalMin(value = "0.0", inclusive = false, message = "Consultation fee must be greater than 0")
		    @DecimalMax(value = "100000.0", message = "Consultation fee is too high")
		@Column(name="consultationFee",nullable = false)
	    private Double consultationFee;

		    @NotNull(message = "Active status is required")
	    @Column(name="active",nullable = false)
	    private Boolean active = true;
	    
	    @OneToOne(cascade = CascadeType.ALL)
	    @JoinColumn(name = "rid")
	    private Register register;

		public Register getRegister() {
			return register;
		}

		public void setRegister(Register register) {
			this.register = register;
		}
	    
}
