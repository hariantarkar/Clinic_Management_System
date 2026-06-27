import React, { useEffect, useState } from 'react';
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

export default function DoctorProfile({ doctor, onProfileUpdated }) {
  const [form, setForm] = useState({ email: '', contactNumber: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (doctor) {
      setForm({
        email: doctor.email ?? '',
        contactNumber: doctor.contactNumber ?? '',
      });
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const msg = await updateProfile(form);
      setMessage({ type: 'success', text: typeof msg === 'string' ? msg : 'Profile updated successfully.' });
      onProfileUpdated?.();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (!doctor) {
    return <p className="state-text">Loading profile...</p>;
  }

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
            <h3 className="card-title">Update Contact Details</h3>
            <p className="card-subtitle">Qualification, experience, and specialization can't be changed here.</p>
          </div>
        </div>

        {message && (
          <p className={`state-text ${message.type === 'error' ? 'state-error' : 'state-success'}`}>
            {message.text}
          </p>
        )}

        <form className="dp-form" onSubmit={handleSubmit}>
          <div className="dp-field">
            <label>New Email  </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="dp-field">
            <label>New Contact Number</label>
            <input
              type="text"
              required
              value={form.contactNumber}placeholder='Enter New contcat number'
              onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>
    </>
  );
}
