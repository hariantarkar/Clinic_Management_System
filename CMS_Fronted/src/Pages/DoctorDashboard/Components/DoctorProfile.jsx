import React, { useEffect, useRef, useState } from 'react';
import { updateProfile } from '../api/doctorApi';
import './DoctorProfile.css';

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function DoctorProfile({ doctor, onProfileUpdated,onLogout }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: '', contactNumber: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const messageTimeoutRef = useRef(null);

  // Clear any pending auto-dismiss timer if the component unmounts
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

  const startEditing = () => {
    setForm({
      email: doctor.email ?? '',
      contactNumber: doctor.contactNumber ?? '',
    });
    setFieldErrors({});
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setFieldErrors({});
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((errs) => ({ ...errs, [field]: undefined }));
    }
  };
/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    try {
      const msg = await updateProfile(form);
      showMessage({ type: 'success', text: typeof msg === 'string' ? msg : 'Profile updated successfully.' });
      setEditing(false);
      onProfileUpdated?.();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // 400 from @Valid on DoctorProfileUpdate: { email: "...", contactNumber: "..." }
        setFieldErrors(data);
        showMessage({ type: 'error', text: 'Please fix the errors below and try again.' });
      } else {
        showMessage({ type: 'error', text: err.message || 'Could not update profile.' });
      }
    } finally {
      setSaving(false);
    }
  };
*/
  if (!doctor) {
    return <p className="state-text">Loading profile...</p>;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    const emailChanged = form.email !== doctor.email;
    try {
      const msg = await updateProfile(form);
      setEditing(false);

      if (emailChanged) {
        showMessage({
          type: 'success',
          text: 'Email updated. You\'ll be logged out in a few seconds — please log in again with your new email.',
        });
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
          onLogout?.();
        }, 5000);
      } else {
        showMessage({ type: 'success', text: typeof msg === 'string' ? msg : 'Profile updated successfully.' });
        onProfileUpdated?.();
      }
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setFieldErrors(data);
        showMessage({ type: 'error', text: 'Please fix the errors below and try again.' });
      } else {
        showMessage({ type: 'error', text: err.message || 'Could not update profile.' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">My Profile</h2>
          <p className="page-subtitle">View your details and update contact information.</p>
        </div>
      </header>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><UserIcon /></div>
          <div>
            <h3 className="card-title">{doctor.dName ?? doctor.dname ?? '—'}</h3>
            <p className="card-subtitle">{doctor.specialization ?? '—'} · {doctor.qualification ?? '—'}</p>
          </div>
        </div>

        <div className="dp-readonly-grid">
          <div>
            <span className="dp-label">Experience</span>
            <p className="dp-value">{doctor.experienceYears ?? '—'} Years</p>
          </div>
          <div>
            <span className="dp-label">Consultation Fee</span>
            <p className="dp-value">₹{doctor.consultationFee ?? '—'}</p>
          </div>
          <div>
            <span className="dp-label">Status</span>
            <p className="dp-value">
              <span className={`status-badge ${doctor.active ? 'status-completed' : 'status-cancelled'}`}>
                {doctor.active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><UserIcon /></div>
          <div>
            <h3 className="card-title">Contact Details</h3>
            <p className="card-subtitle">Qualification, experience, and specialization can't be changed here.</p>
          </div>
        </div>

        {message && (
          <p className={`state-text ${message.type === 'error' ? 'state-error' : 'state-success'}`}>
            {message.text}
          </p>
        )}

        {!editing ? (
          <>
            <div className="dp-readonly-grid">
              <div>
                <span className="dp-label">Current Email</span>
                <p className="dp-value">{doctor.email ?? '—'}</p>
              </div>
              <div>
                <span className="dp-label">Current Contact Number</span>
                <p className="dp-value">{doctor.contactNumber ?? '—'}</p>
              </div>
            </div>
            <button className="btn-primary dp-edit-btn" onClick={startEditing}>
              Update Contact Details
            </button>
          </>
        ) : (
          <form className="dp-form" onSubmit={handleSubmit}>
            <div className="dp-field">
              <label>New Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="Enter new email"
              />
              {fieldErrors.email && <span className="dp-field-error">{fieldErrors.email}</span>}
            </div>
            <div className="dp-field">
              <label>New Contact Number</label>
              <input
                type="text"
                required
                value={form.contactNumber}
                onChange={handleChange('contactNumber')}
                placeholder="Enter new contact number"
              />
              {fieldErrors.contactNumber && <span className="dp-field-error">{fieldErrors.contactNumber}</span>}
            </div>
            <div className="dp-form-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="btn-cancel" type="button" onClick={cancelEditing} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
