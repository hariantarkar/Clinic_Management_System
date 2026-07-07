import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAllDoctors, updateDoctor, setDoctorActiveStatus } from '../Api/AdminApi';
import EmptyState from '../../patient-dashboard/components/EmptyState';
import { BriefcaseIcon, RupeeIcon } from '../../patient-dashboard/components/icons';
import DoctorSlotsPanel from '../components/DoctorSlotsPanel';
import './ManageDoctors.css';

const EMPTY_FORM = {
  dName: '',
  email: '',
  contactNumber: '',
  qualification: '',
  experienceYears: '',
  specialization: '',
  consultationFee: '',
};

function getInitials(name) {
  if (!name) return '?';
  const cleaned = name.replace(/^dr\.?\s*/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return initials.toUpperCase();
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editFieldErrors, setEditFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [expandedSlotsId, setExpandedSlotsId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDoctors();
      setDoctors(Array.isArray(data) ? data : data?.doctors || []);
    } catch (err) {
      setError(err.message || 'Could not load doctors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const extractFieldErrors = (err) => {
    const data = err.response?.data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data;
    }
    return null;
  };

  const startEdit = (doctor) => {
    setEditingId(doctor.doctorId ?? doctor.id);
    setEditForm({
      dName: doctor.dName ?? doctor.dname ?? '',
      email: doctor.email ?? '',
      contactNumber: doctor.contactNumber ?? '',
      qualification: doctor.qualification ?? '',
      experienceYears: doctor.experienceYears ?? '',
      specialization: doctor.specialization ?? '',
      consultationFee: doctor.consultationFee ?? '',
    });
    setEditFieldErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFieldErrors({});
  };

  const saveEdit = async (doctorId) => {
    setSaving(true);
    setEditFieldErrors({});
    try {
      await updateDoctor(doctorId, {
        ...editForm,
        experienceYears: Number(editForm.experienceYears),
        consultationFee: Number(editForm.consultationFee),
      });
      showMessage({ type: 'success', text: 'Doctor updated successfully.' });
      setEditingId(null);
      loadDoctors();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors) {
        setEditFieldErrors(fieldErrors);
        showMessage({ type: 'error', text: 'Please fix the errors below.' });
      } else {
        showMessage({ type: 'error', text: err.message || 'Could not update doctor.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (doctorId, currentlyActive) => {
    setTogglingId(doctorId);
    try {
      await setDoctorActiveStatus(doctorId, !currentlyActive);
      showMessage({
        type: 'success',
        text: `Doctor ${currentlyActive ? 'deactivated' : 'activated'} successfully.`,
      });
      loadDoctors();
    } catch (err) {
      showMessage({ type: 'error', text: err.message || 'Could not update doctor status.' });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Manage Doctors</h2>
          <p className="page-subtitle">Edit doctor accounts and manage slots.</p>
        </div>
        <span className="top-pill">{doctors.length} Doctors</span>
      </header>

      {message && (
        <p className={`state-text ${message.type === 'error' ? 'state-error' : 'state-success'}`}>
          {message.text}
        </p>
      )}

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">All Doctors</h3>
            <p className="card-subtitle">View and manage every doctor in the system.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-text">Loading doctors...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon />}
            title="No Doctors Found"
            subtitle="Add doctors from the Pending Doctors section."
          />
        ) : (
          <div className="md-list">
            {doctors.map((doctor) => {
              const doctorId = doctor.doctorId ?? doctor.id;
              const isEditing = editingId === doctorId;
              const slotsOpen = expandedSlotsId === doctorId;
              const name = doctor.dName ?? doctor.dname ?? '—';

              return (
                <div key={doctorId} className="md-item">
                  {isEditing ? (
                    <form
                      className="md-form md-edit-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEdit(doctorId);
                      }}
                    >
                      <div className="md-field">
                        <label>Doctor Name</label>
                        <input
                          type="text"
                          value={editForm.dName}
                          onChange={(e) => setEditForm((f) => ({ ...f, dName: e.target.value }))}
                        />
                        {editFieldErrors.dName && <span className="md-field-error">{editFieldErrors.dName}</span>}
                      </div>
                      <div className="md-field">
                        <label>Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                        />
                        {editFieldErrors.email && <span className="md-field-error">{editFieldErrors.email}</span>}
                      </div>
                      <div className="md-field">
                        <label>Contact Number</label>
                        <input
                          type="text"
                          value={editForm.contactNumber}
                          onChange={(e) => setEditForm((f) => ({ ...f, contactNumber: e.target.value }))}
                        />
                        {editFieldErrors.contactNumber && <span className="md-field-error">{editFieldErrors.contactNumber}</span>}
                      </div>
                      <div className="md-field">
                        <label>Qualification</label>
                        <input
                          type="text"
                          value={editForm.qualification}
                          onChange={(e) => setEditForm((f) => ({ ...f, qualification: e.target.value }))}
                        />
                        {editFieldErrors.qualification && <span className="md-field-error">{editFieldErrors.qualification}</span>}
                      </div>
                      <div className="md-field">
                        <label>Specialization</label>
                        <input
                          type="text"
                          value={editForm.specialization}
                          onChange={(e) => setEditForm((f) => ({ ...f, specialization: e.target.value }))}
                        />
                        {editFieldErrors.specialization && <span className="md-field-error">{editFieldErrors.specialization}</span>}
                      </div>
                      <div className="md-field">
                        <label>Experience (Years)</label>
                        <input
                          type="number"
                          min="0"
                          value={editForm.experienceYears}
                          onChange={(e) => setEditForm((f) => ({ ...f, experienceYears: e.target.value }))}
                        />
                        {editFieldErrors.experienceYears && <span className="md-field-error">{editFieldErrors.experienceYears}</span>}
                      </div>
                      <div className="md-field">
                        <label>Consultation Fee (₹)</label>
                        <input
                          type="number"
                          min="1"
                          value={editForm.consultationFee}
                          onChange={(e) => setEditForm((f) => ({ ...f, consultationFee: e.target.value }))}
                        />
                        {editFieldErrors.consultationFee && <span className="md-field-error">{editFieldErrors.consultationFee}</span>}
                      </div>
                      <div className="md-row-actions">
                        <button className="btn-primary" type="submit" disabled={saving}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="btn-cancel" type="button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="md-row">
                      <div className="doctor-cell">
                        <span className="avatar-circle md-avatar">{getInitials(name)}</span>
                        <div>
                          <p className="doctor-name">{name}</p>
                         
                          <p className="doctor-meta">{doctor.qualification ?? '—'}</p>
                           <p className="doctor-meta">{doctor.email ?? '—'}</p>
                        </div>
                      </div>
                      <div className="text-accent">{doctor.specialization ?? '—'}</div>
                      <div>{doctor.experienceYears ?? '—'} Years</div>
                      <div className="text-fee"><RupeeIcon className="inline-icon" />{doctor.consultationFee ?? '—'}</div>
                      <div>
                        <span className={`status-badge ${doctor.active ? 'status-completed' : 'status-cancelled'}`}>
                          {doctor.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="md-row-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => setExpandedSlotsId(slotsOpen ? null : doctorId)}
                        >
                          {slotsOpen ? 'Close' : 'AddSlots'}
                        </button>
                        <button className="btn-cancel" onClick={() => startEdit(doctor)}>
                          Edit
                        </button>
                        <button
                          className="btn-cancel md-delete-btn"
                          disabled={togglingId === doctorId}
                          onClick={() => handleToggleActive(doctorId, doctor.active)}
                        >
                          {togglingId === doctorId
                            ? (doctor.active ? 'Deactivating...' : 'Activating...')
                            : (doctor.active ? 'Deactivate' : 'Activate')}
                        </button>
                      </div>
                    </div>
                  )}

                  {slotsOpen && <DoctorSlotsPanel doctorId={doctorId} />}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}