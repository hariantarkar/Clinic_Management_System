package com.CMS.DoctorDashboard;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.PaitentDashboard.AppointmentEntity;
import com.CMS.PaitentDashboard.AppointmentRepository;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class PrescriptionManagementController {

	@Autowired
	private PrescriptionRepository prescriptionRepository;

	@Autowired
	private RegisterRepo registerRepository;

	@Autowired
	private DoctorRepository doctorRepository;
	@Autowired
	private MedicineRepository medicineRepository;
	@Autowired
	private AppointmentRepository appointmentRepository;

	
	
 
	 
	/*
	 * @PostMapping(
	 * "/doctor/addPrescription/{doctorId}/{patientId}/{appointmentId}") public
	 * ResponseEntity<?> addPrescription(
	 * 
	 * @PathVariable Long doctorId,
	 * 
	 * @PathVariable Integer patientId,
	 * 
	 * @PathVariable Long appointmentId,
	 * 
	 * @RequestBody Prescription prescription) {
	 * 
	 * Doctor doctor = doctorRepository.findById(doctorId) .orElseThrow(() -> new
	 * RuntimeException("Doctor not found"));
	 * 
	 * Register patient = registerRepository.findById(patientId) .orElseThrow(() ->
	 * new RuntimeException("Patient not found"));
	 * 
	 * AppointmentEntity appointment = appointmentRepository.findById(appointmentId)
	 * .orElseThrow(() -> new RuntimeException("Appointment not found")); if
	 * ("COMPLETED".equals(appointment.getStatus())) { throw new
	 * RuntimeException("Appointment already completed. Book new appointment."); }
	 * 
	 * // ✅ set relationships prescription.setDoctor(doctor);
	 * prescription.setPatient(patient); prescription.setAppointment(appointment);
	 * 
	 * // ❌ do NOT complete here (correct design)
	 * prescription.setConsultationCompleted(false);
	 * 
	 * Prescription saved = prescriptionRepository.save(prescription);
	 * 
	 * return ResponseEntity.ok(saved); }
	 */
	
	@PostMapping("/doctor/addPrescription/{doctorId}/{patientId}/{appointmentId}")
	public ResponseEntity<?> addPrescription(
	        @PathVariable Long doctorId,
	        @PathVariable Integer patientId,
	        @PathVariable Long appointmentId,
	        @RequestBody Prescription prescription) {

	    Doctor doctor = doctorRepository.findById(doctorId)
	            .orElseThrow(() -> new RuntimeException("Doctor not found"));

	    Register patient = registerRepository.findById(patientId)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    AppointmentEntity appointment = appointmentRepository.findById(appointmentId)
	            .orElseThrow(() -> new RuntimeException("Appointment not found"));

	    if ("COMPLETED".equalsIgnoreCase(appointment.getStatus())) {
	        throw new RuntimeException("Appointment already completed");
	    }

	    if (prescriptionRepository.findByAppointmentAppointmentId(appointmentId).isPresent()) {
	        throw new RuntimeException("Prescription already exists");
	    }

	    prescription.setDoctor(doctor);
	    prescription.setPatient(patient);
	    prescription.setAppointment(appointment);
	    prescription.setConsultationCompleted(false);

	    return ResponseEntity.ok(prescriptionRepository.save(prescription));
	}
	@PostMapping("/doctor/addMedicine/{prescriptionId}")
	public ResponseEntity<?> addMedicine(
	        @PathVariable Long prescriptionId,
	        @RequestBody Medicine medicine) {

	    Prescription prescription = prescriptionRepository.findById(prescriptionId)
	            .orElseThrow(() -> new RuntimeException("Prescription not found"));

	    // ✅ Link medicine with prescription
	    medicine.setPrescription(prescription);

	    // ❌ DO NOT mark completed here (wrong design)
	    // prescription.setConsultationCompleted(true);

	    Medicine savedMedicine = medicineRepository.save(medicine);

	    return ResponseEntity.ok(savedMedicine);
	}
	@PostMapping("/doctor/completeConsultation/{prescriptionId}")
	public ResponseEntity<?> completeConsultation(@PathVariable Long prescriptionId) {

	    Prescription prescription = prescriptionRepository.findById(prescriptionId)
	            .orElseThrow(() -> new RuntimeException("Prescription not found"));

	    if (Boolean.TRUE.equals(prescription.getConsultationCompleted())) {
	        return ResponseEntity.badRequest().body("Consultation already completed");
	    }

	    AppointmentEntity appointment = prescription.getAppointment();

	    if (appointment == null) {
	        throw new RuntimeException("Appointment not linked with prescription");
	    }

	    prescription.setConsultationCompleted(true);

	    appointment.setStatus("COMPLETED");
	    appointmentRepository.save(appointment);

	    return ResponseEntity.ok(prescriptionRepository.save(prescription));
	}
	
	/*
	 * @PostMapping("/doctor/completeConsultation/{prescriptionId}") public
	 * ResponseEntity<?> completeConsultation(@PathVariable Long
	 * prescriptionId,@PathVariable Long appointmentId) {
	 * 
	 * Prescription prescription = prescriptionRepository.findById(prescriptionId)
	 * .orElseThrow(() -> new RuntimeException("Prescription not found"));
	 * 
	 * if (Boolean.TRUE.equals(prescription.getConsultationCompleted())) { return
	 * ResponseEntity.badRequest() .body("Consultation already completed"); } //
	 * prevent duplicate prescription for same appointment if
	 * (prescriptionRepository.findByAppointmentAppointmentId(appointmentId).
	 * isPresent()) { throw new
	 * RuntimeException("Prescription already exists for this appointment"); }
	 * 
	 * prescription.setConsultationCompleted(true);
	 * 
	 * AppointmentEntity appointment = prescription.getAppointment();
	 * 
	 * if (appointment == null) { throw new
	 * RuntimeException("Appointment not linked with prescription"); }
	 * 
	 * appointment.setStatus("COMPLETED"); appointmentRepository.save(appointment);
	 * 
	 * Prescription updated = prescriptionRepository.save(prescription);
	 * 
	 * return ResponseEntity.ok(updated); }
	 */
}
