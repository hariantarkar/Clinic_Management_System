import React, { useEffect, useState } from 'react';
import { addPrescription, addMedicine, completeConsultation, getPatientPrescriptions } from '../api/doctorApi';
import './ConsultationPanel.css';

function PillIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="9" transform="rotate(45 12 12)" />
      <line x1="8" y1="16" x2="16" y2="8" />
    </svg>
  );
}

export default function ConsultationPanel({ doctorId, appointment, onCompleted }) {
  const appointmentId = appointment.appointmentId ?? appointment.id;
  const patientId = appointment.patient?.id;

  const [checkingExisting, setCheckingExisting] = useState(true);
  const [prescription, setPrescription] = useState(null); // { prescriptionId, diagnosis, remarks }
  const [medicines, setMedicines] = useState([]);

  const [diagnosis, setDiagnosis] = useState('');
  const [remarks, setRemarks] = useState('');
  const [savingRx, setSavingRx] = useState(false);

  const [medForm, setMedForm] = useState({ medicineName: '', dosage: '', instructions: '' });
  const [savingMed, setSavingMed] = useState(false);

  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState(null);

  // Resume an in-progress consultation if the panel was closed and reopened
  // before "Complete Consultation" was clicked — otherwise a second
  // addPrescription call hits the backend's "Prescription already exists" error.
  useEffect(() => {
    let active = true;
    async function checkExisting() {
      if (!patientId) {
        setCheckingExisting(false);
        return;
      }
      try {
        const all = await getPatientPrescriptions(patientId);
        const list = Array.isArray(all) ? all : all?.prescriptions || [];
        const existing = list.find((rx) => rx.appointment?.appointmentId === appointmentId);
        if (active && existing && !existing.consultationCompleted) {
          setPrescription(existing);
          setDiagnosis(existing.diagnosis ?? '');
          setRemarks(existing.remarks ?? '');
        }
      } catch {
        // No existing prescription for this appointment yet — fine, start fresh.
      } finally {
        if (active) setCheckingExisting(false);
      }
    }
    checkExisting();
    return () => {
      active = false;
    };
  }, [patientId, appointmentId]);

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    setSavingRx(true);
    setMessage(null);
    try {
      const saved = await addPrescription(doctorId, patientId, appointmentId, { diagnosis, remarks });
      setPrescription(saved);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not save diagnosis.' });
    } finally {
      setSavingRx(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!prescription) return;
    setSavingMed(true);
    setMessage(null);
    try {
      const saved = await addMedicine(prescription.prescriptionId, medForm);
      setMedicines((list) => [...list, saved]);
      setMedForm({ medicineName: '', dosage: '', instructions: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not add medicine.' });
    } finally {
      setSavingMed(false);
    }
  };

  const handleComplete = async () => {
    if (!prescription) return;
    setCompleting(true);
    setMessage(null);
    try {
      await completeConsultation(prescription.prescriptionId);
      onCompleted();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not complete consultation.' });
      setCompleting(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="cp-panel">
        <p className="state-text">Checking consultation status...</p>
      </div>
    );
  }

  return (
    <div className="cp-panel">
      {message && (
        <p className={`state-text ${message.type === 'error' ? 'state-error' : 'state-success'}`}>
          {message.text}
        </p>
      )}

      {!prescription ? (
        <form className="cp-form" onSubmit={handleSavePrescription}>
          <div className="cp-field">
            <label>Diagnosis</label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Viral Fever"
            />
          </div>
          <div className="cp-field">
            <label>Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Advice for the patient..."
            />
          </div>
          <button className="btn-primary" type="submit" disabled={savingRx}>
            {savingRx ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      ) : (
        <>
          <div className="cp-summary">
            <span className="cp-summary-label">Diagnosis</span>
            <p className="cp-summary-value">{prescription.diagnosis}</p>
            {prescription.remarks && (
              <>
                <span className="cp-summary-label">Remarks</span>
                <p className="cp-summary-value">{prescription.remarks}</p>
              </>
            )}
          </div>

          {medicines.length > 0 && (
            <div className="cp-medicine-list">
              {medicines.map((m) => (
                <div key={m.medicineId} className="cp-medicine-chip">
                  <PillIcon className="cp-pill-icon" />
                  <span>
                    <strong>{m.medicineName}</strong>
                    {m.dosage ? ` — ${m.dosage}` : ''}
                    {m.instructions ? ` · ${m.instructions}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}

          <form className="cp-form cp-med-form" onSubmit={handleAddMedicine}>
            <div className="cp-field">
              <label>Medicine Name</label>
              <input
                type="text"
                required
                value={medForm.medicineName}
                onChange={(e) => setMedForm((f) => ({ ...f, medicineName: e.target.value }))}
              />
            </div>
            <div className="cp-field">
              <label>Dosage</label>
              <input
                type="text"
                value={medForm.dosage}
                onChange={(e) => setMedForm((f) => ({ ...f, dosage: e.target.value }))}
                placeholder="e.g. 2 Tablet"
              />
            </div>
            <div className="cp-field">
              <label>Instructions</label>
              <input
                type="text"
                value={medForm.instructions}
                onChange={(e) => setMedForm((f) => ({ ...f, instructions: e.target.value }))}
                placeholder="e.g. Twice daily after food"
              />
            </div>
            <button className="btn-cancel cp-add-med-btn" type="submit" disabled={savingMed}>
              {savingMed ? 'Adding...' : 'Add Medicine'}
            </button>
          </form>

          <button className="btn-primary cp-complete-btn" onClick={handleComplete} disabled={completing}>
            {completing ? 'Completing...' : 'Complete Consultation'}
          </button>
        </>
      )}
    </div>
  );
}
