package com.CMS.RegisterController;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.CMS.Register.dto.*;
import com.CMS.Register.entity.ChatMessage;
import com.CMS.Register.entity.ChatSession;
import com.CMS.Register.service.ChatService;

@RestController
public class ChatController {

    @Autowired private ChatService chatService;

    @PostMapping("/patient/start/{patientId}")
    public ChatSession start(@PathVariable int patientId) {
        return chatService.startSession(patientId);
    }

    @PostMapping("/patient/message")
    public ChatMessageResponse sendMessage(@RequestBody ChatMessageRequest request) {
        return chatService.handleMessage(request.getSessionId(), request.getMessage());
    }

    @GetMapping("/patient/history/{sessionId}")
    public List<ChatMessage> history(@PathVariable int sessionId) {
        return chatService.getHistory(sessionId);
    }

    @GetMapping("/patient/sessions/{patientId}")
    public List<ChatSession> sessions(@PathVariable int patientId) {
        return chatService.getSessionsForPatient(patientId);
    }
}