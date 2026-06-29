import React, { useEffect, useState } from 'react';
import { getLastVisit, getPatientPrescriptions, getMedicinesByPatient } from '../api/doctorApi';
import './PatientHistoryPanel.css';

function PillIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="9" transform="rotate(45 12 12)" />
      <line x1="8" y1="16" x2="16" y2="8" />
    </svg>
  );
}

function formatDate(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PatientHistoryPanel({ doctorId, patient }) {
  const patientId = patient?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!doctorId || !patientId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [visit, allRx, allMeds] = await Promise.all([
          getLastVisit(doctorId, patientId).catch(() => null),
          getPatientPrescriptions(patientId).catch(() => []),
          getMedicinesByPatient(patientId).catch(() => []),
        ]);
        if (!active) return;

        if (!visit) {
          setLastVisit(null);
          setLoading(false);
          return;
        }

        const rxList = Array.isArray(allRx) ? allRx : allRx?.prescriptions || [];
        const medList = Array.isArray(allMeds) ? allMeds : allMeds?.medicines || [];

        const matchingRx = rxList.find((rx) => rx.appointment?.appointmentId === visit.appointmentId);
        const matchingMeds = matchingRx
          ? medList.filter((m) => m.prescription?.prescriptionId === matchingRx.prescriptionId)
          : [];

        setLastVisit(visit);
        setPrescription(matchingRx ?? null);
        setMedicines(matchingMeds);
      } catch (err) {
        if (active) setError(err.message || 'Could not load patient history.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [doctorId, patientId]);

  if (loading) {
    return (
      <div className="ph-panel">
        <p className="state-text">Loading patient history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ph-panel">
        <p className="state-text state-error">{error}</p>
      </div>
    );
  }

  if (!lastVisit) {
    return (
      <div className="ph-panel">
        <p className="state-text">No previous completed visits with this doctor yet.</p>
      </div>
    );
  }

  return (
    <div className="ph-panel">
      <div className="ph-summary">
        <span className="ph-summary-label">Last Visit</span>
        <p className="ph-summary-value">{formatDate(lastVisit.appointmentDate)}</p>

        {prescription?.diagnosis && (
          <>
            <span className="ph-summary-label">Diagnosis</span>
            <p className="ph-summary-value">{prescription.diagnosis}</p>
          </>
        )}
        {prescription?.remarks && (
          <>
            <span className="ph-summary-label">Remarks</span>
            <p className="ph-summary-value">{prescription.remarks}</p>
          </>
        )}
      </div>

      {medicines.length > 0 ? (
        <div className="ph-medicine-list">
          {medicines.map((m) => (
            <div key={m.medicineId} className="ph-medicine-chip">
              <PillIcon className="ph-pill-icon" />
              <span>
                <strong>{m.medicineName}</strong>
                {m.dosage ? ` — ${m.dosage}` : ''}
                {m.instructions ? ` · ${m.instructions}` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="record-notes">No medicines recorded for the last visit.</p>
      )}
    </div>
  );
}