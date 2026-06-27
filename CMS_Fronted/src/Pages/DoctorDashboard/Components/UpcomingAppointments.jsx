import React, { useCallback, useEffect, useState } from 'react';
import { getUpcomingAppointments } from '../api/doctorApi';
import EmptyState from '../../patient-dashboard/components/EmptyState';
import ConsultationPanel from './ConsultationPanel';
import { ClipboardListIcon } from '../../patient-dashboard/components/icons';
import './UpcomingAppointments.css';

function formatDate(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function UpcomingAppointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadAppointments = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingAppointments(doctorId);
      setAppointments(Array.isArray(data) ? data : data?.appointments || []);
    } catch (err) {
      setError(err.message || 'Could not load your appointments.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleConsultationDone = () => {
    setExpandedId(null);
    // This list only shows status="BOOKED" appointments — once completed,
    // the appointment naturally drops off after this refresh.
    loadAppointments();
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Upcoming Appointments</h2>
          <p className="page-subtitle">Review bookings and complete consultations.</p>
        </div>
        <span className="top-pill">{appointments.length} Booked</span>
      </header>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><ClipboardListIcon /></div>
          <div>
            <h3 className="card-title">Booked Appointments</h3>
            <p className="card-subtitle">Patients waiting for consultation.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-text">Loading appointments...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={<ClipboardListIcon />}
            title="No Upcoming Appointments"
            subtitle="Booked appointments will appear here."
          />
        ) : (
          <div className="ua-list">
            {appointments.map((appt) => {
              const id = appt.appointmentId ?? appt.id;
              const isExpanded = expandedId === id;
              return (
                <div key={id} className="ua-item">
                  <div className="ua-row">
                    <div>
                      <p className="ua-patient-name">{appt.patient?.name ?? '—'}</p>
                      <p className="ua-patient-meta">
                        {appt.patient?.contact ?? '—'} · {appt.patient?.email ?? '—'}
                      </p>
                    </div>
                    <div className="ua-datetime">
                      <span>{formatDate(appt.appointmentDate)}</span>
                      <span>{formatTime(appt.appointmentDate)}</span>
                    </div>
                    <div>
                      <span className={`status-badge status-${(appt.status ?? 'booked').toLowerCase()}`}>
                        {appt.status ?? 'Booked'}
                      </span>
                    </div>
                    <div>
                      <button className="btn-primary" onClick={() => setExpandedId(isExpanded ? null : id)}>
                        {isExpanded ? 'Close' : 'Start Consultation'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <ConsultationPanel
                      doctorId={doctorId}
                      appointment={appt}
                      onCompleted={handleConsultationDone}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
