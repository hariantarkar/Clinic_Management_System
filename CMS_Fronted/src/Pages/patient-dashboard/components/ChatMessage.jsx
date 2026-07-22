import React from 'react';
import { AlertTriangleIcon, FlagIcon, BotIcon } from './icons';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }) {
  const isPatient = message.sender === 'PATIENT';
  const isEmergency = message.intent === 'EMERGENCY' || message.triggeredEmergency;
  const isServiceFlag = message.intent === 'SERVICE_UNAVAILABLE';

  if (isPatient) {
    return (
      <div className="chat-row chat-row-patient">
        <div className="chat-bubble chat-bubble-patient">
          <p>{message.content}</p>
        </div>
        <span className="chat-timestamp chat-timestamp-right">{formatTime(message.timestamp)}</span>
      </div>
    );
  }

  // Bot message — three visual tiers: emergency, flagged, normal
  return (
    <div className="chat-row chat-row-bot">
      <div className="chat-avatar">
        <BotIcon />
      </div>
      <div className="chat-bubble-col">
        {isEmergency ? (
          <div className="chat-bubble chat-bubble-emergency">
            <div className="chat-alert-header">
              <AlertTriangleIcon className="chat-alert-icon" />
              <span className="chat-alert-label">Emergency detected</span>
            </div>
            <p>{message.content}</p>
          </div>
        ) : isServiceFlag ? (
          <div className="chat-bubble chat-bubble-flagged">
            <div className="chat-flag-header">
              <FlagIcon className="chat-flag-icon" />
              <span className="chat-flag-label">Forwarded to admin</span>
            </div>
            <p>{message.content}</p>
          </div>
        ) : (
          <div className="chat-bubble chat-bubble-bot">
            <p>{message.content}</p>
          </div>
        )}
        <span className="chat-timestamp">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
