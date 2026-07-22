import React, { useState, useEffect } from 'react';
import ChatMessage from '../../patient-dashboard/components/ChatMessage';
import { CloseIcon } from '../../patient-dashboard/components/icons';
import { getSessionTranscript, resolveSession } from '../Api/Adminchatapi';
import './SupportChats.css';

export default function ChatTranscriptModal({ session, onClose, onResolved }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const sessionId = session.id;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getSessionTranscript(sessionId)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load this conversation.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handleResolve = async () => {
    // Shared localStorage key used across all portals in this app.
    // TODO: CONFIRM this is where the logged-in admin's id is actually stored.
    const adminId = localStorage.getItem('patientId');

    if (!adminId) {
      setError('Could not identify the logged-in admin. Please log in again.');
      return;
    }

    setIsResolving(true);
    setError('');
    try {
      await resolveSession(sessionId, Number(adminId), notes);
      onResolved();
    } catch (err) {
      setError(err.message || 'Could not resolve this session.');
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="card-title" style={{ margin: 0 }}>
              {session.patientName || `Patient #${session.patientId}`}
            </p>
            <p className="card-subtitle">
              Session #{sessionId}
              {session.patientContact ? ` · ${session.patientContact}` : ''}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="modal-transcript">
          {isLoading ? (
            <div className="state-text">Loading conversation…</div>
          ) : messages.length === 0 ? (
            <div className="state-text">No messages in this conversation.</div>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} message={m} />)
          )}
        </div>

        <div className="modal-resolve">
          <label className="rx-label" htmlFor="resolve-notes">Resolution notes</label>
          <textarea
            id="resolve-notes"
            className="modal-textarea"
            placeholder="e.g. Called the patient, confirmed status, advised next steps…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          {error && <div className="state-text state-error" style={{ padding: '6px 0' }}>{error}</div>}
          <div className="modal-resolve-actions">
            <button className="btn-cancel" onClick={onClose} disabled={isResolving}>
              Close
            </button>
            <button className="btn-primary" onClick={handleResolve} disabled={isResolving}>
              {isResolving ? 'Resolving…' : 'Mark as resolved'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
