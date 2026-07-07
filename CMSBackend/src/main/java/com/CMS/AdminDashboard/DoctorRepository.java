package com.CMS.AdminDashboard;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;
import com.CMS.PaitentDashboard.AppointmentEntity;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

	List<Doctor> findByActiveTrue();

	@Query("SELECT d FROM Doctor d " +
		       "WHERE (:specialization IS NULL OR d.specialization = :specialization) " +
		       "AND (:keyword IS NULL OR LOWER(d.dName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
		List<Doctor> searchDoctors(@Param("specialization") String specialization,
		                           @Param("keyword") String keyword);
	
	Optional<Doctor> findByEmail(String email);
	boolean existsByRegister_Id(int registerId);

 }

//List<DoctorSlot> findByDoctorDoctorIdAndAvailableTrue(Long doctorId);


