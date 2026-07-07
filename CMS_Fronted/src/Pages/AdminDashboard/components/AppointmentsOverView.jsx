import React, { useCallback, useEffect, useState } from 'react';
import {
  getAllDoctors,
  viewSlots,
  updateSlot,
  getUpcomingAppointments,
  getDayWiseTotalAppointments,
  getCancelledAppointmentsByDoctor,
  getCancelledAppointmentsByDate,
  getCompletedCheckupsByDoctor,
} from '../Api/AdminApi';
import { BriefcaseIcon } from '../../patient-dashboard/components/icons';
import './AppointmentsOverview.css';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function AppointmentsOverview() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(todayStr());

  const [slots, setSlots] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [dayWise, setDayWise] = useState(null);
  const [cancelledByDoctor, setCancelledByDoctor] = useState(null);
  const [cancelledByDate, setCancelledByDate] = useState(null);
  const [completed, setCompleted] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editSlotForm, setEditSlotForm] = useState({ startTime: '', endTime: '' });
  const [savingSlot, setSavingSlot] = useState(false);

  useEffect(() => {
    getAllDoctors()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.doctors || [];
        setDoctors(list);
        if (list.length > 0) {
          setDoctorId(String(list[0].doctorId ?? list[0].id));
        }
      })
      .catch((err) => setError(err.message || 'Could not load doctors.'));
  }, []);

  const loadDoctorData = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const [slotsData, upcomingData, dayWiseData, cancelledDocData, completedData] =
        await Promise.all([
          viewSlots(doctorId),
          getUpcomingAppointments(doctorId),
          getDayWiseTotalAppointments(doctorId, date),
          getCancelledAppointmentsByDoctor(doctorId, date),
          getCompletedCheckupsByDoctor(doctorId, date),
        ]);
      setSlots(Array.isArray(slotsData) ? slotsData : []);
      setUpcoming(Array.isArray(upcomingData) ? upcomingData : []);
      setDayWise(dayWiseData);
      setCancelledByDoctor(cancelledDocData);
      setCompleted(completedData);
    } catch (err) {
      setError(err.message || 'Could not load appointment data.');
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    loadDoctorData();
  }, [loadDoctorData]);

  useEffect(() => {
    getCancelledAppointmentsByDate(date)
      .then(setCancelledByDate)
      .catch(() => setCancelledByDate(null));
  }, [date]);

  const startEditSlot = (slot) => {
    setEditingSlotId(slot.slotId);
    setEditSlotForm({
      startTime: slot.startTime?.slice(0, 16) ?? '',
      endTime: slot.endTime?.slice(0, 16) ?? '',
    });
  };

  const cancelEditSlot = () => setEditingSlotId(null);

  const saveSlot = async (slotId) => {
    setSavingSlot(true);
    try {
      await updateSlot(slotId, {
        startTime: editSlotForm.startTime,
        endTime: editSlotForm.endTime,
      });
      setMessage({ type: 'success', text: 'Slot updated successfully.' });
      setEditingSlotId(null);
      loadDoctorData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not update slot.' });
    } finally {
      setSavingSlot(false);
    }
  };

  const selectedDoctor = doctors.find((d) => String(d.doctorId ?? d.id) === String(doctorId));

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Appointments</h2>
          <p className="page-subtitle">Slots, upcoming appointments, and daily stats by doctor.</p>
        </div>
      </header>

      {message && (
        <p className={`state-text ${message.type === 'error' ? 'state-error' : 'state-success'}`}>
          {message.text}
        </p>
      )}

      <section className="card">
        <div className="ao-filters">
          <div className="md-field">
            <label>Doctor</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
              {doctors.map((d) => (
                <option key={d.doctorId ?? d.id} value={d.doctorId ?? d.id}>
                  {d.dName ?? d.dname}
                </option>
              ))}
            </select>
          </div>
          <div className="md-field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </section>

      {error && <p className="state-text state-error">{error}</p>}

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Day Stats {selectedDoctor ? `— ${selectedDoctor.dName ?? selectedDoctor.dname}` : ''}</h3>
            <p className="card-subtitle">Summary for {date}</p>
          </div>
        </div>
        <div className="ao-stat-grid">
          <div className="ao-stat-card">
            <p className="ao-stat-label">Total Appointments</p>
            <p className="ao-stat-value">{dayWise?.totalAppointments ?? '—'}</p>
          </div>
          <div className="ao-stat-card">
            <p className="ao-stat-label">Completed Checkups</p>
            <p className="ao-stat-value">{completed?.totalCompletedCheckups ?? '—'}</p>
          </div>
          <div className="ao-stat-card">
            <p className="ao-stat-label">Cancelled (this doctor)</p>
            <p className="ao-stat-value">{cancelledByDoctor?.totalCancelledAppointments ?? '—'}</p>
          </div>
          <div className="ao-stat-card">
            <p className="ao-stat-label">Cancelled (all doctors)</p>
            <p className="ao-stat-value">{cancelledByDate?.totalCancelledAppointments ?? '—'}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Slots</h3>
            <p className="card-subtitle">Manage this doctor's time slots.</p>
          </div>
        </div>
        {loading ? (
          <p className="state-text">Loading...</p>
        ) : slots.length === 0 ? (
          <p className="state-text">No slots found.</p>
        ) : (
          <div className="md-list">
            {slots.map((slot) => (
              <div key={slot.slotId} className="md-item">
                {editingSlotId === slot.slotId ? (
                  <div className="ao-slot-edit">
                    <div className="md-field">
                      <label>Start</label>
                      <input
                        type="datetime-local"
                        value={editSlotForm.startTime}
                        onChange={(e) => setEditSlotForm((f) => ({ ...f, startTime: e.target.value }))}
                      />
                    </div>
                    <div className="md-field">
                      <label>End</label>
                      <input
                        type="datetime-local"
                        value={editSlotForm.endTime}
                        onChange={(e) => setEditSlotForm((f) => ({ ...f, endTime: e.target.value }))}
                      />
                    </div>
                    <div className="md-row-actions">
                      <button className="btn-primary" disabled={savingSlot} onClick={() => saveSlot(slot.slotId)}>
                        {savingSlot ? 'Saving...' : 'Save'}
                      </button>
                      <button className="btn-cancel" onClick={cancelEditSlot}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="md-row">
                    <div>{slot.startTime?.replace('T', ' ')} → {slot.endTime?.replace('T', ' ')}</div>
                    <div>{slot.bookedAppointments}/{slot.maxAppointments} booked</div>
                    <div>
                      <span className={`status-badge ${slot.available ? 'status-completed' : 'status-cancelled'}`}>
                        {slot.available ? 'Available' : 'Full'}
                      </span>
                    </div>
                    <div className="md-row-actions">
                      <button className="btn-cancel" onClick={() => startEditSlot(slot)}>Edit</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Upcoming Appointments</h3>
            <p className="card-subtitle">All upcoming bookings for this doctor.</p>
          </div>
        </div>
        {upcoming.length === 0 ? (
          <p className="state-text">No upcoming appointments.</p>
        ) : (
          <div className="md-list">
            {upcoming.map((appt) => (
              <div key={appt.appointmentId} className="md-item">
                <div className="md-row">
                  <div>{appt.patient?.name ?? '—'}</div>
                  <div>{appt.patient?.contact ?? '—'}</div>
                  <div>{appt.appointmentDate?.replace('T', ' ')}</div>
                  <div>
                    <span className="status-badge status-completed">{appt.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
