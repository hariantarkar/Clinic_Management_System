package com.CMS.DoctorDashboard;

import java.time.LocalDateTime;
import java.util.List;
import com.CMS.PaitentDashboard.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	         @RequestBody DoctorSlot slot) {
		 System.out.println("Inside Doctor Add Slot API");
	     Doctor doctor = doctorRepository.findById(doctorId)
	             .orElseThrow(() -> new RuntimeException("Doctor not found"));

	     if (!doctor.getActive()) {
	    	    throw new RuntimeException("Doctor  is inactive");
	    	}
	     boolean exists = slotRepository
	             .existsByDoctorDoctorIdAndStartTimeAndEndTime(
	                     doctorId,
	                     slot.getStartTime(),
	                     slot.getEndTime());

	     if (exists) {
	         throw new RuntimeException("your Slot already exists !");
	     }
	     slot.setDoctor(doctor);
	     slot.setAvailable(true);

	     return ResponseEntity.status(HttpStatus.CREATED)
	             .body(slotRepository.save(slot));
	 }
	 @PatchMapping("/doctor/updateSlot/{slotId}")
	 public ResponseEntity<?> updateSlot(
	         @PathVariable Long slotId,
	         @RequestBody DoctorSlot updatedSlot) {

	     DoctorSlot existingSlot = slotRepository.findById(slotId)
	             .orElseThrow(() -> new RuntimeException("Slot not found"));

	     // Allow update only before slot start time
	     if (LocalDateTime.now().isAfter(existingSlot.getStartTime())) {
	         throw new RuntimeException(
	                 "Cannot update slot. Start time has already passed.");
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
	 
	 @GetMapping("/doctor/upcomingAppointments/{doctorId}")
	 public ResponseEntity<List<AppointmentEntity>> getUpcomingAppointments(
	         @PathVariable Long doctorId) {

	     return ResponseEntity.ok(
	    		 AppointRepo.findByDoctorDoctorIdAndStatus(
	                     doctorId,
	                     "BOOKED"
	             )
	     );
	 }
}
