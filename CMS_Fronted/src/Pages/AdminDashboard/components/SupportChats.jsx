import React, { useState, useEffect, useCallback } from 'react';
import ChatTranscriptModal from './ChattranScriptModal';
import { AlertTriangleIcon, FlagIcon } from '../../patient-dashboard/components/icons';
import { getActiveEmergencies, getActiveServiceRequests } from '../Api/Adminchatapi';
import './SupportChats.css';

const POLL_INTERVAL_MS = 15000;

const SEVERITY_BADGE_CLASS = {
  HIGH: 'status-severity-high',
  MEDIUM: 'status-severity-medium',
  LOW: 'status-severity-low',
  NONE: 'status-scheduled',
};

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SupportChats() {
  const [activeTab, setActiveTab] = useState('emergency');
  const [emergencies, setEmergencies] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchQueues = useCallback(async () => {
    try {
      const [emergencyData, serviceData] = await Promise.all([
        getActiveEmergencies(),
        getActiveServiceRequests(),
      ]);
      setEmergencies(emergencyData);
      setServiceRequests(serviceData);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load support chats.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchQueues]);

  const handleResolved = () => {
    setSelectedSession(null);
    fetchQueues();
  };

  const rows = activeTab === 'emergency' ? emergencies : serviceRequests;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Support Chats</h1>
          <p className="page-subtitle">Live conversations flagged by the clinic assistant</p>
        </div>
        <div className="top-pill top-pill-light">
          {emergencies.length} active emergenc{emergencies.length === 1 ? 'y' : 'ies'}
        </div>
      </div>

      <div className="support-tabs">
        <button
          className={`support-tab ${activeTab === 'emergency' ? 'support-tab-active support-tab-emergency' : ''}`}
          onClick={() => setActiveTab('emergency')}
        >
          <AlertTriangleIcon className="support-tab-icon" />
          Emergencies
          {emergencies.length > 0 && <span className="support-tab-count">{emergencies.length}</span>}
        </button>
        <button
          className={`support-tab ${activeTab === 'service' ? 'support-tab-active support-tab-service' : ''}`}
          onClick={() => setActiveTab('service')}
        >
          <FlagIcon className="support-tab-icon" />
          Service Requests
          {serviceRequests.length > 0 && <span className="support-tab-count">{serviceRequests.length}</span>}
        </button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="state-text">Loading…</div>
        ) : error ? (
          <div className="state-text state-error">{error}</div>
        ) : rows.length === 0 ? (
          <div className="state-text">
            {activeTab === 'emergency'
              ? 'No active emergencies right now.'
              : 'No open service requests right now.'}
          </div>
        ) : (
          <div className="table-grid">
            <div className="table-grid-header grid-cols-support">
              <span>Patient</span>
              <span>Severity</span>
              <span>Started</span>
              <span>Last message</span>
              <span>Status</span>
              <span></span>
            </div>
            {rows.map((session) => (
              <div
                key={session.id}
                className={`table-grid-row grid-cols-support ${
                  activeTab === 'emergency' ? 'row-emergency' : 'row-service'
                }`}
              >
                <div className="doctor-cell">
                  <div className="avatar-circle" />
                  <div>
                    <p className="doctor-name">{session.patientName || `Patient #${session.patientId}`}</p>
                    {session.patientContact && <p className="doctor-meta">{session.patientContact}</p>}
                  </div>
                </div>
                <span>
                  <span className={`status-badge ${SEVERITY_BADGE_CLASS[session.emergencySeverity] || 'status-scheduled'}`}>
                    {session.emergencySeverity}
                  </span>
                </span>
                <span>{formatDateTime(session.startedAt)}</span>
                <span>{formatDateTime(session.lastMessageAt)}</span>
                <span>
                  <span className="status-badge status-booked">{session.status}</span>
                </span>
                <span>
                  <button className="btn-primary" onClick={() => setSelectedSession(session)}>
                    View
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSession && (
        <ChatTranscriptModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onResolved={handleResolved}
        />
      )}
    </div>
  );
}
