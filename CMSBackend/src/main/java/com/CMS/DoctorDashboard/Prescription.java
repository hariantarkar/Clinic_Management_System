package com.CMS.DoctorDashboard;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.PaitentDashboard.AppointmentEntity;
import com.CMS.Register.entity.Register;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
@Entity
public class Prescription {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long prescriptionId;
	    @OneToOne
	    private AppointmentEntity appointment;
	    @ManyToOne
	    private Doctor doctor;
	    @ManyToOne
	    private Register patient;
	    public Register getPatient() {
			return patient;
		}
		public void setPatient(Register patient) {
			this.patient = patient;
		}
		public Long getPrescriptionId() {
			return prescriptionId;
		}
		public void setPrescriptionId(Long prescriptionId) {
			this.prescriptionId = prescriptionId;
		}
		public AppointmentEntity getAppointment() {
			return appointment;
		}
		public void setAppointment(AppointmentEntity appointment) {
			this.appointment = appointment;
		}
		public Doctor getDoctor() {
			return doctor;
		}
		public void setDoctor(Doctor doctor) {
			this.doctor = doctor;
		}

		public String getRemarks() {
			return remarks;
		}
		public void setRemarks(String remarks) {
			this.remarks = remarks;
		}
		@CreationTimestamp
		@Column(name = "created_at", updatable = false)
		private LocalDateTime createdAt;
		@PrePersist
		public void onCreate() {
		    this.createdAt = LocalDateTime.now();
		}
		private String remarks;
		private String diagnosis;
		private Boolean consultationCompleted= false;
		public String getDiagnosis() {
			return diagnosis;
		}
		public void setDiagnosis(String diagnosis) {
			this.diagnosis = diagnosis;
		}
		public Boolean getConsultationCompleted() {
			return consultationCompleted;
		}
		public void setConsultationCompleted(Boolean consultationCompleted) {
			this.consultationCompleted = consultationCompleted;
		}

}
