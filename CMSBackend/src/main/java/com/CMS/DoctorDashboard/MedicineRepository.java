package com.CMS.DoctorDashboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

	 List<Medicine> findByPrescriptionPrescriptionId(Long prescriptionId);
}
