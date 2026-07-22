package com.CMS.Register.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private int id;

    @Column(name = "session_id", nullable = false)
    private int sessionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender")
    private Sender sender;

    @Column(name = "content", length = 2000, nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "intent")
    private Intent intent;

    @Column(name = "triggered_emergency")
    private boolean triggeredEmergency = false;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    // getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }
    public Sender getSender() { return sender; }
    public void setSender(Sender sender) { this.sender = sender; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Intent getIntent() { return intent; }
    public void setIntent(Intent intent) { this.intent = intent; }
    public boolean isTriggeredEmergency() { return triggeredEmergency; }
    public void setTriggeredEmergency(boolean triggeredEmergency) { this.triggeredEmergency = triggeredEmergency; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
