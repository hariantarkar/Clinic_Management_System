package com.CMS.AdminDashboard;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CMS.AdminSideEntity.DoctorSlot;

public interface DoctorSlotRepository extends JpaRepository<DoctorSlot, Long> {

	 List<DoctorSlot> findByDoctorDoctorIdAndAvailableTrue(Long doctorId);
	 
	 boolean existsByDoctorDoctorIdAndStartTimeAndEndTime(
	            Long doctorId,
	            LocalDateTime startTime,
	            LocalDateTime endTime);

		
		  List<DoctorSlot>
		  findByDoctorDoctorIdAndAvailableTrueAndStartTimeAfterOrderByStartTimeAsc(
		  Long doctorId, LocalDateTime currentTime);
		 
	 
	 List<DoctorSlot> findByDoctorDoctorIdAndAvailableTrueAndEndTimeAfterOrderByStartTimeAsc(
		        Long doctorId,
		        LocalDateTime currentTime);
	 List<DoctorSlot> findByDoctorDoctorIdOrderByStartTimeAsc(Long doctorId);
	 
	 List<DoctorSlot> findByDoctorDoctorIdAndStartTimeAfterOrderByStartTimeAsc(
	            Long doctorId,
	            LocalDateTime currentTime);
	 
}
