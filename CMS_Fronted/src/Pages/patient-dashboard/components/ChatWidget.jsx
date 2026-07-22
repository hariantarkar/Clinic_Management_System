import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import { ChatIcon, CloseIcon, SendIcon, AlertTriangleIcon } from './icons';
import { startChatSession, sendChatMessage, getChatHistory } from '../api/Chatapi';
import './ChatWidget.css';

const SUGGESTIONS = [
  { label: 'Book an appointment', text: 'How do I book an appointment?' },
  { label: 'My upcoming appointment', text: 'When is my next appointment?' },
  { label: 'My prescriptions', text: 'Show my prescriptions' },
  { label: 'Forgot password', text: 'I forgot my password' },
];

export default function ChatWidget({ patientId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [hasActiveEmergency, setHasActiveEmergency] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const storageKey = `clinic_chat_session_${patientId}`;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Resume an existing session for this tab if one exists, otherwise start fresh on first open
  const ensureSession = useCallback(async () => {
    if (sessionId) return sessionId;

    setIsLoadingSession(true);
    setError('');
    try {
      const savedId = sessionStorage.getItem(storageKey);
      if (savedId) {
        const history = await getChatHistory(savedId);
        setSessionId(Number(savedId));
        setMessages(history);
        setHasActiveEmergency(history.some((m) => m.triggeredEmergency));
        return Number(savedId);
      }

      const session = await startChatSession(patientId);
      sessionStorage.setItem(storageKey, session.id);
      setSessionId(session.id);
      setMessages([
        {
          sender: 'BOT',
          content: "Hi, I'm the Clinic Assistant. Ask me about appointments, prescriptions, or clinic services — and let me know right away if this is a medical emergency.",
          intent: 'FALLBACK',
          triggeredEmergency: false,
          timestamp: new Date().toISOString(),
        },
      ]);
      return session.id;
    } catch (err) {
      setError(err.message || 'Could not start chat. Please try again.');
      return null;
    } finally {
      setIsLoadingSession(false);
    }
  }, [sessionId, patientId, storageKey]);

  const handleOpen = async () => {
    setIsOpen(true);
    await ensureSession();
  };

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? inputValue).trim();
    if (!text || isSending) return;

    const activeSessionId = await ensureSession();
    if (!activeSessionId) return;

    const optimisticPatientMsg = {
      sender: 'PATIENT',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticPatientMsg]);
    setInputValue('');
    setIsSending(true);
    setError('');

    try {
      const response = await sendChatMessage(activeSessionId, text);
      const botMsg = {
        sender: 'BOT',
        content: response.botReply,
        intent: response.intent,
        triggeredEmergency: response.emergency,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      if (response.emergency) setHasActiveEmergency(true);
    } catch (err) {
      setError(err.message || 'Message failed to send. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="chat-launcher" onClick={handleOpen} aria-label="Open clinic assistant">
          <ChatIcon />
          {hasActiveEmergency && <span className="chat-launcher-badge" />}
        </button>
      )}

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="chat-header-info">
              <span className="chat-status-dot" />
              <div>
                <p className="chat-header-title">Clinic Assistant</p>
                <p className="chat-header-subtitle">Here to help, any time</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </div>

          {hasActiveEmergency && (
            <div className="chat-emergency-banner">
              <AlertTriangleIcon className="chat-emergency-banner-icon" />
              <span>Clinic staff has been notified about a possible emergency in this conversation.</span>
            </div>
          )}

          <div className="chat-messages">
            {isLoadingSession && messages.length === 0 ? (
              <div className="chat-loading-state">Connecting to assistant…</div>
            ) : (
              messages.map((m, i) => <ChatMessage key={i} message={m} />)
            )}

            {isSending && (
              <div className="chat-row chat-row-bot">
                <div className="chat-typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && !isSending && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  className="chat-suggestion-chip"
                  onClick={() => handleSend(s.text)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {error && <div className="chat-error-banner">{error}</div>}

          <div className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={isSending || !inputValue.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
