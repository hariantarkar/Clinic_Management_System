package com.CMS.PaitentDashboard;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    
    boolean existsByPatient_IdAndSlot_SlotId(
            Integer patientId,
            Long slotId);
    boolean existsByPatient_IdAndSlot_SlotIdAndStatus(Integer patientId, Long slotId, String status);
    
    List<AppointmentEntity> findByDoctorDoctorIdAndStatusAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(
            Long doctorId, String status, LocalDateTime fromDateTime);
    
    List<AppointmentEntity> findByDoctorDoctorIdAndStatusAndAppointmentDateGreaterThanEqual(
            Long doctorId,
            String status,
            LocalDateTime fromDateTime);
    
    @Query("""
            SELECT a
            FROM AppointmentEntity a
            WHERE a.doctor.doctorId = :doctorId
            AND a.appointmentDate >= :now
            AND a.status NOT IN ('CANCELLED', 'COMPLETED')
            """)
        List<AppointmentEntity> findUpcomingActiveAppointmentsForDoctor(
                @Param("doctorId") Long doctorId,
                @Param("now") LocalDateTime now);
    
    boolean existsBySlot_SlotIdAndAppointmentDateAndStatus(
            Long slotId,
            LocalDateTime appointmentDate,
            String status);
    boolean existsByPatient_IdAndSlot_SlotIdAndStatusAndAppointmentDateAfter(
            Integer patientId,
            Long slotId,
            String status,
            LocalDateTime now);
    
    List<AppointmentEntity> findBySlot_SlotIdInAndStatus(List<Long> slotIds, String status);
}
