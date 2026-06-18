package com.CMS.AdminDashboard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;
@Service
public class DoctorService {


	 @Autowired
	    private DoctorRepository doctorRepository;

	 	@Autowired
	 	private DoctorSlotRepository slotRepository;
	 	
	 	@Autowired
	 	private RegisterRepo registerRepository;
   
		/*
		 * public Doctor addDoctor(Doctor doctor) { return
		 * doctorRepository.save(doctor); }
		 */
	 	public Doctor addDoctor(Doctor doctor) {

	        Register register = registerRepository
	                .findByEmail(doctor.getEmail())
	                .orElseThrow(() -> new RuntimeException("Doctor not registered"));

	        doctor.setRegister(register);

	        return doctorRepository.save(doctor);
	    }
	  public List<Doctor> getAllDoctors() {
		    return doctorRepository.findAll();
		}
	  
	  public Doctor getDoctorById(Long doctorId) {
		    return doctorRepository.findById(doctorId)
		            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
		}
	  public void deleteDoctor(Long doctorId) {

		    Doctor doctor = doctorRepository.findById(doctorId)
		            .orElseThrow(() ->
		                    new RuntimeException("Doctor not found"));

		    doctorRepository.delete(doctor);
		}
	  public Doctor updateDoctor(Long doctorId, Doctor doctor) {

		    Doctor existingDoctor = doctorRepository.findById(doctorId)
		            .orElseThrow(() ->
		                    new RuntimeException("Doctor not found"));

		    if (doctor.getdName() != null) {
		        existingDoctor.setdName(doctor.getdName());
		    }

		    if (doctor.getEmail() != null) {
		        existingDoctor.setEmail(doctor.getEmail());
		    }

		    if (doctor.getContactNumber() != null) {
		        existingDoctor.setContactNumber(doctor.getContactNumber());
		    }

		    if (doctor.getQualification() != null) {
		        existingDoctor.setQualification(doctor.getQualification());
		    }

		    if (doctor.getExperienceYears() != null) {
		        existingDoctor.setExperienceYears(doctor.getExperienceYears());
		    }

		    if (doctor.getSpecialization() != null) {
		        existingDoctor.setSpecialization(doctor.getSpecialization());
		    }

		    if (doctor.getConsultationFee() != null) {
		        existingDoctor.setConsultationFee(doctor.getConsultationFee());
		    }

		    if (doctor.getActive() != null) {
		        existingDoctor.setActive(doctor.getActive());
		    }

		    return doctorRepository.save(existingDoctor);
		}
	  public List<DoctorSlot> getAvailableSlots(Long doctorId) {

		    return slotRepository
		            .findByDoctorDoctorIdAndAvailableTrue(doctorId);
		}
}
