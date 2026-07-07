import React, { useEffect, useState } from 'react';
import {
  getAllDoctors,
  getTotalRevenue,
  getRevenueByDoctor,
  getRevenueByDateRange,
  getRevenueByDoctorAndDateRange,
} from '../Api/AdminApi';
import { BriefcaseIcon, RupeeIcon } from '../../patient-dashboard/components/icons';
import './RevenueReports.css';

function firstOfMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function RevenueReports() {
  const [doctors, setDoctors] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalLoading, setTotalLoading] = useState(true);
  const [totalError, setTotalError] = useState(null);

  const [byDoctorId, setByDoctorId] = useState('');
  const [byDoctorResult, setByDoctorResult] = useState(null);
  const [byDoctorLoading, setByDoctorLoading] = useState(false);
  const [byDoctorError, setByDoctorError] = useState(null);

  const [rangeFrom, setRangeFrom] = useState(firstOfMonthStr());
  const [rangeTo, setRangeTo] = useState(todayStr());
  const [rangeResult, setRangeResult] = useState(null);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [rangeError, setRangeError] = useState(null);

  const [combinedDoctorId, setCombinedDoctorId] = useState('');
  const [combinedFrom, setCombinedFrom] = useState(firstOfMonthStr());
  const [combinedTo, setCombinedTo] = useState(todayStr());
  const [combinedResult, setCombinedResult] = useState(null);
  const [combinedLoading, setCombinedLoading] = useState(false);
  const [combinedError, setCombinedError] = useState(null);

  useEffect(() => {
    getAllDoctors()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.doctors || [];
        setDoctors(list);
        if (list.length > 0) {
          const firstId = String(list[0].doctorId ?? list[0].id);
          setByDoctorId(firstId);
          setCombinedDoctorId(firstId);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTotalLoading(true);
    getTotalRevenue()
      .then(setTotalRevenue)
      .catch((err) => setTotalError(err.message || 'Could not load total revenue.'))
      .finally(() => setTotalLoading(false));
  }, []);

  const runByDoctor = async () => {
    if (!byDoctorId) return;
    setByDoctorLoading(true);
    setByDoctorError(null);
    try {
      const data = await getRevenueByDoctor(byDoctorId);
      setByDoctorResult(data);
    } catch (err) {
      setByDoctorError(err.message || 'Could not load revenue for this doctor.');
    } finally {
      setByDoctorLoading(false);
    }
  };

  const runRange = async () => {
    setRangeLoading(true);
    setRangeError(null);
    try {
      const data = await getRevenueByDateRange(rangeFrom, rangeTo);
      setRangeResult(data);
    } catch (err) {
      setRangeError(err.message || 'Could not load revenue for this range.');
    } finally {
      setRangeLoading(false);
    }
  };

  const runCombined = async () => {
    if (!combinedDoctorId) return;
    setCombinedLoading(true);
    setCombinedError(null);
    try {
      const data = await getRevenueByDoctorAndDateRange(combinedDoctorId, combinedFrom, combinedTo);
      setCombinedResult(data);
    } catch (err) {
      setCombinedError(err.message || 'Could not load revenue for this doctor and range.');
    } finally {
      setCombinedLoading(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h2 className="page-title">Revenue</h2>
          <p className="page-subtitle">Track total, per-doctor, and date-range revenue.</p>
        </div>
      </header>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><RupeeIcon /></div>
          <div>
            <h3 className="card-title">Total Revenue</h3>
            <p className="card-subtitle">Across all doctors, all time.</p>
          </div>
        </div>
        {totalLoading ? (
          <p className="state-text">Loading...</p>
        ) : totalError ? (
          <p className="state-text state-error">{totalError}</p>
        ) : (
          <p className="rv-big-value"><RupeeIcon className="inline-icon" />{totalRevenue?.totalRevenue ?? '—'}</p>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Revenue by Doctor</h3>
            <p className="card-subtitle">All-time revenue for a specific doctor.</p>
          </div>
        </div>
        <div className="rv-filters">
          <div className="md-field">
            <label>Doctor</label>
            <select value={byDoctorId} onChange={(e) => setByDoctorId(e.target.value)}>
              {doctors.map((d) => (
                <option key={d.doctorId ?? d.id} value={d.doctorId ?? d.id}>
                  {d.dName ?? d.dname}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-primary" onClick={runByDoctor} disabled={byDoctorLoading}>
            {byDoctorLoading ? 'Loading...' : 'Get Revenue'}
          </button>
        </div>
        {byDoctorError && <p className="state-text state-error">{byDoctorError}</p>}
        {byDoctorResult && (
          <div className="rv-result">
            <p className="rv-result-name">{byDoctorResult.doctorName}</p>
            <p className="rv-result-value"><RupeeIcon className="inline-icon" />{byDoctorResult.revenue}</p>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Revenue by Date Range</h3>
            <p className="card-subtitle">Across all doctors within a date range.</p>
          </div>
        </div>
        <div className="rv-filters">
          <div className="md-field">
            <label>From</label>
            <input type="date" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
          </div>
          <div className="md-field">
            <label>To</label>
            <input type="date" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={runRange} disabled={rangeLoading}>
            {rangeLoading ? 'Loading...' : 'Get Revenue'}
          </button>
        </div>
        {rangeError && <p className="state-text state-error">{rangeError}</p>}
        {rangeResult && (
          <div className="rv-result">
            <p className="rv-result-name">{rangeResult.from} → {rangeResult.to}</p>
            <p className="rv-result-value"><RupeeIcon className="inline-icon" />{rangeResult.revenue}</p>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Revenue by Doctor & Date Range</h3>
            <p className="card-subtitle">Combine both filters for a precise report.</p>
          </div>
        </div>
        <div className="rv-filters">
          <div className="md-field">
            <label>Doctor</label>
            <select value={combinedDoctorId} onChange={(e) => setCombinedDoctorId(e.target.value)}>
              {doctors.map((d) => (
                <option key={d.doctorId ?? d.id} value={d.doctorId ?? d.id}>
                  {d.dName ?? d.dname}
                </option>
              ))}
            </select>
          </div>
          <div className="md-field">
            <label>From</label>
            <input type="date" value={combinedFrom} onChange={(e) => setCombinedFrom(e.target.value)} />
          </div>
          <div className="md-field">
            <label>To</label>
            <input type="date" value={combinedTo} onChange={(e) => setCombinedTo(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={runCombined} disabled={combinedLoading}>
            {combinedLoading ? 'Loading...' : 'Get Revenue'}
          </button>
        </div>
        {combinedError && <p className="state-text state-error">{combinedError}</p>}
        {combinedResult && (
          <div className="rv-result">
            <p className="rv-result-name">
              {combinedResult.doctorName} · {combinedResult.from} → {combinedResult.to}
            </p>
            <p className="rv-result-value"><RupeeIcon className="inline-icon" />{combinedResult.revenue}</p>
          </div>
        )}
      </section>
    </>
  );
}
