import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import MyPrescriptions from './components/MyPrescriptions';
import MedicalRecords from './components/MedicalRecords';
import './PatientDashboard.css';

const VIEWS = {
  book: BookAppointment,
  appointments: MyAppointments,
  prescriptions: MyPrescriptions,
  records: MedicalRecords,
};

export default function PatientDashboard() {
  const [activeView, setActiveView] = useState('book');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Adjust these to match however your app already stores the logged-in
  // patient (context, redux, a JWT claim, etc). This assumes they were
  // saved to localStorage at login time.
  const patientId = localStorage.getItem('patientId');
  const patientName = localStorage.getItem('patientName') || 'Patient';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
    window.location.href = '/login';
  };

  const ActiveComponent = VIEWS[activeView];

  return (
    <div className="dashboard-container">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        patientName={patientName}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
      />
      <main className="main-content">
        <ActiveComponent patientId={patientId} />
      </main>
    </div>
  );
}
