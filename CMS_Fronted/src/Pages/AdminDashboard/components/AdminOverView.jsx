import React, { useCallback, useEffect, useState } from 'react';
import {
  getTotalDoctors,
  getTotalPatients,
  getTotalRevenue,
  getCompletedCheckupsByDate,
  getCancelledAppointmentsByDate,
} from '../Api/AdminApi';
import { ClipboardListIcon, CalendarCheckIcon } from '../../patient-dashboard/components/icons';
import './AdminOverView.css';
function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20c0-3.3 2.8-5.6 6.2-5.6s6.2 2.3 6.2 5.6" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M16 14.4c2.4.3 4.2 1.9 4.4 4.4" />
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

function RupeeStackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 4h10" />
      <path d="M7 4c0 5 10 4.5 10 9 0 2.5-3 4-7 4" />
      <path d="M7 9h7" />
      <path d="M10 20v-3" />
    </svg>
  );
}

function XCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AdminOverview() {
  const [date, setDate] = useState(todayISO());

  const [totals, setTotals] = useState({ doctors: 0, patients: 0, revenue: 0 });
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [totalsError, setTotalsError] = useState(null);

  const [dayStats, setDayStats] = useState({ completed: 0, cancelled: 0 });
  const [loadingDayStats, setLoadingDayStats] = useState(true);
  const [dayStatsError, setDayStatsError] = useState(null);

  const loadTotals = useCallback(async () => {
    setLoadingTotals(true);
    setTotalsError(null);
    try {
      const [doctorsRes, patientsRes, revenueRes] = await Promise.all([
        getTotalDoctors(),
        getTotalPatients(),
        getTotalRevenue(),
      ]);
      setTotals({
        doctors: doctorsRes?.totalDoctors ?? 0,
        patients: patientsRes?.totalPatients ?? 0,
        revenue: revenueRes?.totalRevenue ?? 0,
      });
    } catch (err) {
      setTotalsError(err.message || 'Could not load totals.');
    } finally {
      setLoadingTotals(false);
    }
  }, []);

  const loadDayStats = useCallback(async () => {
    if (!date) return;
    setLoadingDayStats(true);
    setDayStatsError(null);
    try {
      const [completedRes, cancelledRes] = await Promise.all([
        getCompletedCheckupsByDate(date),
        getCancelledAppointmentsByDate(date),
      ]);
      setDayStats({
        completed: completedRes?.totalCompletedCheckups ?? 0,
        cancelled: cancelledRes?.totalCancelledAppointments ?? 0,
      });
    } catch (err) {
      setDayStatsError(err.message || 'Could not load statistics for this date.');
    } finally {
      setLoadingDayStats(false);
    }
  }, [date]);

  useEffect(() => {
    loadTotals();
  }, [loadTotals]);

  useEffect(() => {
    loadDayStats();
  }, [loadDayStats]);

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Admin Overview</h2>
          <p className="page-subtitle">Clinic-wide totals and daily activity.</p>
        </div>
      </header>

      {loadingTotals ? (
        <p className="state-text">Loading totals...</p>
      ) : totalsError ? (
        <p className="state-text state-error">{totalsError}</p>
      ) : (
        <div className="ao-stat-grid">
          <div className="card ao-stat-card">
            <div className="icon-circle"><StethoscopeIcon /></div>
            <div>
              <p className="ao-stat-value">{totals.doctors}</p>
              <p className="ao-stat-label">Total Doctors</p>
            </div>
          </div>
          <div className="card ao-stat-card">
            <div className="icon-circle ao-icon-blue"><UsersIcon /></div>
            <div>
              <p className="ao-stat-value">{totals.patients}</p>
              <p className="ao-stat-label">Registered Patients</p>
            </div>
          </div>
          <div className="card ao-stat-card">
            <div className="icon-circle ao-icon-green"><RupeeStackIcon /></div>
            <div>
              <p className="ao-stat-value">₹{totals.revenue}</p>
              <p className="ao-stat-label">Total Revenue</p>
            </div>
          </div>
        </div>
      )}

      <section className="card ao-date-card">
        <div className="card-header card-header-split">
          <div className="card-header" style={{ border: 'none', padding: 0, margin: 0 }}>
            <div>
              <h3 className="card-title">Daily Activity</h3>
              <p className="card-subtitle">Appointments completed and cancelled clinic-wide.</p>
            </div>
          </div>
          <input
            type="date"
            className="search-input ao-date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {loadingDayStats ? (
          <p className="state-text">Loading...</p>
        ) : dayStatsError ? (
          <p className="state-text state-error">{dayStatsError}</p>
        ) : (
          <div className="ao-stat-grid">
            <div className="card ao-stat-card ao-stat-card-nested">
              <div className="icon-circle ao-icon-green"><CalendarCheckIcon /></div>
              <div>
                <p className="ao-stat-value">{dayStats.completed}</p>
                <p className="ao-stat-label">Completed Checkups</p>
              </div>
            </div>
            <div className="card ao-stat-card ao-stat-card-nested">
              <div className="icon-circle ao-icon-red"><XCircleIcon /></div>
              <div>
                <p className="ao-stat-value">{dayStats.cancelled}</p>
                <p className="ao-stat-label">Cancelled Appointments</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
