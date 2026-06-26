import React, { useCallback, useEffect, useState } from 'react';
import { getUpcomingAppointments, cancelAppointment } from '../api/patientApi';
import EmptyState from './EmptyState';
import { CalendarCheckIcon } from './icons';

// AppointmentEntity only stores one combined "appointmentDate" datetime
// (no separate date/time fields), so split it for display.
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

// Doctor.java's getter is getdName() (lowercase d), so Jackson serializes
// the nested doctor's name as "dName" (capital N) — not "dname"/"name".
function getDoctorName(doctor) {
  if (!doctor) return '—';
  return doctor.dName ?? doctor.dname ?? doctor.name ?? '—';
}

export default function MyAppointments({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingAppointments(patientId);
      setAppointments(Array.isArray(data) ? data : data?.appointments || []);
    } catch (err) {
      setError(err.message || 'Could not load your appointments.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const [successMsg, setSuccessMsg] = useState(null);
  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    setError(null);
    setSuccessMsg(null);
    try {
      await cancelAppointment(appointmentId);
      setSuccessMsg(typeof msg === 'string' ? msg : 'Appointment cancelled successfully');
      await loadAppointments();
    } catch (err) {
      setError(err.message || 'Could not cancel this appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">My Appointments</h2>
          <p className="page-subtitle">Manage and track your upcoming clinic appointments.</p>
        </div>
        <span className="top-pill">{appointments.length} Total Appointments</span>
      </header>

      <section className="card">
        <div className="card-header">
          
          <div className="icon-circle"><CalendarCheckIcon /></div>
          <div>
            <h3 className="card-title">Appointment History</h3>
            <p className="card-subtitle">View and manage your booked consultations.</p>
          </div>
        </div>
        {successMsg && <p className="state-text state-success">{successMsg}</p>}

        {loading ? (
          <p className="state-text">Loading appointments...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={<CalendarCheckIcon />}
            title="No Appointments Found"
            subtitle="You haven't booked any appointments yet."
          />
        ) : (
          <div className="table-grid">
            <div className="table-grid-header grid-cols-appointments">
              <span>Doctor</span>
              <span>Date</span>
              <span>Time</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {appointments.map((appt) => {
              const id = appt.appointmentId ?? appt.id;
              const statusRaw = appt.status ?? 'Scheduled';
              const statusKey = statusRaw.toLowerCase();
              return (
                <div key={id} className="table-grid-row grid-cols-appointments">
                  <div>
                    <p className="doctor-name">Dr. {getDoctorName(appt.doctor)}</p>
                    <p className="doctor-meta">{appt.doctor?.specialization ?? '—'}</p>
                  </div>
                  <div>{formatDate(appt.appointmentDate)}</div>
                  <div>{formatTime(appt.appointmentDate)}</div>
                  <div><span className={`status-badge status-${statusKey}`}>{statusRaw}</span></div>
                  <div>
                    <button
                      className="btn-cancel"
                      disabled={cancellingId === id || statusKey === 'cancelled'}
                      onClick={() => handleCancel(id)}
                    >
                      {cancellingId === id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
