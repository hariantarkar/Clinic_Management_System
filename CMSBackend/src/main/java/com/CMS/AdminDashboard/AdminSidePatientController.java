package com.CMS.AdminDashboard;
import com.CMS.Register.entity.Register;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.PaitentDashboard.AppointmentEntity;
import com.CMS.PaitentDashboard.AppointmentRepository;
import com.CMS.RegisterRepository.RegisterRepo;

@RestController
public class AdminSidePatientController {

	@Autowired
	private AppointmentRepository AppointRepo;
	@Autowired
	private RegisterRepo registerRepository;
	@GetMapping("/admin/upcomingAppointments")
	public ResponseEntity<List<AppointmentEntity>> getAllUpcomingAppointments() {

	    return ResponseEntity.ok(
	            AppointRepo.findByStatus("Booked")
	    );
	}
	@GetMapping("/admin/totalRegisterPatients")
	public ResponseEntity<?> getTotalPatients() {

		long totalPatients =
		        registerRepository.countByUserType(Register.UserType.patient);	    
	    Map<String, Object> response = new HashMap<>();
	    response.put("totalPatients", totalPatients);
	    return ResponseEntity.ok(response);
	}
	@GetMapping("/admin/completedCheckupsByDate")
	public ResponseEntity<?> getCompletedCheckupsByDate(
	        @RequestParam String date) {

	    LocalDate localDate = LocalDate.parse(date);

	    LocalDateTime start = localDate.atStartOfDay();
	    LocalDateTime end = localDate.atTime(23, 59, 59);

	    long totalCompleted =
	            AppointRepo.countByStatusAndAppointmentDateBetween(
	                    "COMPLETED",
	                    start,
	                    end);

	    Map<String, Object> response = new HashMap<>();
	    response.put("date", date);
	    response.put("totalCompletedCheckups", totalCompleted);

	    return ResponseEntity.ok(response);
	}
	@GetMapping("/admin/cancelledAppointmentsByDate")
	public ResponseEntity<?> getCancelledAppointmentsByDate(
	        @RequestParam String date) {

	    LocalDate localDate = LocalDate.parse(date);

	    LocalDateTime start = localDate.atStartOfDay();
	    LocalDateTime end = localDate.atTime(23, 59, 59);

	    long totalCancelled =
	            AppointRepo.countByStatusAndAppointmentDateBetween(
	                    "CANCELLED",
	                    start,
	                    end);

	    Map<String, Object> response = new HashMap<>();
	    response.put("date", date);
	    response.put("totalCancelledAppointments", totalCancelled);

	    return ResponseEntity.ok(response);
	}
}
