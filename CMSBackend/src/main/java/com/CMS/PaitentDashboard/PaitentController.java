package com.CMS.PaitentDashboard;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminDashboard.DoctorSlotRepository;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;
import com.CMS.DoctorDashboard.PrescriptionRepository;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class PaitentController {

	@Autowired
	private PatientService patientService;
	@Autowired
	private DoctorSlotRepository slotRepository;

	@Autowired
	private AppointmentRepository appointmentRepository;

	@Autowired
	private RegisterRepo registerRepository;

	@Autowired
	private PrescriptionRepository prescriptionRepository;

	@GetMapping("/patient/ViewAlldoctors")
	public ResponseEntity<List<Doctor>> getAllDoctors() {
		return ResponseEntity.ok(patientService.getAllDoctors());
	}

	@GetMapping("/patient/doctors/search")
	public ResponseEntity<List<Doctor>> searchDoctors(@RequestParam(required = false) String specialization,
			@RequestParam(required = false) String keyword) {

		return ResponseEntity.ok(patientService.searchDoctors(specialization, keyword));
	}

	@PostMapping("/patient/book/{slotId}/{patientId}")
	public ResponseEntity<?> bookAppointment(
	        @PathVariable Long slotId,
	        @PathVariable Integer patientId,
	        @RequestParam("appointmentTime")
	        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime appointmentTime) {

	    DoctorSlot slot = slotRepository.findById(slotId)
	            .orElseThrow(() -> new RuntimeException("Slot not found"));

	    Register patient = registerRepository.findById(patientId)
	            .orElseThrow(() -> new RuntimeException("Patient not found"));

	    if (patient.getUserType() != Register.UserType.patient) {
	        throw new RuntimeException("Invalid patient account");
	    }
	    boolean alreadyBooked =
	            appointmentRepository.existsByPatient_IdAndSlot_SlotIdAndStatusAndAppointmentDateAfter(
	                    patientId, slotId, "Booked", LocalDateTime.now());
	    if (alreadyBooked) {
	        throw new RuntimeException("You already have an upcoming booking in this slot");
	    }
	    

	    if (slot.getBookedAppointments() >= slot.getMaxAppointments()) {
	        throw new RuntimeException("No appointment slots available");
	    }

	    // Validate the requested time actually lines up with this slot's
	    // duration grid (e.g. 4:00, 4:30, 5:00 for a 30-min slot 4–6pm)
	    long minutesFromStart = Duration.between(slot.getStartTime(), appointmentTime).toMinutes();
	    boolean withinRange = !appointmentTime.isBefore(slot.getStartTime())
	            && appointmentTime.isBefore(slot.getEndTime());
	    boolean alignedToDuration = minutesFromStart >= 0
	            && minutesFromStart % slot.getAppointmentDuration() == 0;

	    if (!withinRange || !alignedToDuration) {
	        throw new RuntimeException("Invalid appointment time for this slot");
	    }

	    boolean timeTaken = appointmentRepository.existsBySlot_SlotIdAndAppointmentDateAndStatus(
	            slotId, appointmentTime, "Booked");
	    if (timeTaken) {
	        throw new RuntimeException("This time is already booked. Please choose another.");
	    }

	    AppointmentEntity appointment = new AppointmentEntity();
	    appointment.setDoctor(slot.getDoctor());
	    appointment.setPatient(patient);
	    appointment.setSlot(slot);
	    appointment.setStatus("Booked");
	    appointment.setAppointmentDate(appointmentTime);

	    appointmentRepository.save(appointment);

	    slot.setBookedAppointments(slot.getBookedAppointments() + 1);
	    slotRepository.save(slot);

	    return ResponseEntity.ok("Appointment booked successfully at " + appointmentTime);
	}
	@GetMapping("/patient/doctorsSlot/{doctorId}/availability")
	public ResponseEntity<?> getAvailability(@PathVariable Long doctorId) {

	    List<SlotAvailabilityResponse> slots = patientService.getAvailableSlots(doctorId);

	    if (slots.isEmpty()) {
	        return ResponseEntity.ok("No available slots found for this doctor.");
	    }

	    return ResponseEntity.ok(slots);
	}

	@GetMapping("/patient/upcomingAppointments/{patientId}")
	public ResponseEntity<?> getUpcomingAppointments(@PathVariable Integer patientId) {

		List<AppointmentEntity> appointments = appointmentRepository.findByPatientIdAndStatus(patientId, "Booked");

		if (appointments.isEmpty()) {
			return ResponseEntity.ok("No upcoming appointments found");
		}

		return ResponseEntity.ok(appointments);
	}
	@PutMapping("/patient/cancel/{appointmentId}")
	public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) {

	    AppointmentEntity appointment = appointmentRepository.findById(appointmentId)
	            .orElseThrow(() -> new RuntimeException("Appointment not found"));

	    if ("CANCELLED".equals(appointment.getStatus())) {
	        throw new RuntimeException("This appointment is already cancelled");
	    }

	    if (LocalDateTime.now().isAfter(appointment.getAppointmentDate())) {
	        throw new RuntimeException("Appointment cannot be cancelled after its scheduled time");
	    }

	    appointment.setStatus("CANCELLED");
	    appointmentRepository.save(appointment);

	    // Free up the slot — undo the increment that bookAppointment applied.
	    // Floor at 0 so this can never go negative if called more than once
	    // on the same appointment somehow.
	    DoctorSlot slot = appointment.getSlot();
	    int updatedCount = Math.max(0, slot.getBookedAppointments() - 1);
	    slot.setBookedAppointments(updatedCount);
	    slot.setAvailable(true);
	    slotRepository.save(slot);

	    return ResponseEntity.ok("Appointment cancelled successfully");
	}
	
	@GetMapping("/patient/patientSidePrescriptions/{patientId}")
	public ResponseEntity<?> getPatientPrescriptions(@PathVariable Integer patientId) {

		Register patient = registerRepository.findById(patientId)
				.orElseThrow(() -> new RuntimeException("Patient not found"));

		return ResponseEntity.ok(prescriptionRepository.findByPatientOrderByPrescriptionIdDesc(patient));
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
		return ResponseEntity.badRequest().body(ex.getMessage());
	}
}
