import React, { useCallback, useEffect, useState } from 'react';
import { getAllDoctors, searchDoctors, getDoctorAvailability, bookSlot } from '../api/patientApi';
import EmptyState from './EmptyState';
import { CalendarIcon, RupeeIcon, BriefcaseIcon } from './icons';

// doctor_slot only stores startTime/endTime as full datetimes (no separate
// "slotTime" field), so format them into something readable for the buttons.
function formatTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const date = new Date(dateTimeStr);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Doctor.java's getter is getdName() (lowercase d), so Jackson serializes
// the field as "dName" (capital N) — not "dname" and not "name".
function getDoctorName(doctor) {
  return doctor.dName ?? doctor.dname ?? doctor.name ?? '—';
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

  // Debounced search against /patient/doctors/search
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

  const handleViewSlots = async (doctor) => {
    setSelectedDoctor(doctor);
    setSlots([]);
    setSlotsError(null);
    setBookingMessage(null);
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

  const handleBookSlot = async (slot) => {
    const slotId = slot.slotId ?? slot.id;
    setBookingSlotId(slotId);
    setBookingMessage(null);
    try {
      // /patient/book/{slotId}/{patientId} returns a plain success string
      // (e.g. "Appointment booked successfully at 2026-06-25T09:00"), not JSON.
      const message = await bookSlot(slotId, patientId);
      setBookingMessage({ type: 'success', text: message || 'Appointment booked successfully.' });
      handleViewSlots(selectedDoctor); // refresh so the booked slot disappears
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message || 'Booking failed. Please try another slot.' });
    } finally {
      setBookingSlotId(null);
    }
  };

  return (
    <>
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
              <span>Doctor</span>
              <span>Specialization</span>
              <span>Experience</span>
              <span>Fee</span>
              <span>Action</span>
            </div>
            {doctors.map((doctor) => {
              const doctorId = doctor.doctorId ?? doctor.id;
              const isSelected = selectedDoctor && (selectedDoctor.doctorId ?? selectedDoctor.id) === doctorId;
              return (
                <div
                  key={doctorId}
                  className={`table-grid-row grid-cols-doctors ${isSelected ? 'row-selected' : ''}`}
                >
                  <div className="doctor-cell">
                    <span className="avatar-circle" />
                    <div>
                      <p className="doctor-name"> {getDoctorName(doctor)}</p>
                      <p className="doctor-meta">{doctor.qualification ?? '—'}</p>
                    </div>
                  </div>
                  <div className="text-accent">{doctor.specialization ?? '—'}</div>
                  <div><BriefcaseIcon className="inline-icon" />{doctor.experienceYears ?? '—'} Years</div>
                  <div className="text-fee"><RupeeIcon className="inline-icon" />₹{doctor.consultationFee ?? '—'}</div>
                  <div>
                    <button className="btn-primary" onClick={() => handleViewSlots(doctor)}>
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
              <h3 className="card-title">Available Slots</h3>
              {selectedDoctor && (
                <p className="card-subtitle">
                  Dr. {getDoctorName(selectedDoctor)} • {selectedDoctor.specialization}
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
                <button
                  key={slotId}
                  className="slot-btn"
                  disabled={isBooking || isUnavailable}
                  onClick={() => handleBookSlot(slot)}
                >
                  {isBooking ? 'Booking...' : isUnavailable ? 'Full' : `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
