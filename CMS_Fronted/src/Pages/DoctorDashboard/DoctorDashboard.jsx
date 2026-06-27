import React, { useCallback, useEffect, useState } from 'react';
import DoctorSidebar from './Components/DoctorSideBar';
import DoctorOverview from './Components/DoctorOverView';
import UpcomingAppointments from './Components/UpcomingAppointments';
import ManageSlots from './Components/ManageSlots';
import DoctorProfile from './Components/DoctorProfile';
import { getMyProfile } from './Api/Doctorapi';
import { MenuIcon } from '../patient-dashboard/components/icons';
import './DoctorDashboard.css';

const VIEWS = {
  overview: DoctorOverview,
  appointments: UpcomingAppointments,
  slots: ManageSlots,
  profile: DoctorProfile,
};

export default function DoctorDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  // The doctor's real doctorId lives only on the Doctor entity (not Register),
  // so it's fetched fresh from /doctor/profile via the JWT rather than trusting
  // anything saved in localStorage at login time.
  const loadProfile = useCallback(async () => {
    setLoadingDoctor(true);
    setDoctorError(null);
    try {
      const data = await getMyProfile();
      setDoctor(data);
    } catch (err) {
      setDoctorError(err.message || 'Could not load your profile.');
    } finally {
      setLoadingDoctor(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  const doctorId = doctor?.doctorId ?? doctor?.id;
  const doctorName = doctor?.dName ?? doctor?.dname ?? doctor?.name ?? 'Doctor';

  const ActiveComponent = VIEWS[activeView];

  return (
    <div className="dashboard-container">
      <DoctorSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        doctorName={doctorName}
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
        {loadingDoctor ? (
          <p className="state-text">Loading your dashboard...</p>
        ) : doctorError ? (
          <p className="state-text state-error">{doctorError}</p>
        ) : (
          <ActiveComponent doctorId={doctorId} doctor={doctor} onProfileUpdated={loadProfile} />
        )}
      </main>
    </div>
  );
}
