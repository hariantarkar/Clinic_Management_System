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

@Entity
@Table(name = "doctors")
public class Doctor {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long doctorId;

	    @Column(name="dname",nullable = false)
	    private String dName;

	    @Column(name="email",nullable = false, unique = true)
	    private String email;

	    @Column(name="contactNumber",nullable = false, unique = true)
	    private String contactNumber;
	    @Column(name="qualification",nullable=false)
	    private String qualification;
	    @Column(name="experienceYears",nullable=false)
	    private Integer experienceYears;

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

		@Column(name="consultationFee",nullable = false)
	    private Double consultationFee;

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
