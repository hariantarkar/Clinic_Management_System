package com.CMS.PaitentDashboard;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CMS.AdminDashboard.DoctorRepository;
import com.CMS.AdminDashboard.DoctorSlotRepository;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;

@Service
public class PatientService {
	@Autowired
    private DoctorRepository doctorRepository;

	@Autowired
	private DoctorSlotRepository doctorSlotRepository;
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<Doctor> searchDoctors(String specialization, String keyword) {
        return doctorRepository.searchDoctors(specialization, keyword);
    }
    


	/*
	 * public List<DoctorSlot> getAvailableSlots(Long doctorId) { return
	 * doctorSlotRepository.findByDoctorDoctorIdAndAvailableTrue(doctorId); }
	 */    
	/*
	 * public List<DoctorSlot> getAvailableSlots(Long doctorId) {
	 * 
	 * return doctorSlotRepository
	 * .findByDoctorDoctorIdAndAvailableTrueOrderByStartTimeAsc(doctorId); }
	 */
    
    public List<DoctorSlot> getAvailableSlots(Long doctorId) {

        return doctorSlotRepository
                .findByDoctorDoctorIdAndAvailableTrueAndStartTimeAfterOrderByStartTimeAsc(
                        doctorId,
                        LocalDateTime.now());
    }

	
}
