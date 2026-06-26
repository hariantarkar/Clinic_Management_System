package com.CMS.PaitentDashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.DoctorDashboard.MedicineRepository;
import com.CMS.DoctorDashboard.PrescriptionRepository;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class Pre_MedicalRecordsManagementController {

	@Autowired
	private RegisterRepo registerRepository;
	@Autowired
	private PrescriptionRepository prescriptionRepository;
	
	@Autowired
	private AppointmentRepository appointmentRepository;
	
	@Autowired
	private DoctorRepository doctorRepository;
	@GetMapping("/patient/lastpatientPrescriptions/{patientId}")
	public ResponseEntity<?> getPatientPrescriptions(@PathVariable Integer patientId) {

	    Register patient = registerRepository.findById(patientId)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    return ResponseEntity.ok(
	            prescriptionRepository.findByPatientOrderByPrescriptionIdDesc(patient)
	    );
	}
	@GetMapping("/patient/lastVisited/{doctorId}/{patientId}")
	public ResponseEntity<?> getLastVisit(
	        @PathVariable Long doctorId,
	        @PathVariable Integer patientId) {

	    Doctor doctor = doctorRepository.findById(doctorId)
	            .orElseThrow(() -> new RuntimeException("Doctor not found"));

	    Register patient = registerRepository.findById(patientId)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    AppointmentEntity lastVisit =
	            appointmentRepository
	                    .findTopByDoctorAndPatientAndStatusOrderByAppointmentIdDesc(
	                            doctor,
	                            patient,
	                            "COMPLETED"
	                    )
	                    .orElseThrow(() -> new RuntimeException("No completed visit found"));

	    return ResponseEntity.ok(lastVisit);
	}
	@Autowired
	private MedicineRepository medicineRepository;
	@GetMapping("/patient/medicinesByPatient/{patientId}")
	public ResponseEntity<?> getMedicinesByPatient(@PathVariable Integer patientId) {

	    Register patient = registerRepository.findById(patientId)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    return ResponseEntity.ok(medicineRepository.findByPrescription_Patient_Id(patientId));
	}
}
