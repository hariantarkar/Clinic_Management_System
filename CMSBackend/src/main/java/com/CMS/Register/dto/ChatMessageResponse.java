package com.CMS.Register.dto;

import com.CMS.Register.entity.EmergencySeverity;
import com.CMS.Register.entity.Intent;

public class ChatMessageResponse {
	private String botReply;
    private Intent intent;
    private boolean emergency;           // true only if THIS message triggered it
    private EmergencySeverity messageSeverity;  // severity of THIS message
    private EmergencySeverity sessionSeverity;  // cumulative severity of the whole session

    public ChatMessageResponse(String botReply, Intent intent, boolean emergency,
                                EmergencySeverity messageSeverity, EmergencySeverity sessionSeverity) {
        this.botReply = botReply;
        this.intent = intent;
        this.emergency = emergency;
        this.messageSeverity = messageSeverity;
        this.sessionSeverity = sessionSeverity;
    }

    public String getBotReply() { return botReply; }
    public Intent getIntent() { return intent; }
    public boolean isEmergency() { return emergency; }
    public EmergencySeverity getMessageSeverity() { return messageSeverity; }
    public EmergencySeverity getSessionSeverity() { return sessionSeverity; }
}
