package com.CMS.Register.dto;

import java.time.LocalDateTime;
import com.CMS.Register.entity.EmergencySeverity;
import com.CMS.Register.entity.Intent;
import com.CMS.Register.entity.SessionStatus;

public class ChatSessionSummary {

    private int id;
    private int patientId;
    private String patientName;
    private String patientContact;
    private LocalDateTime startedAt;
    private LocalDateTime lastMessageAt;
    private SessionStatus status;
    private Intent flaggedIntent;
    private EmergencySeverity emergencySeverity;
    private Integer resolvedByAdminId;
    private LocalDateTime resolvedAt;
    private String adminNotes;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getPatientContact() { return patientContact; }
    public void setPatientContact(String patientContact) { this.patientContact = patientContact; }
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