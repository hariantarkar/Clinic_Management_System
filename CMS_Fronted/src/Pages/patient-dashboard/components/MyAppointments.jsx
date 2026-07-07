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

function isAppointmentPast(appt) {
  const time = new Date(appt.appointmentDate);
  return !Number.isNaN(time.getTime()) && time <= new Date();
}

// The backend only marks an appointment "CANCELLED" or leaves it "Booked" —
// there's no separate "missed"/"no-show" status. So a "Booked" appointment
// whose time has already passed means the patient never attended and staff
// never marked it completed. We treat that as "missed" for display only.
function AppointmentRow({ appt, onCancel, cancellingId, missed }) {
  const id = appt.appointmentId ?? appt.id;
  const statusRaw = appt.status ?? 'Scheduled';
  const statusKey = statusRaw.toLowerCase();

  return (
    <div className="table-grid-row grid-cols-appointments">
      <div>
        <p className="doctor-name">{getDoctorName(appt.doctor)}</p>
        <p className="doctor-meta">{appt.doctor?.specialization ?? '—'}</p>
      </div>
      <div>{formatDate(appt.appointmentDate)}</div>
      <div>{formatTime(appt.appointmentDate)}</div>
      <div>
        <span className={`status-badge ${missed ? 'status-cancelled' : `status-${statusKey}`}`}>
          {missed ? 'Missed' : statusRaw}
        </span>
      </div>
      <div>
        {missed ? (
          <span className="doctor-meta">—</span>
        ) : (
          <button
            className="btn-cancel"
            disabled={cancellingId === id}
            onClick={() => onCancel(id)}
          >
            {cancellingId === id ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyAppointments({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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

  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    setError(null);
    setSuccessMsg(null);
    try {
      const msg = await cancelAppointment(appointmentId);
      setSuccessMsg(typeof msg === 'string' ? msg : 'Appointment cancelled successfully');
      await loadAppointments();
    } catch (err) {
      setError(err.message || 'Could not cancel this appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const upcoming = appointments
    .filter((a) => !isAppointmentPast(a))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const missed = appointments
    .filter((a) => isAppointmentPast(a))
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

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
            <h3 className="card-title">Upcoming Appointments</h3>
            <p className="card-subtitle">Your scheduled consultations, soonest first.</p>
          </div>
        </div>
        {successMsg && <p className="state-text state-success">{successMsg}</p>}

        {loading ? (
          <p className="state-text">Loading appointments...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={<CalendarCheckIcon />}
            title="No Upcoming Appointments"
            subtitle="You don't have any appointments scheduled right now."
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
            {upcoming.map((appt) => (
              <AppointmentRow
                key={appt.appointmentId ?? appt.id}
                appt={appt}
                onCancel={handleCancel}
                cancellingId={cancellingId}
                missed={false}
              />
            ))}
          </div>
        )}
      </section>

      {!loading && !error && missed.length > 0 && (
        <section className="card">
          <div className="card-header">
            <div className="icon-circle"><CalendarCheckIcon /></div>
            <div>
              <h3 className="card-title">Missed Appointments</h3>
              <p className="card-subtitle">Past appointments that were never attended or updated.</p>
            </div>
          </div>
          <div className="table-grid">
            <div className="table-grid-header grid-cols-appointments">
              <span>Doctor</span>
              <span>Date</span>
              <span>Time</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {missed.map((appt) => (
              <AppointmentRow
                key={appt.appointmentId ?? appt.id}
                appt={appt}
                onCancel={handleCancel}
                cancellingId={cancellingId}
                missed={true}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
