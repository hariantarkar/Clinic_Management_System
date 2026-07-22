package com.CMS.RegisterRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CMS.Register.entity.ChatSession;
import com.CMS.Register.entity.Intent;
import com.CMS.Register.entity.SessionStatus;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Integer>{
	 List<ChatSession> findByPatientId(int patientId);

	    List<ChatSession> findByFlaggedIntentAndStatus(Intent intent, SessionStatus status);

	    List<ChatSession> findByFlaggedIntent(Intent intent);
}
