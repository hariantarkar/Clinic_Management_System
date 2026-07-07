import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addSlot, viewSlots, updateSlot } from '../Api/AdminApi';
import './DoctorSlotsPanel.css';

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

function toLocalInputValue(dateTimeStr) {
  if (!dateTimeStr) return '';
  const d = new Date(dateTimeStr);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DoctorSlotsPanel({ doctorId }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ startTime: '', endTime: '', appointmentDuration: 30 });
  const [submitting, setSubmitting] = useState(false);

  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editForm, setEditForm] = useState({ startTime: '', endTime: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const [message, setMessage] = useState(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const showMessage = (msg) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setMessage(msg);
    messageTimeoutRef.current = setTimeout(() => setMessage(null), 4000);
  };

  const loadSlots = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await viewSlots(doctorId);
      setSlots(Array.isArray(data) ? data : data?.slots || []);
    } catch (err) {
      setError(err.message || 'Could not load slots.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addSlot(doctorId, {
        startTime: form.startTime,
        endTime: form.endTime,
        appointmentDuration: Number(form.appointmentDuration),
      });
      showMessage({ type: 'success', text: 'Slot added successfully.' });
      setForm({ startTime: '', endTime: '', appointmentDuration: 30 });
      loadSlots();
    } catch (err) {
      showMessage({ type: 'error', text: err.message || 'Could not add slot.' });
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
      showMessage({ type: 'success', text: 'Slot updated successfully.' });
      loadSlots();
    } catch (err) {
      showMessage({ type: 'error', text: err.message || 'Could not update slot.' });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="dsp-panel">
      {message && (
        <p className={`state-text ${message.type === 'error' ? 'state-error' : 'state-success'}`}>
          {message.text}
        </p>
      )}

      <form className="dsp-form" onSubmit={handleAddSlot}>
        <div className="dsp-field">
          <label>Start Time</label>
          <input
            type="datetime-local"
            required
            value={form.startTime}
            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
          />
        </div>
        <div className="dsp-field">
          <label>End Time</label>
          <input
            type="datetime-local"
            required
            value={form.endTime}
            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
          />
        </div>
        <div className="dsp-field">
          <label>Duration (min)</label>
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

      {loading ? (
        <p className="state-text">Loading slots...</p>
      ) : error ? (
        <p className="state-text state-error">{error}</p>
      ) : slots.length === 0 ? (
        <p className="state-text">No slots yet for this doctor.</p>
      ) : (
        <div className="dsp-slot-list">
          {slots.map((slot) => {
            const slotId = slot.slotId ?? slot.id;
            const isEditing = editingSlotId === slotId;
            return (
              <div key={slotId} className="dsp-slot-row">
                {isEditing ? (
                  <>
                    <input
                      type="datetime-local"
                      value={editForm.startTime}
                      onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))}
                    />
                    <span className="dsp-arrow">→</span>
                    <input
                      type="datetime-local"
                      value={editForm.endTime}
                      onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))}
                    />
                    <div className="dsp-row-actions">
                      <button className="btn-primary" disabled={savingEdit} onClick={() => saveEdit(slotId)}>
                        {savingEdit ? 'Saving...' : 'Save'}
                      </button>
                      <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dsp-slot-time">
                      {formatDateTime(slot.startTime)} – {formatDateTime(slot.endTime)}
                    </div>
                    <div className="dsp-slot-meta">
                      {slot.bookedAppointments ?? 0} / {slot.maxAppointments ?? '—'} booked ·{' '}
                      {slot.appointmentDuration ?? '—'} min each ·{' '}
                      {slot.available ? 'Available' : 'Unavailable'}
                    </div>
                    <div className="dsp-row-actions">
                      <button className="btn-cancel" onClick={() => startEdit(slot)}>Edit</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
