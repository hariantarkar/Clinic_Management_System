package com.CMS.Register.service;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.CMS.Register.entity.EmergencySeverity;
import com.CMS.Register.entity.Intent;

@Service
public class IntentClassifierService {

    // Checked FIRST, in priority order — emergency keywords win over everything else
    private static final Map<String, EmergencySeverity> EMERGENCY_KEYWORDS = new LinkedHashMap<>();
    static {
        EMERGENCY_KEYWORDS.put("chest pain", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("can't breathe", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("cannot breathe", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("difficulty breathing", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("severe bleeding", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("heavy bleeding", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("unconscious", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("not breathing", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("suicidal", EmergencySeverity.HIGH);
        EMERGENCY_KEYWORDS.put("severe pain", EmergencySeverity.MEDIUM);
        EMERGENCY_KEYWORDS.put("high fever", EmergencySeverity.MEDIUM);
        EMERGENCY_KEYWORDS.put("allergic reaction", EmergencySeverity.MEDIUM);
        EMERGENCY_KEYWORDS.put("dizzy and weak", EmergencySeverity.MEDIUM);
    }

    private static final String[] SERVICE_UNAVAILABLE_KEYWORDS = {
        "don't have", "do not have", "not available", "no doctor for",
        "need an mri", "need mri", "need an icu", "icu bed", "ambulance",
        "you don't provide", "not provided here", "no specialist for"
    };

    private static final String[] BOOK_KEYWORDS = {
        "book an appointment", "how do i book", "want to book", "schedule an appointment", "new appointment"
    };

    private static final String[] CANCEL_KEYWORDS = {
        "cancel my appointment", "cancel appointment", "how do i cancel appointment"
    };

    private static final String[] UPCOMING_APPOINTMENT_KEYWORDS = {
        "my appointment", "when is my appointment", "upcoming appointment", "appointment time", "appointment status"
    };

    private static final String[] PRESCRIPTION_KEYWORDS = {
        "prescription", "medicine", "medication", "refill", "dosage"
    };

    private static final String[] PASSWORD_KEYWORDS = {
    		"forgot password", "forgot my password", "reset password", "reset my password",
    	    "otp", "can't login", "cannot login", "unable to login", "trouble logging in"
    };

    public ClassificationResult classify(String rawMessage) {
        String msg = rawMessage.toLowerCase();

        // 1. Emergency check ALWAYS runs first and wins, even if other keywords also match
        for (Map.Entry<String, EmergencySeverity> entry : EMERGENCY_KEYWORDS.entrySet()) {
            if (msg.contains(entry.getKey())) {
                return new ClassificationResult(Intent.EMERGENCY, entry.getValue());
            }
        }

        if (containsAny(msg, SERVICE_UNAVAILABLE_KEYWORDS)) {
            return new ClassificationResult(Intent.SERVICE_UNAVAILABLE, EmergencySeverity.NONE);
        }
        if (containsAny(msg, BOOK_KEYWORDS)) {
            return new ClassificationResult(Intent.BOOK_APPOINTMENT_HELP, EmergencySeverity.NONE);
        }
        if (containsAny(msg, CANCEL_KEYWORDS)) {
            return new ClassificationResult(Intent.CANCEL_APPOINTMENT_HELP, EmergencySeverity.NONE);
        }
        if (containsAny(msg, UPCOMING_APPOINTMENT_KEYWORDS)) {
            return new ClassificationResult(Intent.UPCOMING_APPOINTMENT, EmergencySeverity.NONE);
        }
        if (containsAny(msg, PRESCRIPTION_KEYWORDS)) {
            return new ClassificationResult(Intent.PRESCRIPTION_HISTORY, EmergencySeverity.NONE);
        }
        if (containsAny(msg, PASSWORD_KEYWORDS)) {
            return new ClassificationResult(Intent.PASSWORD_HELP, EmergencySeverity.NONE);
        }

        return new ClassificationResult(Intent.FALLBACK, EmergencySeverity.NONE);
    }

    private boolean containsAny(String msg, String[] keywords) {
        for (String k : keywords) {
            if (msg.contains(k)) return true;
        }
        return false;
    }

    public static class ClassificationResult {
        private final Intent intent;
        private final EmergencySeverity severity;

        public ClassificationResult(Intent intent, EmergencySeverity severity) {
            this.intent = intent;
            this.severity = severity;
        }
        public Intent getIntent() { return intent; }
        public EmergencySeverity getSeverity() { return severity; }
    }
}