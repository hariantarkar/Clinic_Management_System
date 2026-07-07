import React from 'react';
import { MenuIcon, LogoutIcon } from '../../patient-dashboard/components/icons';
import './AdminSidebar.css';

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

function StethoscopeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4v6a4 4 0 0 0 8 0V4" />
      <path d="M18 10v2a6 6 0 0 1-12 0v-2" />
      <circle cx="18" cy="8" r="2" />
    </svg>
  );
}
function RupeeSideIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 4h12M6 9h12M6 4c4 0 7 2 7 5s-3 5-7 5h9M6 20l9-6" />
    </svg>
  );
}

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: ChartIcon },
  { key: 'doctors', label: 'Manage Doctors', icon: StethoscopeIcon },
  { key: 'pendingDoctors', label: 'Pending Doctors', icon: StethoscopeIcon },
   { key: 'appointments', label: 'Appointments', icon: ChartIcon },
  { key: 'revenue', label: 'Revenue', icon: RupeeSideIcon }
];

export default function AdminSidebar({ activeView, onNavigate, adminName, onLogout, isOpen, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <div>
          <h1 className="sidebar-title">Clinic CMS</h1>
          <p className="sidebar-subtitle">Admin Portal</p>
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
          <p className="logged-in-name">{adminName || 'Admin'}</p>
          <p className="logged-in-role">Admin</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogoutIcon className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
