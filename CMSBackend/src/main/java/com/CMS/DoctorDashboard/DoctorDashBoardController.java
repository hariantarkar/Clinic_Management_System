package com.CMS.DoctorDashboard;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import com.CMS.PaitentDashboard.AppointmentRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.AdminDashboard.DoctorSlotRepository;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;
import com.CMS.PaitentDashboard.AppointmentEntity;

@RestController
public class DoctorDashBoardController {


	

	 @Autowired
	    private DoctorSlotRepository slotRepository;

	 @Autowired
	 private DoctorRepository doctorRepository;
	 
	 @Autowired
	 private  AppointmentRepository AppointRepo;

	 @PostMapping("/doctor/addSlot/{doctorId}")
	 public ResponseEntity<DoctorSlot> addSlot(
	         @PathVariable Long doctorId,
	         @Valid @RequestBody DoctorSlot slot) {
	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));
	     if (!doctor.getActive()) {
	         throw new RuntimeException("Doctor is inactive");
	     }
	     if (slot.getStartTime() == null || slot.getEndTime() == null) {
	         throw new RuntimeException("Start time and End time are required");
	     }
	     if (slot.getStartTime().isBefore(LocalDateTime.now())) {
	         throw new RuntimeException("Start time cannot be in the past");
	     }
	     if (!slot.getEndTime().isAfter(slot.getStartTime())) {
	         throw new RuntimeException("End time must be after start time");
	     }
	     if (slot.getAppointmentDuration() == null
	             || slot.getAppointmentDuration() <= 0) {
	         throw new RuntimeException("Appointment duration must be greater than 0");
	     }
	     boolean exists = slotRepository
	             .existsByDoctorDoctorIdAndStartTimeAndEndTime(
	                     doctorId,
	                     slot.getStartTime(),
	                     slot.getEndTime());

	     if (exists) {
	         throw new RuntimeException("Slot already exists");
	     }
	     long totalMinutes = Duration
	             .between(slot.getStartTime(), slot.getEndTime())
	             .toMinutes();

	     if (totalMinutes < slot.getAppointmentDuration()) {
	         throw new RuntimeException(
	                 "Appointment duration cannot exceed slot duration");
	     }
	     int maxAppointments =
	             (int) (totalMinutes / slot.getAppointmentDuration());

	     slot.setDoctor(doctor);
	     slot.setBookedAppointments(0);
	     slot.setMaxAppointments(maxAppointments);
	     DoctorSlot savedSlot = slotRepository.save(slot);
	     return ResponseEntity.status(HttpStatus.CREATED)
	             .body(savedSlot);
	 }

		/*
		 * @PutMapping("/doctor/updateSlot/{slotId}") public ResponseEntity<?>
		 * updateSlot(
		 * 
		 * @PathVariable Long slotId,
		 * 
		 * @RequestBody DoctorSlot updatedSlot) {
		 * 
		 * DoctorSlot existingSlot = slotRepository.findById(slotId) .orElseThrow(() ->
		 * new RuntimeException("Slot not found"));
		 * 
		 * // Allow update only before slot start time if
		 * (LocalDateTime.now().isAfter(existingSlot.getStartTime())) { throw new
		 * RuntimeException( "Cannot update slot. Start time has already passed."); }
		 * 
		 * if (updatedSlot.getStartTime() != null) {
		 * existingSlot.setStartTime(updatedSlot.getStartTime()); }
		 * 
		 * if (updatedSlot.getEndTime() != null) {
		 * existingSlot.setEndTime(updatedSlot.getEndTime()); }
		 * 
		 * return ResponseEntity.ok(slotRepository.save(existingSlot)); }
		 */
	 @PutMapping("/doctor/updateSlot/{slotId}")
	 public ResponseEntity<?> updateSlot(
	         @PathVariable Long slotId,
	         @RequestBody DoctorSlot updatedSlot) {

	     DoctorSlot existingSlot = slotRepository.findById(slotId)
	             .orElseThrow(() -> new RuntimeException("Slot not found"));

	     if (LocalDateTime.now().isAfter(existingSlot.getStartTime())) {
	         throw new RuntimeException("Cannot update slot. Start time has already passed.");
	     }

	     if (updatedSlot.getStartTime() != null) {
	         existingSlot.setStartTime(updatedSlot.getStartTime());
	     }

	     if (updatedSlot.getEndTime() != null) {
	         existingSlot.setEndTime(updatedSlot.getEndTime());
	     }

	     return ResponseEntity.ok(slotRepository.save(existingSlot));
	 }
	 @GetMapping("/doctor/upcomingSlots/{doctorId}")
	 public ResponseEntity<?> getUpcomingSlots(@PathVariable Long doctorId) {

	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));

	     List<DoctorSlot> slots = slotRepository
	             .findByDoctorDoctorIdAndAvailableTrueAndStartTimeAfterOrderByStartTimeAsc(
	                     doctorId,
	                     LocalDateTime.now());

	     if (slots.isEmpty()) {
	         return ResponseEntity.ok("No upcoming slots available");
	     }

	     return ResponseEntity.ok(slots);
	 }
		/*
		 * @GetMapping("/doctor/upcomingAppointments/{doctorId}") public
		 * ResponseEntity<List<AppointmentEntity>> getUpcomingAppointments(
		 * 
		 * @PathVariable Long doctorId) {
		 * 
		 * return ResponseEntity.ok( AppointRepo.findByDoctorDoctorIdAndStatus(
		 * doctorId, "BOOKED" ) ); }
		 */
	 
	 @GetMapping("/doctor/upcomingAppointments/{doctorId}")
	 public ResponseEntity<List<AppointmentEntity>> getUpcomingAppointments(
	         @PathVariable Long doctorId) {

	     LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

	     return ResponseEntity.ok(
	             AppointRepo.findByDoctorDoctorIdAndStatusAndAppointmentDateGreaterThanEqual(
	                     doctorId,
	                     "BOOKED",
	                     startOfToday
	             )
	     );
	 }
}



/*
 * @PostMapping("/doctor/addSlot/{doctorId}") public ResponseEntity<DoctorSlot>
 * addSlot(
 * 
 * @PathVariable Long doctorId,
 * 
 * @RequestBody DoctorSlot slot) {
 * System.out.println("Inside Doctor Add Slot API"); Doctor doctor =
 * doctorRepository.findById(doctorId) .orElseThrow(() -> new
 * RuntimeException("Doctor not found"));
 * 
 * if (!doctor.getActive()) { throw new RuntimeException("Doctor  is inactive");
 * } boolean exists = slotRepository
 * .existsByDoctorDoctorIdAndStartTimeAndEndTime( doctorId, slot.getStartTime(),
 * slot.getEndTime());
 * 
 * if (exists) { throw new RuntimeException("your Slot already exists !"); }
 * slot.setDoctor(doctor); slot.setAvailable(true);
 * 
 * return ResponseEntity.status(HttpStatus.CREATED)
 * .body(slotRepository.save(slot)); }
 */

