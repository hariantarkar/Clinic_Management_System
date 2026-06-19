package com.CMS.PaitentDashboard;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.Register.entity.Register;

public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long>{
    List<AppointmentEntity> findByPatientId(int patientId);
    
    List<AppointmentEntity> findByDoctorDoctorIdAndStatus(
	        Long doctorId,
	        String status
	);
    List<AppointmentEntity> findByStatus(String status);
    
    Optional<AppointmentEntity>
    findTopByDoctorAndPatientAndStatusOrderByAppointmentIdDesc(
            Doctor doctor,
            Register patient,
            String status
    );
    List<AppointmentEntity> findByPatientIdAndStatus(Integer patientId, String status);
    
    long countByStatus(String status);
    long countByStatusAndAppointmentDateBetween(
            String status,
            LocalDateTime start,
            LocalDateTime end
    );
    
    long countByDoctorDoctorIdAndStatusAndAppointmentDateBetween(
            Long doctorId,
            String status,
            LocalDateTime start,
            LocalDateTime end);
    
    long countByDoctorDoctorIdAndAppointmentDateBetween(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end);
    
    @Query("""
            SELECT COALESCE(SUM(a.doctor.consultationFee),0)
            FROM AppointmentEntity a
            WHERE a.status = 'COMPLETED'
            """)
     Double getTotalRevenue();
    
    @Query("""
    	       SELECT COALESCE(SUM(a.doctor.consultationFee),0)
    	       FROM AppointmentEntity a
    	       WHERE a.doctor.doctorId = :doctorId
    	       AND a.status = 'COMPLETED'
    	       """)
    	Double getRevenueByDoctor(Long doctorId);
    
    
    @Query("""
    	       SELECT COALESCE(SUM(a.doctor.consultationFee),0)
    	       FROM AppointmentEntity a
    	       WHERE a.status = 'COMPLETED'
    	       AND a.appointmentDate BETWEEN :startDate AND :endDate
    	       """)
    	Double getRevenueByDateRange(
    	        LocalDateTime startDate,
    	        LocalDateTime endDate);


    @Query("""
    	       SELECT COALESCE(SUM(a.doctor.consultationFee),0)
    	       FROM AppointmentEntity a
    	       WHERE a.status='COMPLETED'
    	       AND a.doctor.doctorId = :doctorId
    	       AND a.appointmentDate BETWEEN :startDate AND :endDate
    	       """)
    	Double getRevenueByDoctorAndDateRange(
    	        Long doctorId,
    	        LocalDateTime startDate,
    	        LocalDateTime endDate);
}
