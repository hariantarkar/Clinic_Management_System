package com.CMS.Register.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "chat_session")
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private int id;

    @Column(name = "patient_id", nullable = false)
    private int patientId; // FK -> Register.id, kept as raw int like Register does

    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SessionStatus status = SessionStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "flagged_intent")
    private Intent flaggedIntent = Intent.FALLBACK; // highest-priority intent seen so far

    @Enumerated(EnumType.STRING)
    @Column(name = "emergency_severity")
    //private EmergencySeverity emergencySeverity = EmergencySeverity.NONE;
    private EmergencySeverity emergencySeverity=EmergencySeverity.NONE;

    @Column(name = "resolved_by_admin_id")
    private Integer resolvedByAdminId; // nullable, FK -> Register.id (admin)

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "admin_notes", length = 1000)
    private String adminNotes;

    // getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    public Intent getFlaggedIntent() { return flaggedIntent; }
    public void setFlaggedIntent(Intent flaggedIntent) { this.flaggedIntent = flaggedIntent; }
    public EmergencySeverity getEmergencySeverity() { return emergencySeverity; }
    public void setEmergencySeverity(EmergencySeverity emergencySeverity) { this.emergencySeverity = emergencySeverity; }
    public Integer getResolvedByAdminId() { return resolvedByAdminId; }
    public void setResolvedByAdminId(Integer resolvedByAdminId) { this.resolvedByAdminId = resolvedByAdminId; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
