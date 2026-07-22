package com.CMS.Register.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CMS.Register.entity.Intent;
import com.CMS.PaitentDashboard.AppointmentEntity;
import com.CMS.PaitentDashboard.AppointmentRepository;
import com.CMS.DoctorDashboard.Prescription;
import com.CMS.DoctorDashboard.PrescriptionRepository;
import com.CMS.Register.entity.Register;
import com.CMS.RegisterRepository.RegisterRepo;
//import com.CMS.Register.repository.RegisterRepository; // <-- CONFIRM this path matches your project

@Service
public class BotResponseService {

    private static final String EMERGENCY_TEMPLATE =
        "This may be a medical emergency. Please call your local emergency number " +
        "or go to the nearest emergency room immediately. Our staff has also been notified and will follow up with you.";

    private static final String SERVICE_UNAVAILABLE_TEMPLATE =
        "I've noted your request and forwarded it to our admin team. They'll get back to you shortly about availability or alternatives.";

    private static final String BOOK_HELP_TEMPLATE =
        "You can book an appointment by searching for a doctor, viewing their available slots, and picking a time that works for you.";

    private static final String CANCEL_HELP_TEMPLATE =
        "To cancel an appointment, go to your Upcoming Appointments and select cancel — you can do this any time before the scheduled time.";

    private static final String PASSWORD_HELP_TEMPLATE =
        "You can reset your password from the login page using 'Forgot Password'. You'll receive a 6-digit OTP by email, valid for 5 minutes.";

    private static final String FALLBACK_TEMPLATE =
        "I can help with appointments, prescriptions, or clinic services. Could you tell me more about what you need?";

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private RegisterRepo registerRepository;

    public String generateReply(Intent intent, int patientId) {
        switch (intent) {
            case EMERGENCY:
                return EMERGENCY_TEMPLATE;

            case SERVICE_UNAVAILABLE:
                return SERVICE_UNAVAILABLE_TEMPLATE;

            case BOOK_APPOINTMENT_HELP:
                return BOOK_HELP_TEMPLATE;

            case CANCEL_APPOINTMENT_HELP:
                return CANCEL_HELP_TEMPLATE;

            case PASSWORD_HELP:
                return PASSWORD_HELP_TEMPLATE;

            case UPCOMING_APPOINTMENT:
                return buildUpcomingAppointmentReply(patientId);

            case PRESCRIPTION_HISTORY:
                return buildPrescriptionReply(patientId);

            case FALLBACK:
            default:
                return FALLBACK_TEMPLATE;
        }
    }

    private String buildUpcomingAppointmentReply(int patientId) {
        List<AppointmentEntity> all = appointmentRepository.findByPatientId(patientId);
        LocalDateTime now = LocalDateTime.now();

        Optional<AppointmentEntity> next = all.stream()
            .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().isAfter(now))
            .filter(a -> !"CANCELLED".equalsIgnoreCase(a.getStatus())
                      && !"COMPLETED".equalsIgnoreCase(a.getStatus()))
            .min(Comparator.comparing(AppointmentEntity::getAppointmentDate));

        if (next.isEmpty()) {
            return "You don't have any upcoming appointments right now.";
        }

        AppointmentEntity appt = next.get();
        String doctorName = appt.getDoctor() != null ? appt.getDoctor().getdName() : "your doctor";

        return "Your next appointment is with Dr. " + doctorName +
               " on " + appt.getAppointmentDate().toLocalDate() +
               " at " + appt.getAppointmentDate().toLocalTime() + ".";
    }

    private String buildPrescriptionReply(int patientId) {
        Optional<Register> patientOpt = registerRepository.findById(patientId);
        if (patientOpt.isEmpty()) {
            return "I couldn't find your patient record. Please contact the clinic.";
        }

        List<Prescription> prescriptions =
            prescriptionRepository.findByPatientOrderByPrescriptionIdDesc(patientOpt.get());

        if (prescriptions.isEmpty()) {
            return "You don't have any prescriptions on file yet.";
        }

        Prescription latest = prescriptions.get(0);
        String doctorName = latest.getDoctor() != null ? latest.getDoctor().getdName() : "your doctor";
        String diagnosis = latest.getDiagnosis() != null ? latest.getDiagnosis() : "your recent consultation";

        return "Your most recent prescription from Dr. " + doctorName +
               " was for " + diagnosis +
               ". You can view full medicine details in the Prescriptions section of your dashboard.";
    }
}