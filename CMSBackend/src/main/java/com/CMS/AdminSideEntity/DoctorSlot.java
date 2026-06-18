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
		@Column(name = "start_time")
		private LocalDateTime startTime;
		@Column(name = "end_time")
	    private LocalDateTime endTime;

	    private boolean available = true;
}
