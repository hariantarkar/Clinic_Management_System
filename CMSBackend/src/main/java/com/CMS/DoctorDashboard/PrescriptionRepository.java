package com.CMS.DoctorDashboard;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CMS.Register.entity.Register;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long>{
	
	List<Prescription> findByPatient(Register patient);
	List<Prescription> findByPatientOrderByPrescriptionIdDesc(Register patient);

	Optional<Prescription> findByAppointmentAppointmentId(Long appointmentId);
}
