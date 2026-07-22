import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import MyPrescriptions from './components/MyPrescriptions';
import MedicalRecords from './components/MedicalRecords';
import ChatWidget from "./components/ChatWidget"
import { MenuIcon } from './components/icons';
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

     const currentPatientId = localStorage.getItem('patientId');
 
      // Clear the active chat session so the next login starts fresh.
      // The old conversation still exists in the database and remains
      // fully visible to admin — this only resets what the WIDGET resumes.
      if (currentPatientId) {
        sessionStorage.removeItem(`clinic_chat_session_${currentPatientId}`);
      }
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
      localStorage.removeItem('userType');
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
       {!sidebarOpen && (
        <button
          className="sidebar-reopen-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      )}
      <main className="main-content">
        <ActiveComponent patientId={patientId} />
      </main>
       <ChatWidget patientId={patientId} /> 
    </div>
  );
}
