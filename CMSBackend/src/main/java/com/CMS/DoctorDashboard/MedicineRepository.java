package com.CMS.DoctorDashboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

	 List<Medicine> findByPrescriptionPrescriptionId(Long prescriptionId);
	 List<Medicine> findByPrescription_Patient_Id(Integer patientId);
	// List<Medicine> findByPrescription_Patient_Id(Integer patientId);
}
