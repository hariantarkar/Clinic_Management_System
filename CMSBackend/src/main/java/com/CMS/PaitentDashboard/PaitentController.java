package com.CMS.PaitentDashboard;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	    public ResponseEntity<List<Doctor>> searchDoctors(
	            @RequestParam(required = false) String specialization,
	            @RequestParam(required = false) String keyword) {

	        return ResponseEntity.ok(
	                patientService.searchDoctors(specialization, keyword)
	        );
	    }
	

	    @PostMapping("/patient/book/{slotId}/{patientId}")
	    public ResponseEntity<?> bookAppointment(
	            @PathVariable Long slotId,
	            @PathVariable Integer patientId) {

	        DoctorSlot slot = slotRepository.findById(slotId)
	                .orElseThrow(() ->
	                        new RuntimeException("Slot not found"));

	        Register patient = registerRepository.findById(patientId)
	                .orElseThrow(() ->
	                        new RuntimeException("Patient not found"));

	        if (patient.getUserType() != Register.UserType.patient) {
	            throw new RuntimeException("Invalid patient account");
	        }
	        boolean alreadyBooked =
	                appointmentRepository
	                .existsByPatient_IdAndSlot_SlotId(
	                        patientId,
	                        slotId);

	        if (alreadyBooked) {
	            throw new RuntimeException(
	                    "You have already booked this slot");
	        }

	        if (slot.getBookedAppointments()
	                >= slot.getMaxAppointments()) {

	            throw new RuntimeException(
	                    "No appointment slots available");
	        }

	        LocalDateTime appointmentTime =
	                slot.getStartTime().plusMinutes(
	                        (long) slot.getBookedAppointments()
	                                * slot.getAppointmentDuration());

	        AppointmentEntity appointment =
	                new AppointmentEntity();

	        appointment.setDoctor(slot.getDoctor());
	        appointment.setPatient(patient);
	        appointment.setSlot(slot);
	        appointment.setStatus("Booked");
	        appointment.setAppointmentDate(appointmentTime);

	        appointmentRepository.save(appointment);

	        slot.setBookedAppointments(
	                slot.getBookedAppointments() + 1);

	        slotRepository.save(slot);

	        return ResponseEntity.ok(
	                "Appointment booked successfully at "
	                        + appointmentTime);
	    }
	    @GetMapping("/patient/doctorsSlot/{doctorId}/availability")
	    public ResponseEntity<?> getAvailability(@PathVariable Long doctorId) {

	        List<DoctorSlot> slots = patientService.getAvailableSlots(doctorId);

	        if (slots.isEmpty()) {
	            return ResponseEntity.ok("No available slots found for this doctor.");
	        }

	        return ResponseEntity.ok(slots);
	    }

		
	    @GetMapping("/patient/upcomingAppointments/{patientId}")
	    public ResponseEntity<?> getUpcomingAppointments(
	            @PathVariable Integer patientId) {

	        List<AppointmentEntity> appointments =
	                appointmentRepository.findByPatientIdAndStatus(patientId, "Booked");

	        if (appointments.isEmpty()) {
	            return ResponseEntity.ok("No upcoming appointments found");
	        }

	        return ResponseEntity.ok(appointments);
	    }
	    @PutMapping("/patient/cancel/{appointmentId}")
	    public ResponseEntity<String> cancelAppointment(
	            @PathVariable Long appointmentId) {

	        System.out.println("Step 1");

	        AppointmentEntity appointment = appointmentRepository.findById(appointmentId)
	                .orElseThrow(() -> new RuntimeException("Appointment not found"));

	        System.out.println("Step 2");

	        DoctorSlot slot = appointment.getSlot();

	        System.out.println("Step 3");

	        if (LocalDateTime.now().isAfter(slot.getStartTime())) {
	            throw new RuntimeException(
	                    "Appointment cannot be cancelled after scheduled time");
	        }

	        System.out.println("Step 4");

	        appointment.setStatus("CANCELLED");
	        appointmentRepository.save(appointment);

	        System.out.println("Step 5");

	        slot.setAvailable(true);
	        slotRepository.save(slot);

	        System.out.println("Step 6");

	        return ResponseEntity.ok("Appointment cancelled successfully");
	    }
	    @GetMapping("/patient/patientSidePrescriptions/{patientId}")
		public ResponseEntity<?> getPatientPrescriptions(@PathVariable Integer patientId) {

		    Register patient = registerRepository.findById(patientId)
		            .orElseThrow(() -> new RuntimeException("Patient not found"));

		    return ResponseEntity.ok(
		            prescriptionRepository.findByPatientOrderByPrescriptionIdDesc(patient)
		    );
		}

@ExceptionHandler(RuntimeException.class)
public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
    return ResponseEntity.badRequest().body(ex.getMessage());
}
}

/*
 * @GetMapping("/patient/appointments/{patientId}") public
 * ResponseEntity<List<AppointmentEntity>> getMyAppointments(
 * 
 * @PathVariable Integer patientId) {
 * 
 * return ResponseEntity.ok( appointmentRepository.findByPatientId(patientId) );
 * }
 */
/*
 * @PostMapping("/patient/book/{slotId}/{patientId}") public ResponseEntity<?>
 * bookAppointment(
 * 
 * @PathVariable Long slotId,
 * 
 * @PathVariable Integer patientId) {
 * 
 * DoctorSlot slot = slotRepository.findById(slotId) .orElseThrow(() -> new
 * RuntimeException("Slot not found"));
 * 
 * if (!slot.isAvailable()) { throw new RuntimeException("Slot already booked");
 * }
 * 
 * Register patient = registerRepository.findById(patientId) .orElseThrow(() ->
 * new RuntimeException("Patient not found"));
 * 
 * if (patient.getUserType() != Register.UserType.patient) { throw new
 * RuntimeException("Invalid patient account"); }
 * 
 * AppointmentEntity appointment = new AppointmentEntity();
 * 
 * appointment.setPatient(patient); appointment.setDoctor(slot.getDoctor());
 * appointment.setSlot(slot); appointment.setStatus("Booked");
 * 
 * appointmentRepository.save(appointment);
 * 
 * slot.setAvailable(false); slotRepository.save(slot);
 * 
 * return ResponseEntity.ok("Appointment booked successfully"); }
 */


