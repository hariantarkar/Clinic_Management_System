import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addSlot, getUpcomingSlots, updateSlot } from '../api/doctorApi';
import EmptyState from '../../patient-dashboard/components/EmptyState';
import { CalendarPlusIcon } from '../../patient-dashboard/components/icons';
import './ManageSlots.css';

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" (no seconds/timezone)
function toLocalInputValue(dateTimeStr) {
  if (!dateTimeStr) return '';
  const d = new Date(dateTimeStr);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ManageSlots({ doctorId }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ startTime: '', endTime: '', appointmentDuration: 30 });
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const messageTimeoutRef = useRef(null);

  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editForm, setEditForm] = useState({ startTime: '', endTime: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  // Clear any pending auto-dismiss timer if the component unmounts
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const showFormMessage = (msg) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setFormMessage(msg);
    messageTimeoutRef.current = setTimeout(() => setFormMessage(null), 4000);
  };

  const loadSlots = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingSlots(doctorId);
      setSlots(Array.isArray(data) ? data : data?.slots || []);
    } catch (err) {
      setError(err.message || 'Could not load your slots.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!doctorId) return;
    setSubmitting(true);
    try {
      await addSlot(doctorId, {
        startTime: form.startTime,
        endTime: form.endTime,
        appointmentDuration: Number(form.appointmentDuration),
      });
      showFormMessage({ type: 'success', text: 'Slot added successfully.' });
      setForm({ startTime: '', endTime: '', appointmentDuration: 30 });
      loadSlots();
    } catch (err) {
      showFormMessage({ type: 'error', text: err.message || 'Could not add slot.' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (slot) => {
    setEditingSlotId(slot.slotId ?? slot.id);
    setEditForm({
      startTime: toLocalInputValue(slot.startTime),
      endTime: toLocalInputValue(slot.endTime),
    });
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditForm({ startTime: '', endTime: '' });
  };

  const saveEdit = async (slotId) => {
    setSavingEdit(true);
    try {
      await updateSlot(slotId, {
        startTime: editForm.startTime,
        endTime: editForm.endTime,
      });
      cancelEdit();
      showFormMessage({ type: 'success', text: 'Slot updated successfully.' });
      loadSlots();
    } catch (err) {
      showFormMessage({ type: 'error', text: err.message || 'Could not update slot.' });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Manage Slots</h2>
          <p className="page-subtitle">Create consultation slots and edit upcoming ones.</p>
        </div>
        <span className="top-pill">{slots.length} Upcoming Slots</span>
      </header>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><CalendarPlusIcon /></div>
          <div>
            <h3 className="card-title">Add New Slot</h3>
            <p className="card-subtitle">Define a time block and the duration per appointment.</p>
          </div>
        </div>

        {formMessage && (
          <p className={`state-text ${formMessage.type === 'error' ? 'state-error' : 'state-success'}`}>
            {formMessage.text}
          </p>
        )}

        <form className="ms-form" onSubmit={handleAddSlot}>
          <div className="ms-form-field">
            <label>Start Time</label>
            <input
              type="datetime-local"
              required
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            />
          </div>
          <div className="ms-form-field">
            <label>End Time</label>
            <input
              type="datetime-local"
              required
              value={form.endTime}
              onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
            />
          </div>
          <div className="ms-form-field">
            <label>Appointment Duration (minutes)</label>
            <input
              type="number"
              min="5"
              required
              value={form.appointmentDuration}
              onChange={(e) => setForm((f) => ({ ...f, appointmentDuration: e.target.value }))}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Slot'}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><CalendarPlusIcon /></div>
          <div>
            <h3 className="card-title">Upcoming Slots</h3>
            <p className="card-subtitle">Slots still open for booking.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-text">Loading slots...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : slots.length === 0 ? (
          <EmptyState
            icon={<CalendarPlusIcon />}
            title="No Upcoming Slots"
            subtitle="Add a slot above to start accepting bookings."
          />
        ) : (
          <div className="ms-slot-list">
            {slots.map((slot) => {
              const slotId = slot.slotId ?? slot.id;
              const isEditing = editingSlotId === slotId;
              return (
                <div key={slotId} className="ms-slot-row">
                  {isEditing ? (
                    <>
                      <input
                        type="datetime-local"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))}
                      />
                      <span className="ms-arrow">→</span>
                      <input
                        type="datetime-local"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))}
                      />
                      <div className="ms-row-actions">
                        <button className="btn-primary" disabled={savingEdit} onClick={() => saveEdit(slotId)}>
                          {savingEdit ? 'Saving...' : 'Save'}
                        </button>
                        <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ms-slot-time">
                        {formatDateTime(slot.startTime)} – {formatDateTime(slot.endTime)}
                      </div>
                      <div className="ms-slot-meta">
                        {slot.bookedAppointments ?? 0} / {slot.maxAppointments ?? '—'} booked ·{' '}
                        {slot.appointmentDuration ?? '—'} min each
                      </div>
                      <div className="ms-row-actions">
                        <button className="btn-cancel" onClick={() => startEdit(slot)}>Edit</button>
                      </div>
                    </>
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
