import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAllDoctors, searchDoctors, getDoctorAvailability, bookSlot } from '../api/patientApi';
import EmptyState from './EmptyState';
import { CalendarIcon, RupeeIcon, BriefcaseIcon } from './icons';
import './BookAppointment.css';

function formatTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getDoctorName(doctor) {
  return doctor.dName ?? doctor.dname ?? doctor.name ?? '—';
}

// Turns "Dr Harsh Antarkar" into "HA" for the avatar circle.
// Strips a leading "Dr"/"Dr." so the initials reflect the actual name,
// not the title.
function getInitials(name) {
  if (!name || name === '—') return '?';
  const cleaned = name.replace(/^dr\.?\s*/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return initials.toUpperCase();
}

export default function BookAppointment({ patientId }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [bookingMessage, setBookingMessage] = useState(null);
  const messageTimeoutRef = useRef(null);

  // Clear any pending auto-dismiss timer if the component unmounts
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const loadDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    setDoctorsError(null);
    try {
      const data = await getAllDoctors();
      setDoctors(Array.isArray(data) ? data : data?.doctors || []);
    } catch (err) {
      setDoctorsError(err.message || 'Could not load doctors right now.');
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      loadDoctors();
      return;
    }
    const timeoutId = setTimeout(async () => {
      setLoadingDoctors(true);
      setDoctorsError(null);
      try {
        const data = await searchDoctors(searchTerm.trim());
        setDoctors(Array.isArray(data) ? data : data?.doctors || []);
      } catch (err) {
        setDoctorsError(err.message || 'Search failed. Try again.');
      } finally {
        setLoadingDoctors(false);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Loads/refreshes the slot list for a doctor. Does NOT touch bookingMessage —
  // that's managed separately so a post-booking refresh doesn't wipe it out.
  const handleViewSlots = async (doctor) => {
    setSelectedDoctor(doctor);
    setSlots([]);
    setSlotsError(null);
    setLoadingSlots(true);
    try {
      const doctorId = doctor.doctorId ?? doctor.id;
      const data = await getDoctorAvailability(doctorId);
      setSlots(Array.isArray(data) ? data : data?.slots || []);
    } catch (err) {
      setSlotsError(err.message || 'Could not load slots for this doctor.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Explicit doctor selection clears any previous booking message right away.
  const handleSelectDoctor = (doctor) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setBookingMessage(null);
    handleViewSlots(doctor);
  };

  const handleBookSlot = async (slot) => {
    const slotId = slot.slotId ?? slot.id;
    setBookingSlotId(slotId);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setBookingMessage(null);
    try {
      const message = await bookSlot(slotId, patientId);
      setBookingMessage({ type: 'success', text: message || 'Appointment booked successfully.' });
      await handleViewSlots(selectedDoctor); // refresh so the booked slot updates
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message || 'Booking failed. Please try another slot.' });
    } finally {
      setBookingSlotId(null);
    }
    // Keep the message visible for a few seconds, then auto-dismiss
    messageTimeoutRef.current = setTimeout(() => setBookingMessage(null), 4000);
  };

  return (
    <div className="ba-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Book Appointment</h2>
          <p className="page-subtitle">Choose a specialist and book available consultation slots.</p>
        </div>
        <span className="top-pill">{doctors.length} Specialists Available</span>
      </header>

      <section className="card">
        <div className="card-header">
          <div className="icon-circle"><BriefcaseIcon /></div>
          <div>
            <h3 className="card-title">Available Doctors</h3>
            <p className="card-subtitle">Select a specialist to view consultation slots.</p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loadingDoctors ? (
          <p className="state-text">Loading doctors...</p>
        ) : doctorsError ? (
          <p className="state-text state-error">{doctorsError}</p>
        ) : doctors.length === 0 ? (
          <EmptyState icon={<CalendarIcon />} title="No Doctors Found" subtitle="Try a different search term." />
        ) : (
          <div className="table-grid">
            <div className="table-grid-header grid-cols-doctors">
              <span id="doctorNameINHead">Doctor</span>
              <span>Specialization</span>
              <span>Experience</span>
              <span>Fee</span>
              <span>Action</span>
            </div>
            {doctors.map((doctor) => {
              const doctorId = doctor.doctorId ?? doctor.id;
              const isSelected = selectedDoctor && (selectedDoctor.doctorId ?? selectedDoctor.id) === doctorId;
              const name = getDoctorName(doctor);
              return (
                <div
                  key={doctorId}
                  className={`table-grid-row grid-cols-doctors ${isSelected ? 'row-selected' : ''}`}
                >
                  <div className="doctor-cell">
                    <span className="avatar-circle ba-avatar">{getInitials(name)}</span>
                    <div>
                      <p className="doctor-name">{name}</p>
                      <p className="doctor-meta">{doctor.qualification ?? '—'}</p>
                    </div>
                  </div>
                  <div className="text-accent">{doctor.specialization ?? '—'}</div>
                  <div><BriefcaseIcon className="inline-icon" />{doctor.experienceYears ?? '—'} Years</div>
<div className="text-fee"><RupeeIcon className="inline-icon" />{doctor.consultationFee ?? '—'}</div>                  <div>
                    <button className="btn-primary" onClick={() => handleSelectDoctor(doctor)}>
                      View Slots
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header card-header-split">
          <div className="card-header" style={{ border: 'none', padding: 0, margin: 0 }}>
            <div>
              <h3 className="card-title">Today's Available Slots</h3>
              {selectedDoctor && (
                <p className="card-subtitle">
                  {getDoctorName(selectedDoctor)} • {selectedDoctor.specialization}
                </p>
              )}
            </div>
          </div>
          <span className="top-pill top-pill-light">{slots.length} Slots Available</span>
        </div>

        {bookingMessage && (
          <p className={`state-text ${bookingMessage.type === 'error' ? 'state-error' : 'state-success'}`}>
            {bookingMessage.text}
          </p>
        )}

        {!selectedDoctor ? (
          <EmptyState
            icon={<CalendarIcon />}
            title="No Doctor Selected"
            subtitle="Choose a doctor above to see their available slots."
          />
        ) : loadingSlots ? (
          <p className="state-text">Loading slots...</p>
        ) : slotsError ? (
          <p className="state-text state-error">{slotsError}</p>
        ) : slots.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon />}
            title="No Slots Available"
            subtitle="This doctor currently has no consultation slots available."
          />
        ) : (
          <div className="slot-grid">
            {slots.map((slot) => {
              const slotId = slot.slotId ?? slot.id;
              const isFull = (slot.bookedAppointments ?? 0) >= (slot.maxAppointments ?? Infinity);
              const isUnavailable = slot.available === false || isFull;
              const isBooking = bookingSlotId === slotId;
              return (
                <div key={slotId} className={`slot-card ${isUnavailable ? 'slot-card-full' : ''}`}>
                  <span className="slot-time">
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </span>
                  <button
                    className="slot-book-btn"
                    disabled={isBooking || isUnavailable}
                    onClick={() => handleBookSlot(slot)}
                  >
                    {isBooking ? 'Booking...' : isUnavailable ? 'Full' : 'Book Appointment'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
