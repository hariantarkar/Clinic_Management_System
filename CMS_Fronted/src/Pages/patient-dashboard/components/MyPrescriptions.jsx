import React, { useCallback, useEffect, useState } from 'react';
import { getAllPrescriptions, getLastPrescription } from '../api/patientApi';
import EmptyState from './EmptyState';
import { PrescriptionIcon } from './icons';

// Doctor.java's getter is getdName() (lowercase d), so Jackson serializes
// the nested doctor's name as "dName" (capital N).
function getDoctorName(doctor) {
  if (!doctor) return '—';
  return doctor.dName ?? doctor.dname ?? doctor.name ?? '—';
}

function formatDate(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyPrescriptions({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [lastPrescription, setLastPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrescriptions = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const [all, last] = await Promise.all([
        getAllPrescriptions(patientId),
        getLastPrescription(patientId).catch(() => null), // no prescriptions yet is not a hard error
      ]);
      setPrescriptions(Array.isArray(all) ? all : all?.prescriptions || []);
      setLastPrescription(last);
    } catch (err) {
      setError(err.message || 'Could not load your prescriptions.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  // Prescription entity has `consultationCompleted` (Boolean) — that's the
  // real "active vs done" signal, there is no `status` field.
  const activeCount = prescriptions.filter((p) => !p.consultationCompleted).length;

  // getLastPrescription returns a Medicine row, with the full Prescription
  // nested under `.prescription` (doctor/appointment/diagnosis/remarks live there).
  const lastRx = lastPrescription?.prescription;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">My Prescriptions</h2>
          <p className="page-subtitle">View and manage your prescribed medications and treatment records.</p>
        </div>
        <span className="top-pill">{activeCount} Active Prescriptions</span>
      </header>

      {lastPrescription && (
        <section className="card highlight-card">
          <div className="card-header">
            <div className="icon-circle"><PrescriptionIcon /></div>
            <div>
              <h3 className="card-title">Most Recent Prescription</h3>
              <p className="card-subtitle">
                From Dr. {getDoctorName(lastRx?.doctor)} on{' '}
                {formatDate(lastRx?.createdAt ?? lastRx?.appointment?.appointmentDate)}
              </p>
            </div>
          </div>
          <p className="record-notes">
            <strong>{lastPrescription.medicineName ?? '—'}</strong>
            {lastPrescription.dosage ? ` — ${lastPrescription.dosage}` : ''}
            {lastPrescription.instructions ? ` · ${lastPrescription.instructions}` : ''}
          </p>
          {lastRx?.diagnosis && (
            <p className="record-notes" style={{ marginTop: 6, color: 'var(--text-gray)' }}>
              Diagnosis: {lastRx.diagnosis}
            </p>
          )}
        </section>
      )}

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><PrescriptionIcon /></div>
          <div>
            <h3 className="card-title">Prescription Records</h3>
            <p className="card-subtitle">View prescribed medicines and treatment guidance.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-text">Loading prescriptions...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : prescriptions.length === 0 ? (
          <EmptyState
            icon={<PrescriptionIcon />}
            title="No Prescriptions Found"
            subtitle="Your prescriptions will appear here after doctor consultations."
          />
        ) : (
          <div className="table-grid">
            <div className="table-grid-header grid-cols-prescriptions">
              <span>Doctor</span>
              <span>Date</span>
              <span>Diagnosis</span>
              <span>Remarks</span>
              <span>Status</span>
            </div>
            {prescriptions.map((p) => {
              const id = p.prescriptionId ?? p.id;
              const completed = !!p.consultationCompleted;
              return (
                <div key={id} className="table-grid-row grid-cols-prescriptions">
                  <div className="doctor-name">Dr. {getDoctorName(p.doctor)}</div>
                  <div>{formatDate(p.createdAt ?? p.appointment?.appointmentDate)}</div>
                  <div>{p.diagnosis ?? '—'}</div>
                  <div>{p.remarks ?? '—'}</div>
                  <div>
                    <span className={`status-badge status-${completed ? 'completed' : 'scheduled'}`}>
                      {completed ? 'Completed' : 'Pending'}
                    </span>
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