package com.CMS.PaitentDashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaitentController {

	@GetMapping("/auth/PaitentPanel")
	public String PaitentProfile() {
		return "welcome paitent profile";
	}
	
	
}
