import React, { useCallback, useEffect, useState } from 'react';
import { getAllDoctors, getLastVisited, getAllPrescriptions, getMedicinesByPatient } from '../api/patientApi';
import EmptyState from './EmptyState';
import { MedicalRecordIcon } from './icons';

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

export default function MedicalRecords({ patientId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecords = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const [doctors, allPrescriptions, allMedicines] = await Promise.all([
        getAllDoctors(),
        getAllPrescriptions(patientId).catch(() => []),
        getMedicinesByPatient(patientId).catch(() => []),
      ]);
      const doctorList = Array.isArray(doctors) ? doctors : doctors?.doctors || [];
      const prescriptionList = Array.isArray(allPrescriptions)
        ? allPrescriptions
        : allPrescriptions?.prescriptions || [];
      const medicineList = Array.isArray(allMedicines) ? allMedicines : allMedicines?.medicines || [];

      const results = await Promise.all(
        doctorList.map(async (doctor) => {
          const doctorId = doctor.doctorId ?? doctor.id;
          try {
            const visit = await getLastVisited(doctorId, patientId);
            if (!visit) return null;

            // diagnosis/remarks live on Prescription, matched by appointmentId
            const matchingRx = prescriptionList.find(
              (rx) => rx.appointment?.appointmentId === visit.appointmentId
            );

            // medicine name/dosage live on Medicine, matched by prescriptionId
            const matchingMeds = matchingRx
              ? medicineList.filter(
                  (m) => m.prescription?.prescriptionId === matchingRx.prescriptionId
                )
              : [];

            return { doctor, visit, prescription: matchingRx, medicines: matchingMeds };
          } catch {
            return null; // patient has no visit history with this doctor
          }
        })
      );

      setRecords(results.filter(Boolean));
    } catch (err) {
      setError(err.message || 'Could not load your medical records.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">My Medical Records</h2>
          <p className="page-subtitle">View your diagnosis history, symptoms, and doctor treatment notes.</p>
        </div>
        <span className="top-pill">{records.length} Medical Records</span>
      </header>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><MedicalRecordIcon /></div>
          <div>
            <h3 className="card-title">Patient Medical History</h3>
            <p className="card-subtitle">Access your diagnosis and treatment history records.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-text">Loading medical records...</p>
        ) : error ? (
          <p className="state-text state-error">{error}</p>
        ) : records.length === 0 ? (
          <EmptyState
            icon={<MedicalRecordIcon />}
            title="No Medical Records Found"
            subtitle="Your medical records will appear here after doctor consultations."
          />
        ) : (
          <div className="table-grid">
            <div className="table-grid-header grid-cols-records">
              <span>Doctor</span>
              <span>Last Visit</span>
              <span>Diagnosis</span>
              <span>Medicine</span>
              <span>Dosage</span>
              <span>Status</span>
              <span>Remarks</span>
            </div>
            {records.map(({ doctor, visit, prescription, medicines }) => {
              const doctorId = doctor.doctorId ?? doctor.id;
              const medicineNames = medicines.map((m) => m.medicineName).filter(Boolean).join(', ');
              const dosages = medicines.map((m) => m.dosage).filter(Boolean).join(', ');
              return (
                <div key={doctorId} className="table-grid-row grid-cols-records">
                  <div className="doctor-name">{getDoctorName(doctor)}</div>
                  <div>{formatDate(visit.appointmentDate)}</div>
                  <div>{prescription?.diagnosis ?? '—'}</div>
                  <div>{medicineNames || '—'}</div>
                  <div>{dosages || '—'}</div>
                  <div>
                    <span className={`status-badge status-${(visit.status ?? '').toLowerCase()}`}>
                      {visit.status ?? '—'}
                    </span>
                  </div>
                  <div>{prescription?.remarks ?? '—'}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}