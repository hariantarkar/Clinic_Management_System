package com.CMS.AdminDashboard;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.CMS.Register.dto.ChatSessionSummary;
import com.CMS.Register.dto.ResolveSessionRequest;
import com.CMS.Register.entity.ChatMessage;
import com.CMS.Register.entity.ChatSession;
import com.CMS.Register.service.ChatService;

@RestController
public class AdminChatController {

    @Autowired private ChatService chatService;

    @GetMapping("/admin/emergencies/active")
    public List<ChatSessionSummary> activeEmergencies() {
        return chatService.getActiveEmergencies();
    }

    @GetMapping("/admin/service-requests/active")
    public List<ChatSessionSummary> activeServiceRequests() {
        return chatService.getActiveServiceRequests();
    }

    @GetMapping("/admin/session/{sessionId}") 
    public List<ChatMessage> transcript(@PathVariable int sessionId) {
        return chatService.getHistory(sessionId);
    }

    @PutMapping("/admin/{sessionId}/resolve")
    public ChatSession resolve(@PathVariable int sessionId, @RequestBody ResolveSessionRequest req) {
        return chatService.resolveSession(sessionId, req.getAdminId(), req.getNotes());
    }
}