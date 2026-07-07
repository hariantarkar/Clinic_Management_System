package com.CMS.PaitentDashboard;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
	private AppointmentRepository appointmentRepository;
	@Autowired
	private DoctorSlotRepository doctorSlotRepository;
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<Doctor> searchDoctors(String specialization, String keyword) {
        return doctorRepository.searchDoctors(specialization, keyword);
    }
    
    public List<SlotAvailabilityResponse> getAvailableSlots(Long doctorId) {

        List<DoctorSlot> slots = doctorSlotRepository
                .findByDoctorDoctorIdAndAvailableTrueAndEndTimeAfterOrderByStartTimeAsc(
                        doctorId, LocalDateTime.now());

        if (slots.isEmpty()) {
            return List.of();
        }

        List<Long> slotIds = slots.stream().map(DoctorSlot::getSlotId).toList();

        List<AppointmentEntity> bookedAppointments =
                appointmentRepository.findBySlot_SlotIdInAndStatus(slotIds, "Booked");

        Map<Long, List<LocalDateTime>> bookedTimesBySlot = bookedAppointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getSlot().getSlotId(),
                        Collectors.mapping(AppointmentEntity::getAppointmentDate, Collectors.toList())
                ));

        return slots.stream()
                .map(slot -> new SlotAvailabilityResponse(
                        slot,
                        bookedTimesBySlot.getOrDefault(slot.getSlotId(), List.of())
                ))
                .toList();
    }
	
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
