import React from 'react';
import { ClipboardListIcon, CalendarPlusIcon, MenuIcon, LogoutIcon } from '../../patient-dashboard/components/icons';
import './DoctorSideBar.css'

// Defined locally so this file doesn't depend on icons that may not yet
// exist in the shared icons.js — move these there later if you'd like.
function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="12" width="3" height="8" />
      <rect x="11" y="7" width="3" height="13" />
      <rect x="16" y="3" width="3" height="17" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: ChartIcon },
  { key: 'appointments', label: 'Appointments', icon: ClipboardListIcon },
  { key: 'slots', label: 'Manage Slots', icon: CalendarPlusIcon },
  { key: 'profile', label: 'My Profile', icon: UserIcon },
];

export default function DoctorSidebar({ activeView, onNavigate, doctorName, onLogout, isOpen, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <div>
          <h1 className="sidebar-title">Clinic CMS</h1>
          <p className="sidebar-subtitle">Doctor Portal</p>
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
          <p className="logged-in-name">{doctorName || 'Doctor'}</p>
          <p className="logged-in-role">Doctor</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogoutIcon className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
