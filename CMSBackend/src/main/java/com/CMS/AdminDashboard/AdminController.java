package com.CMS.AdminDashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

	@GetMapping("/auth/adminPanel")
	public String adminProfile() {
		return "welcome admin";
	}
}
