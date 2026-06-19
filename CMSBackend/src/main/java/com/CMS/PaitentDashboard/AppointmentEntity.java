package com.CMS.PaitentDashboard;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;
import com.CMS.Register.entity.Register;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
@Entity
public class AppointmentEntity {

	 public Long getAppointmentId() {
		return appointmentId;
	}

	public void setAppointmentId(Long appointmentId) {
		this.appointmentId = appointmentId;
	}


	public Register getPatient() {
		return patient;
	}

	public void setPatient(Register patient) {
		this.patient = patient;
	}

	public Doctor getDoctor() {
		return doctor;
	}

	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}

	public DoctorSlot getSlot() {
		return slot;
	}

	public void setSlot(DoctorSlot slot) {
		this.slot = slot;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long appointmentId;

	    @ManyToOne
	    private Register patient;

	    @ManyToOne	
	    private Doctor doctor;

	    @ManyToOne
	    private DoctorSlot slot;

	    private String status;

	    @Column(name = "appointment_date", updatable = false)
	    @CreationTimestamp
	    private LocalDateTime appointmentDate;
}
