import React, { useState } from 'react';
import AdminSidebar from './components/AdminSideBar';
import AdminOverview from './components/AdminOverView';
import ManageDoctors from './components/ManageDoctors';
import PendingDoctors from './components/PendingDoctors';
import AppointmentsOverview from './components/AppointmentsOverview';
import RevenueReports from './components/RevenueReports';
import { MenuIcon } from '../patient-dashboard/components/icons';
import './AdminDashboard.css';

const VIEWS = {
  overview: AdminOverview,
  doctors: ManageDoctors,
   pendingDoctors: PendingDoctors,
    appointments: AppointmentsOverview,
  revenue: RevenueReports,
};

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminName = localStorage.getItem('patientName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('patientId');
    localStorage.removeItem('patientName');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

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
