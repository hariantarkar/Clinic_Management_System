package com.CMS.RegisterRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CMS.Register.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    List<ChatMessage> findBySessionIdOrderByTimestampAsc(int sessionId);

}
