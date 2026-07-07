import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getPendingDoctors, addDoctorFromRegistration } from '../Api/AdminApi';
import EmptyState from '../../patient-dashboard/components/EmptyState';
import { BriefcaseIcon } from '../../patient-dashboard/components/icons';
import './ManageDoctors.css'; // reuse existing styles

const EMPTY_DETAILS = {
  contactNumber: '',
  qualification: '',
  experienceYears: '',
  specialization: '',
  consultationFee: '',
};

export default function PendingDoctors() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeRegisterId, setActiveRegisterId] = useState(null);
  const [form, setForm] = useState(EMPTY_DETAILS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingDoctors();
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load pending doctors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const extractFieldErrors = (err) => {
    const data = err.response?.data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data;
    }
    return null;
  };

  const startAdd = (registration) => {
    setActiveRegisterId(registration.id);
    setForm({
      ...EMPTY_DETAILS,
      contactNumber: registration.contact ?? '',
    });
    setFieldErrors({});
  };

  const cancelAdd = () => {
    setActiveRegisterId(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e, registerId) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    try {
      await addDoctorFromRegistration(registerId, {
        ...form,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee),
      });
      showMessage({ type: 'success', text: 'Doctor added successfully.' });
      setActiveRegisterId(null);
      loadPending();
    } catch (err) {
      const errs = extractFieldErrors(err);
      if (errs) {
        setFieldErrors(errs);
        showMessage({ type: 'error', text: 'Please fix the errors below.' });
      } else {
        showMessage({ type: 'error', text: err.message || 'Could not add doctor.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Pending Doctors</h2>
          <p className="page-subtitle">Registrations awaiting doctor profile setup.</p>
        </div>
        <span className="top-pill">{pending.length} Pending</span>
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
            <h3 className="card-title">Pending Registrations</h3>
            <p className="card-subtitle">Add doctor details to activate these accounts.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-text">Loading pending doctors...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : pending.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon />}
            title="No Pending Doctors"
            subtitle="All doctor registrations have been processed."
          />
        ) : (
          <div className="md-list">
            {pending.map((registration) => {
              const isActive = activeRegisterId === registration.id;
              return (
                <div key={registration.id} className="md-item">
                  {isActive ? (
                    <form className="md-form" onSubmit={(e) => handleSubmit(e, registration.id)}>
                      <div className="md-field">
                        <label>Name</label>
                        <input type="text" value={registration.name} disabled />
                        {fieldErrors.dName && <span className="md-field-error">{fieldErrors.dName}</span>}
                      </div>
                      <div className="md-field">
                        <label>Email</label>
                        <input type="email" value={registration.email} disabled />
                          {fieldErrors.email && <span className="md-field-error">{fieldErrors.email}</span>}
                      </div>
                      <div className="md-field">
                        <label>Contact Number</label>
                        <input
                          type="text"
                          required
                          value={form.contactNumber}
                          onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
                        />
                        {fieldErrors.contactNumber && <span className="md-field-error">{fieldErrors.contactNumber}</span>}
                      </div>
                      <div className="md-field">
                        <label>Qualification</label>
                        <input
                          type="text"
                          required
                          value={form.qualification}
                          onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
                        />
                        {fieldErrors.qualification && <span className="md-field-error">{fieldErrors.qualification}</span>}
                      </div>
                      <div className="md-field">
                        <label>Specialization</label>
                        <input
                          type="text"
                          required
                          value={form.specialization}
                          onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
                        />
                        {fieldErrors.specialization && <span className="md-field-error">{fieldErrors.specialization}</span>}
                      </div>
                      <div className="md-field">
                        <label>Experience (Years)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={form.experienceYears}
                          onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
                        />
                        {fieldErrors.experienceYears && <span className="md-field-error">{fieldErrors.experienceYears}</span>}
                      </div>
                      <div className="md-field">
                        <label>Consultation Fee (₹)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={form.consultationFee}
                          onChange={(e) => setForm((f) => ({ ...f, consultationFee: e.target.value }))}
                        />
                        {fieldErrors.consultationFee && <span className="md-field-error">{fieldErrors.consultationFee}</span>}
                      </div>
                      <div className="md-row-actions">
                        <button className="btn-primary" type="submit" disabled={submitting}>
                          {submitting ? 'Adding...' : 'Confirm & Add Doctor'}
                        </button>
                        <button className="btn-cancel" type="button" onClick={cancelAdd}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="md-row">
                      <div className="doctor-cell">
                        <div>
                          <p className="doctor-name">{registration.name}</p>
                          <p className="doctor-meta">{registration.email}</p>
                        </div>
                      </div>
                      <div>{registration.contact}</div>
                      <div className="md-row-actions">
                        <button className="btn-primary" onClick={() => startAdd(registration)}>
                          Add Doctor
                        </button>
                      </div>
                    </div>
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