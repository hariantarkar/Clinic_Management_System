import React, { useCallback, useEffect, useState } from 'react';
import { getAllPrescriptions, getLastPrescription, getMedicinesByPatient } from '../api/patientApi';
import EmptyState from './EmptyState';
import { PrescriptionIcon } from './icons';

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
  const [lastMedicines, setLastMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrescriptions = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const [all, last, allMedicines] = await Promise.all([
        getAllPrescriptions(patientId),
        getLastPrescription(patientId).catch(() => []),
        getMedicinesByPatient(patientId).catch(() => []),
      ]);

      const allList = Array.isArray(all) ? all : all?.prescriptions || [];
      setPrescriptions(allList);

      // getLastPrescription returns a List<Prescription> ordered desc — "last" is just its first item
      const lastList = Array.isArray(last) ? last : last?.prescriptions || [];
      const lastRx = lastList[0] ?? null;
      setLastPrescription(lastRx);

      const medicineList = Array.isArray(allMedicines) ? allMedicines : allMedicines?.medicines || [];
      setLastMedicines(
        lastRx ? medicineList.filter((m) => m.prescription?.prescriptionId === lastRx.prescriptionId) : []
      );
    } catch (err) {
      setError(err.message || 'Could not load your prescriptions.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const activeCount = prescriptions.filter((p) => !p.consultationCompleted).length;

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">My Prescriptions</h2>
          <p className="page-subtitle">View and manage your prescribed medications and treatment records.</p>
        </div>
        <span className="top-pill">{prescriptions.length} Prescriptions</span>
      </header>

     {lastPrescription && (
  <section className="card highlight-card">
    <div className="card-header">
      <div className="icon-circle"><PrescriptionIcon /></div>
      <div>
        <h3 className="card-title">Most Recent Prescription</h3>
        <p className="card-subtitle">
          From {getDoctorName(lastPrescription.doctor)} on{' '}
          {formatDate(lastPrescription.createdAt ?? lastPrescription.appointment?.appointmentDate)}
        </p>
      </div>
    </div>

    {lastPrescription.diagnosis && (
      <div className="rx-diagnosis">
        <span className="rx-label">Diagnosis</span>
        <p className="rx-diagnosis-text">{lastPrescription.diagnosis}</p>
      </div>
    )}

    {lastMedicines.length > 0 ? (
      <div className="rx-medicine-list">
        {lastMedicines.map((m) => (
          <div key={m.medicineId} className="rx-medicine-card">
             <span className="rx-label">Medicine</span>
            <div className="rx-medicine-name">{m.medicineName}</div>
            <div className="rx-medicine-meta">
              {m.dosage && (
                <span className="rx-pill">
                  <span className="rx-label-inline">Dosage</span> {m.dosage}
                </span>
              )}
              {m.instructions && (
                <span className="rx-pill rx-pill-light">
                  <span className="rx-label-inline">Take</span> {m.instructions}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="record-notes">No medicine details recorded for this prescription.</p>
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
                  <div className="doctor-name">{getDoctorName(p.doctor)}</div>
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