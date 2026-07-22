package com.CMS.Register.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CMS.Register.dto.ChatMessageResponse;
import com.CMS.Register.dto.ChatSessionSummary;
import com.CMS.Register.entity.*;
import com.CMS.RegisterRepository.ChatMessageRepository;
import com.CMS.RegisterRepository.ChatSessionRepository;
import com.CMS.RegisterRepository.RegisterRepo;

@Service
public class ChatService {

    @Autowired 
    private ChatSessionRepository sessionRepo;
    
    @Autowired private ChatMessageRepository messageRepo;
    @Autowired private IntentClassifierService classifierService;
    @Autowired private BotResponseService botResponseService;
    @Autowired private RegisterRepo registerRepository;

    public ChatSession startSession(int patientId) {
        ChatSession session = new ChatSession();
        session.setPatientId(patientId);
        return sessionRepo.save(session);
    }

    public ChatMessageResponse handleMessage(int sessionId, String rawMessage) {
        ChatSession session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Chat session not found: " + sessionId));

        // 1. Classify BEFORE saving, so we know how to tag the stored message
        IntentClassifierService.ClassificationResult result = classifierService.classify(rawMessage);
        boolean isEmergency = result.getIntent() == Intent.EMERGENCY;
        boolean isServiceRequest = result.getIntent() == Intent.SERVICE_UNAVAILABLE;
        boolean isEscalating = isEmergency || isServiceRequest;

        // 2. Save patient message
        ChatMessage inbound = new ChatMessage();
        inbound.setSessionId(sessionId);
        inbound.setSender(Sender.PATIENT);
        inbound.setContent(rawMessage);
        inbound.setIntent(result.getIntent());
        inbound.setTriggeredEmergency(isEmergency);
        messageRepo.save(inbound);

        // 3. If this session was previously resolved/closed but the patient is now
        //    raising a fresh emergency or service request, reopen it — otherwise a
        //    genuine new emergency would silently vanish from the admin's active queue.
        if (session.getStatus() == SessionStatus.CLOSED && isEscalating) {
            session.setStatus(SessionStatus.ACTIVE);
            session.setResolvedByAdminId(null);
            session.setResolvedAt(null);
            session.setAdminNotes(null);
        }

        // 4. Update session-level flags — emergency always wins and never gets
        //    downgraded by a later service-request message in the same session.
        if (isEmergency) {
            session.setFlaggedIntent(Intent.EMERGENCY);
            if (result.getSeverity().ordinal() > session.getEmergencySeverity().ordinal()) {
                session.setEmergencySeverity(result.getSeverity());
            }
        } else if (isServiceRequest && session.getFlaggedIntent() != Intent.EMERGENCY) {
            session.setFlaggedIntent(Intent.SERVICE_UNAVAILABLE);
        }

        session.setLastMessageAt(LocalDateTime.now());
        sessionRepo.save(session);

        // 5. Generate bot reply
        String botReply = botResponseService.generateReply(result.getIntent(), session.getPatientId());

        // 6. Save bot message
        ChatMessage outbound = new ChatMessage();
        outbound.setSessionId(sessionId);
        outbound.setSender(Sender.BOT);
        outbound.setContent(botReply);
        outbound.setIntent(result.getIntent());
        messageRepo.save(outbound);

        return new ChatMessageResponse(botReply, result.getIntent(), isEmergency,
                                        result.getSeverity(), session.getEmergencySeverity());
    }

    public List<ChatMessage> getHistory(int sessionId) {
        return messageRepo.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    public List<ChatSession> getSessionsForPatient(int patientId) {
        return sessionRepo.findByPatientId(patientId);
    }

    public List<ChatSessionSummary> getActiveEmergencies() {
        return sessionRepo.findByFlaggedIntentAndStatus(Intent.EMERGENCY, SessionStatus.ACTIVE)
            .stream().map(this::toSummary).collect(Collectors.toList());
    }

    public List<ChatSessionSummary> getActiveServiceRequests() {
        return sessionRepo.findByFlaggedIntentAndStatus(Intent.SERVICE_UNAVAILABLE, SessionStatus.ACTIVE)
            .stream().map(this::toSummary).collect(Collectors.toList());
    }

    public ChatSession resolveSession(int sessionId, int adminId, String notes) {
        ChatSession session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Chat session not found: " + sessionId));
        session.setStatus(SessionStatus.CLOSED);
        session.setResolvedByAdminId(adminId);
        session.setResolvedAt(LocalDateTime.now());
        session.setAdminNotes(notes);
        return sessionRepo.save(session);
    }

    private ChatSessionSummary toSummary(ChatSession session) {
        ChatSessionSummary summary = new ChatSessionSummary();
        summary.setId(session.getId());
        summary.setPatientId(session.getPatientId());
        summary.setStartedAt(session.getStartedAt());
        summary.setLastMessageAt(session.getLastMessageAt());
        summary.setStatus(session.getStatus());
        summary.setFlaggedIntent(session.getFlaggedIntent());
        summary.setEmergencySeverity(session.getEmergencySeverity());
        summary.setResolvedByAdminId(session.getResolvedByAdminId());
        summary.setResolvedAt(session.getResolvedAt());
        summary.setAdminNotes(session.getAdminNotes());

        Optional<Register> patient = registerRepository.findById(session.getPatientId());
        summary.setPatientName(patient.map(Register::getName).orElse("Unknown patient"));
        summary.setPatientContact(patient.map(Register::getContact).orElse(""));

        return summary;
    }
}