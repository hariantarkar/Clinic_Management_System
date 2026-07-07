package com.CMS.PaitentDashboard;
import java.time.LocalDateTime;
import java.util.List;
import com.CMS.AdminSideEntity.Doctor;
import com.CMS.AdminSideEntity.DoctorSlot;
public class SlotAvailabilityResponse {

	private Long slotId;
    private Doctor doctor;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer appointmentDuration;
    private boolean available;
    private Integer bookedAppointments;
    private Integer maxAppointments;
    private List<LocalDateTime> bookedTimes;

    public SlotAvailabilityResponse(DoctorSlot slot, List<LocalDateTime> bookedTimes) {
        this.slotId = slot.getSlotId();
        this.doctor = slot.getDoctor();
        this.startTime = slot.getStartTime();
        this.endTime = slot.getEndTime();
        this.appointmentDuration = slot.getAppointmentDuration();
        this.available = slot.isAvailable();
        this.bookedAppointments = slot.getBookedAppointments();
        this.maxAppointments = slot.getMaxAppointments();
        this.bookedTimes = bookedTimes;
    }

    // getters (needed for JSON serialization)
    public Long getSlotId() { return slotId; }
    public Doctor getDoctor() { return doctor; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public Integer getAppointmentDuration() { return appointmentDuration; }
    public boolean isAvailable() { return available; }
    public Integer getBookedAppointments() { return bookedAppointments; }
    public Integer getMaxAppointments() { return maxAppointments; }
    public List<LocalDateTime> getBookedTimes() { return bookedTimes; }
}
