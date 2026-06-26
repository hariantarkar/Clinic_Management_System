import React from 'react';
import {
  CalendarPlusIcon,
  ClipboardListIcon,
  PrescriptionIcon,
  MedicalRecordIcon,
  MenuIcon,
  LogoutIcon,
} from './icons';

const NAV_ITEMS = [
  { key: 'book', label: 'Book Appointment', icon: CalendarPlusIcon },
  { key: 'appointments', label: 'My Appointments', icon: ClipboardListIcon },
  { key: 'prescriptions', label: 'My Prescriptions', icon: PrescriptionIcon },
  { key: 'records', label: 'Medical Records', icon: MedicalRecordIcon },
];

export default function Sidebar({ activeView, onNavigate, patientName, onLogout, isOpen, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <div>
          <h1 className="sidebar-title">Clinic CMS</h1>
          <p className="sidebar-subtitle">Smart Medical Portal</p>
        </div>
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle menu">
          <MenuIcon />
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`nav-item ${activeView === key ? 'nav-item-active' : ''}`}
            onClick={() => onNavigate(key)}
          >
            <Icon className="nav-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="logged-in-box">
          <p className="logged-in-label">Logged in as</p>
          <p className="logged-in-name">{patientName || 'Patient'}</p>
          <p className="logged-in-role">Patient</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogoutIcon className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
