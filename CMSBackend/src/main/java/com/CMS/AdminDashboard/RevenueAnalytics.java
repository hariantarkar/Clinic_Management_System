package com.CMS.AdminDashboard;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.PaitentDashboard.AppointmentRepository;

@RestController
public class RevenueAnalytics {

	@Autowired
	private AppointmentRepository AppointRepo;
	
	@Autowired
	private DoctorRepository doctorRepository;
	@GetMapping("/admin/totalRevenue")
	public ResponseEntity<?> getTotalRevenue() {

	    Double revenue = AppointRepo.getTotalRevenue();

	    Map<String, Object> response = new HashMap<>();
	    response.put("totalRevenue", revenue);

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/admin/revenueByDoctor")
	public ResponseEntity<?> getRevenueByDoctor(
	        @RequestParam Long doctorId) {

	    Doctor doctor = doctorRepository.findById(doctorId)
	            .orElseThrow(() -> new RuntimeException("Doctor not found"));

	    Double revenue =
	    		AppointRepo.getRevenueByDoctor(doctorId);

	    Map<String,Object> response = new HashMap<>();
	    response.put("doctorId", doctor.getDoctorId());
	    response.put("doctorName", doctor.getdName());
	    response.put("doctorEmail", doctor.getEmail());
	    response.put("revenue", revenue);

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/admin/revenueByDateRange")
	public ResponseEntity<?> getRevenueByDateRange(
	        @RequestParam String from,
	        @RequestParam String to) {

		LocalDateTime start =
		        LocalDate.parse(from).atStartOfDay();

		LocalDateTime end =
		        LocalDate.parse(to).atTime(23, 59, 59);

	    Double revenue =
	    		AppointRepo.getRevenueByDateRange(
	                    start,
	                    end);

	    Map<String, Object> response = new HashMap<>();
	    response.put("from", from);
	    response.put("to", to);
	    response.put("revenue", revenue);

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/admin/revenueByDoctorAndDateRange")
	public ResponseEntity<?> getRevenueByDoctorAndDateRange(
	        @RequestParam Long doctorId,
	        @RequestParam String from,
	        @RequestParam String to) {

	    Doctor doctor = doctorRepository.findById(doctorId)
	            .orElseThrow(() -> new RuntimeException("Doctor not found"));

	    LocalDateTime start =
	            LocalDate.parse(from).atStartOfDay();

	    LocalDateTime end =
	            LocalDate.parse(to).atTime(23, 59, 59);

	    Double revenue =
	            AppointRepo.getRevenueByDoctorAndDateRange(
	                    doctorId,
	                    start,
	                    end);

	    Map<String, Object> response = new HashMap<>();
	    response.put("doctorId", doctor.getDoctorId());
	    response.put("doctorName", doctor.getdName());
	    response.put("doctorEmail", doctor.getEmail());
	    response.put("from", from);
	    response.put("to", to);
	    response.put("revenue", revenue);

	    return ResponseEntity.ok(response);
	}
}
