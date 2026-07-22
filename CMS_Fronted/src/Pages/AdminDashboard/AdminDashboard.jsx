import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './components/AdminSideBar';
import AdminOverview from './components/AdminOverView';
import ManageDoctors from './components/ManageDoctors';
import PendingDoctors from './components/PendingDoctors';
import AppointmentsOverview from './components/AppointmentsOverview';
import RevenueReports from './components/RevenueReports';
import SupportChats from './components/SupportChats';
import { MenuIcon } from '../patient-dashboard/components/icons';
import { getActiveEmergencies } from '../AdminDashboard/Api/Adminchatapi';
import './AdminDashboard.css';

const VIEWS = {
  overview: AdminOverview,
  doctors: ManageDoctors,
  pendingDoctors: PendingDoctors,
  appointments: AppointmentsOverview,
  revenue: RevenueReports,
  supportChats: SupportChats,
};

const BADGE_POLL_INTERVAL_MS = 15000;

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [emergencyCount, setEmergencyCount] = useState(0);

  const adminName = localStorage.getItem('patientName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  // Runs regardless of which view is open, so the sidebar badge stays live
  // even when the admin isn't looking at the Support Chats page.
  const pollEmergencyCount = useCallback(async () => {
    try {
      const active = await getActiveEmergencies();
      setEmergencyCount(active.length);
    } catch {
      // Silent — a failed badge poll shouldn't interrupt the admin's work.
      // The Support Chats page itself will surface a real error if opened.
    }
  }, []);

  useEffect(() => {
    pollEmergencyCount();
    const interval = setInterval(pollEmergencyCount, BADGE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [pollEmergencyCount]);

  const ActiveComponent = VIEWS[activeView];

  return (
    <div className="dashboard-container">
      <AdminSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        adminName={adminName}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
        emergencyCount={emergencyCount}
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
        <ActiveComponent />
      </main>
    </div>
  );
}
