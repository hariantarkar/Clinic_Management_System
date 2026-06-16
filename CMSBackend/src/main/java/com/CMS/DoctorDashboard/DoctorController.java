package com.CMS.DoctorDashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorController {

	@GetMapping("/auth/doctorPanel")
	public String DoctorProfile() {
		return "welcome doctor profile";
	}
}

