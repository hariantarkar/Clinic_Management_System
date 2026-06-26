import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// --- Inline icon components (no external icon/chart library needed) ---

const IconLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
  </svg>
);

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

const IconStethoscope = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3v6a4 4 0 0 0 8 0V3" />
    <path d="M13 9v2a6 6 0 0 1-12 0V9" />
    <circle cx="19" cy="16" r="2.5" />
    <path d="M13 11v2a4 4 0 0 0 4 4" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c0-3.4 2.9-5.8 6.5-5.8s6.5 2.4 6.5 5.8" />
    <path d="M16 8.2a3 3 0 1 1 0 6" />
    <path d="M18.5 14.6c2 .5 3.5 2.3 3.5 4.4" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 9.5h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12.5 9 17.5 18 6.5" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" />
    <path d="M16 16l4-4-4-4" />
    <path d="M20 12H9" />
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9.5a6 6 0 0 1 12 0c0 3.3 1 4.8 1.6 5.6.3.4 0 1-.5 1H4.9c-.5 0-.8-.6-.5-1C5 14.3 6 12.8 6 9.5Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="20" y1="20" x2="15.2" y2="15.2" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7v5l3.2 1.9" />
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
    <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
  </svg>
);

// ---------------------------------------------------------------------------
// Mock data — swap each block for the matching endpoint when you wire this up.
// ---------------------------------------------------------------------------

// GET /admin/totalDoctors, /admin/totalRegisterPatients,
// /admin/upcomingAppointments (.length), /admin/completedCheckupsByDate,
// /admin/cancelledAppointmentsByDate
const KPI_DATA = {
  totalDoctors: 18,
  totalPatients: 642,
  upcomingAppointments: 37,
  completedToday: 24,
  cancelledToday: 3,
};

// GET /admin/upcomingAppointments (merged with today's completed/cancelled
// history to build a single same-day agenda)
const TIMELINE = [
  { time: "9:00 AM", patient: "Sandeep Patil", doctor: "Dr. Asha Kulkarni", status: "completed" },
  { time: "9:30 AM", patient: null },
  { time: "10:00 AM", patient: "Priya Deshmukh", doctor: "Dr. Rohan Mehta", status: "completed" },
  { time: "10:30 AM", patient: "Imran Shaikh", doctor: "Dr. Neha Sharma", status: "cancelled" },
  { time: "11:00 AM", patient: "Kavita Joshi", doctor: "Dr. Vikram Singh", status: "completed" },
  { time: "11:30 AM", patient: null },
  { time: "12:00 PM", patient: "Rahul Naik", doctor: "Dr. Asha Kulkarni", status: "upcoming", isNow: true },
  { time: "12:30 PM", patient: "Meera Iyer", doctor: "Dr. Rohan Mehta", status: "upcoming" },
  { time: "1:00 PM", patient: null },
  { time: "1:30 PM", patient: "Arjun Rao", doctor: "Dr. Neha Sharma", status: "upcoming" },
  { time: "2:00 PM", patient: "Sneha Kale", doctor: "Dr. Vikram Singh", status: "upcoming" },
];

// Combine GET /admin/getAllDoctors with completed/cancelled-by-doctor counts
// to derive today's slot utilization per doctor
const DOCTORS = [
  { name: "Dr. Asha Kulkarni", specialization: "Cardiology", booked: 6, capacity: 8 },
  { name: "Dr. Rohan Mehta", specialization: "Orthopedics", booked: 4, capacity: 8 },
  { name: "Dr. Neha Sharma", specialization: "Pediatrics", booked: 7, capacity: 8 },
  { name: "Dr. Vikram Singh", specialization: "Dermatology", booked: 3, capacity: 8 },
];

// GET /admin/dayWiseTotalAppointments — compressed into a sparkline
const WEEK_TREND = [22, 26, 19, 31, 28, 13, 6];

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: <IconGrid />, path: "/admin" },
  { key: "doctors", label: "Doctors", icon: <IconStethoscope />, path: "/admin/doctors" },
  { key: "patients", label: "Patients", icon: <IconUsers />, path: "/admin/patients" },
  { key: "appointments", label: "Appointments", icon: <IconCalendar />, path: "/admin/appointments" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Sparkline({ values }) {
  const max = Math.max(...values);
  const w = 100;
  const h = 32;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${h - (v / max) * h}`)
    .join(" ");

  return (
    <svg className="ad-sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="var(--ad-blue)" strokeWidth="2" />
    </svg>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeKey = "overview";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  return (
    <div className="ad-shell">
      {/* Sidebar — labeled nav, same as your original version */}
      <aside className={`ad-sidebar ${mobileNavOpen ? "ad-sidebar--open" : ""}`}>
        <div className="ad-sidebar-header">
          <div className="ad-logo-badge">
            <IconLogo />
          </div>
          <div>
            <div className="ad-brand">Clinic Management</div>
            <div className="ad-brand-sub">Admin Panel</div>
          </div>
          <button
            className="ad-sidebar-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <IconClose />
          </button>
        </div>

        <nav className="ad-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`ad-nav-item ${activeKey === item.key ? "ad-nav-item--active" : ""}`}
              onClick={() => {
                navigate(item.path);
                setMobileNavOpen(false);
              }}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="ad-logout" onClick={handleLogout}>
          <IconLogout />
          Log Out
        </button>
      </aside>

      {mobileNavOpen && (
        <div className="ad-sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* Main column — timeline-based content */}
      <div className="ad-main">
        <header className="ad-header">
          <button
            className="ad-menu-btn"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          <div>
            <h1 className="ad-greeting">{getGreeting()}, Admin</h1>
            <p className="ad-greeting-sub">Here's how today is shaping up at the clinic.</p>
          </div>

          <div className="ad-header-actions">
            <div className="ad-search">
              <IconSearch />
              <input type="text" placeholder="Search patients, doctors..." />
            </div>
            <button className="ad-icon-btn" aria-label="Notifications">
              <IconBell />
              <span className="ad-icon-dot" />
            </button>
            <div className="ad-avatar">A</div>
          </div>
        </header>

        {/* Inline stat strip */}
        <div className="ad-stat-strip">
          <div className="ad-stat">
            <IconStethoscope />
            <span className="ad-stat-value">{KPI_DATA.totalDoctors}</span>
            <span className="ad-stat-label">Doctors</span>
          </div>
          <div className="ad-stat-sep" />
          <div className="ad-stat">
            <IconUsers />
            <span className="ad-stat-value">{KPI_DATA.totalPatients}</span>
            <span className="ad-stat-label">Patients</span>
          </div>
          <div className="ad-stat-sep" />
          <div className="ad-stat">
            <IconClock />
            <span className="ad-stat-value">{KPI_DATA.upcomingAppointments}</span>
            <span className="ad-stat-label">Upcoming</span>
          </div>
          <div className="ad-stat-sep" />
          <div className="ad-stat ad-stat--green">
            <IconCheck />
            <span className="ad-stat-value">{KPI_DATA.completedToday}</span>
            <span className="ad-stat-label">Completed today</span>
          </div>
          <div className="ad-stat-sep" />
          <div className="ad-stat ad-stat--red">
            <IconClose />
            <span className="ad-stat-value">{KPI_DATA.cancelledToday}</span>
            <span className="ad-stat-label">Cancelled today</span>
          </div>
        </div>

        {/* Timeline (hero) + side rail */}
        <div className="ad-body">
          <div className="ad-card ad-timeline-card">
            <div className="ad-card-header">
              <div>
                <h2 className="ad-card-title">Today's Schedule</h2>
                <p className="ad-card-sub">Live agenda across all doctors</p>
              </div>
              <button className="ad-btn ad-btn--outline" onClick={() => navigate("/admin/appointments")}>
                Full schedule
              </button>
            </div>

            <div className="ad-timeline">
              {TIMELINE.map((slot, i) => (
                <div className={`ad-tl-row ${slot.isNow ? "ad-tl-row--now" : ""}`} key={i}>
                  <div className="ad-tl-time">{slot.time}</div>
                  <div className="ad-tl-marker">
                    <span className={`ad-tl-dot ad-tl-dot--${slot.status || "empty"}`} />
                    {i < TIMELINE.length - 1 && <span className="ad-tl-line" />}
                  </div>

                  {slot.patient ? (
                    <div className={`ad-tl-card ad-tl-card--${slot.status}`}>
                      <div className="ad-tl-card-main">
                        <span className="ad-tl-patient">{slot.patient}</span>
                        <span className="ad-tl-doctor">{slot.doctor}</span>
                      </div>
                      <span className={`ad-tl-badge ad-tl-badge--${slot.status}`}>
                        {slot.status}
                      </span>
                    </div>
                  ) : (
                    <div className="ad-tl-empty">Open slot</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="ad-side">
            <div className="ad-card">
              <div className="ad-card-header ad-card-header--tight">
                <h2 className="ad-card-title">Doctors on duty</h2>
                <button className="ad-icon-btn ad-icon-btn--sm" onClick={() => navigate("/admin/doctors")} aria-label="Add doctor">
                  <IconPlus />
                </button>
              </div>

              <div className="ad-doctor-stack">
                {DOCTORS.map((doc) => {
                  const pct = (doc.booked / doc.capacity) * 100;
                  return (
                    <div className="ad-doctor-item" key={doc.name}>
                      <div className="ad-doctor-avatar">
                        {doc.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("")}
                      </div>
                      <div className="ad-doctor-meta">
                        <div className="ad-doctor-name">{doc.name}</div>
                        <div className="ad-doctor-spec">{doc.specialization}</div>
                        <div className="ad-doctor-track">
                          <div className="ad-doctor-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="ad-doctor-load">
                        {doc.booked}/{doc.capacity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-header ad-card-header--tight">
                <h2 className="ad-card-title">7-day trend</h2>
              </div>
              <Sparkline values={WEEK_TREND} />
              <div className="ad-trend-footer">
                <span>{WEEK_TREND[0]} appts last Mon</span>
                <span>{WEEK_TREND[WEEK_TREND.length - 1]} today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
