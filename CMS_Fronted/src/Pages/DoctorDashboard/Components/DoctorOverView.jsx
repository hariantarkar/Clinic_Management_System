import React, { useCallback, useEffect, useState } from 'react';
import { getDayWiseTotalAppointments, getCompletedCheckups, getCancelledAppointments } from '../api/doctorApi';
import { ClipboardListIcon, CalendarCheckIcon } from '../../patient-dashboard/components/icons';
import './DoctorOverview.css';

function XCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}

// Backend parses LocalDate.parse(date), which expects ISO yyyy-MM-dd —
// exactly what <input type="date"> produces, so no conversion needed.
function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function DoctorOverview({ doctorId }) {
  const [date, setDate] = useState(todayISO());
  const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    if (!doctorId || !date) return;
    setLoading(true);
    setError(null);
    try {
      const [totalRes, completedRes, cancelledRes] = await Promise.all([
        getDayWiseTotalAppointments(doctorId, date),
        getCompletedCheckups(doctorId, date),
        getCancelledAppointments(doctorId, date),
      ]);
      setStats({
        total: totalRes?.totalAppointments ?? 0,
        completed: completedRes?.totalCompletedCheckups ?? 0,
        cancelled: cancelledRes?.totalCancelledAppointments ?? 0,
      });
    } catch (err) {
      setError(err.message || 'Could not load statistics for this date.');
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Overview</h2>
          <p className="page-subtitle">Daily snapshot of your appointments.</p>
        </div>
        <input
          type="date"
          className="search-input do-date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </header>

      {loading ? (
        <p className="state-text">Loading statistics...</p>
      ) : error ? (
        <p className="state-text state-error">{error}</p>
      ) : (
        <div className="do-stat-grid">
          <div className="card do-stat-card">
            <div className="icon-circle"><ClipboardListIcon /></div>
            <div>
              <p className="do-stat-value">{stats.total}</p>
              <p className="do-stat-label">Total Appointments</p>
            </div>
          </div>
          <div className="card do-stat-card">
            <div className="icon-circle do-icon-green"><CalendarCheckIcon /></div>
            <div>
              <p className="do-stat-value">{stats.completed}</p>
              <p className="do-stat-label">Completed Checkups</p>
            </div>
          </div>
          <div className="card do-stat-card">
            <div className="icon-circle do-icon-red"><XCircleIcon /></div>
            <div>
              <p className="do-stat-value">{stats.cancelled}</p>
              <p className="do-stat-label">Cancelled Appointments</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
