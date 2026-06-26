package com.CMS.AdminSideEntity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
	    uniqueConstraints = @UniqueConstraint(
	            columnNames = {
	                "doctor_doctor_id",
	                "startTime",
	                "endTime"
	            }
	        )
	    )
public class DoctorSlot {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long slotId;

	    @ManyToOne
	    private Doctor doctor;

	    public Long getSlotId() {
			return slotId;
		}

		public void setSlotId(Long slotId) {
			this.slotId = slotId;
		}

		public Doctor getDoctor() {
			return doctor;
		}

		public void setDoctor(Doctor doctor) {
			this.doctor = doctor;
		}

		public LocalDateTime getStartTime() {
			return startTime;
		}
	
		public void setStartTime(LocalDateTime startTime) {
			this.startTime = startTime;
		}

		public LocalDateTime getEndTime() {
			return endTime;
		}

		public void setEndTime(LocalDateTime endTime) {
			this.endTime = endTime;
		}

		public boolean isAvailable() {
			return available;
		}

		public void setAvailable(boolean available) {
			this.available = available;
		}
		@NotNull(message = "Appointment duration is required")
	    @Min(value = 5, message = "Appointment duration must be at least 5 minutes")
	    @Column(name = "appointment_duration", nullable = false)
	    private Integer appointmentDuration = 30;
		
		@NotNull(message = "Start time is required")
		@Column(name = "start_time", nullable = false)
		private LocalDateTime startTime;
		@Column(name = "end_time")
	    private LocalDateTime endTime;

	    private boolean available = true;
	    
	    @Column(name = "booked_appointments", nullable = false)
	    private Integer bookedAppointments = 0;
	    
	    @Column(name = "max_appointments", nullable = false)
	    private Integer maxAppointments;

		public Integer getAppointmentDuration() {
			return appointmentDuration;
		}

		public void setAppointmentDuration(Integer appointmentDuration) {
			this.appointmentDuration = appointmentDuration;
		}

		public Integer getBookedAppointments() {
			return bookedAppointments;
		}

		public void setBookedAppointments(Integer bookedAppointments) {
			this.bookedAppointments = bookedAppointments;
		}

		public Integer getMaxAppointments() {
			return maxAppointments;
		}

		public void setMaxAppointments(Integer maxAppointments) {
			this.maxAppointments = maxAppointments;
		}
		
}
