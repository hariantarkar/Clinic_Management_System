# Clinic CMS — Clinic Management System

A full-stack clinic management platform with three role-based portals — Patient, Doctor, and Admin — built with a Spring Boot backend and a React frontend. Patients book and manage appointments, doctors manage their slots and consultations, and admins onboard doctors, oversee the doctor roster, and track appointments and revenue.

## Tech Stack

* Backend: Java, Spring Boot, Spring Security (JWT-based auth), Spring Data JPA (Hibernate), MySQL
* Frontend: React, React Router, Axios

## Roles & Access

Every account starts as a row in a single `register` table (`user_type`: `patient`, `doctor`, or `admin`). Role-based routing and endpoint access are enforced via Spring Security (`/admin/**`, `/doctor/**`, `/patient/**`) and a JWT filter that attaches the authenticated user's role to every request.

### Patient
- Register and log in
- Browse/search doctors by name or specialization
- View a doctor's available slots and book a **specific time** within a slot window (not just the slot as a whole)
- View upcoming appointments, separated from **missed appointments** (past-due bookings that were never attended or cancelled)
- Cancel an appointment any time before its scheduled time
- View prescriptions and medicine history

### Doctor
- Doctor accounts are **not self-activating**. Registering as a doctor creates a pending `register` row only; an admin must review and complete the profile (qualification, specialization, experience, consultation fee) before the account can log in
- Attempting to log in before approval returns a clear "pending admin approval" message instead of a broken dashboard
- Manage appointment slots, view upcoming appointments, and issue prescriptions

### Admin
- **Pending Doctors** — review new doctor registrations and activate them by completing their profile
- **Manage Doctors** — edit doctor details; **deactivate** (not delete) a doctor, blocked while they have current/upcoming appointments
- **Appointments Overview** — per-doctor slot management, upcoming appointments, and daily stats (total appointments, completed checkups, cancellations)
- **Revenue Reports** — total revenue, revenue by doctor, by date range, and by doctor + date range combined

## Key Design Decisions

- **Doctor onboarding is admin-gated by design.** A `doctor`-type registration is a request, not an activation. Login is blocked at the authentication layer (not just hidden in the UI) until a matching `Doctor` profile exists, closing off any route to an unapproved doctor reaching a dashboard.
- **Exact-time slot booking.** Rather than auto-assigning the next available time in a slot window by booking order, patients pick an exact time (e.g. 4:00, 4:30, 5:00 for a 30-minute-interval slot). The backend validates the chosen time against the slot's duration grid and rejects times that are already booked, out of range, or misaligned.
- **Deactivation over deletion.** Doctors are never hard-deleted from the system — they're marked inactive, and only if they have no current or upcoming appointments, to avoid orphaning appointment history.
- **Cancellation deadline uses the appointment's actual booked time**, not the start of its parent slot window — important once multiple distinct times can exist within one slot.
- **Public registration is restricted server-side.** Regardless of what a client sends, `/auth/reg` only ever creates `patient` or `doctor` accounts; `admin` accounts cannot be created through public registration under any circumstances.

## Core Entities

- `Register` — every user (patient, doctor, admin), holds auth credentials and role
- `Doctor` — a doctor's professional profile, one-to-one linked to a `Register` row, created only via admin approval
- `DoctorSlot` — a doctor's bookable time window (start/end time, appointment duration, capacity)
- `AppointmentEntity` — a specific booking: patient, doctor, slot, exact appointment time, and status (`Booked` / `CANCELLED`)

## API Endpoint Reference

All endpoints below are grouped by role and mirror the wrapper functions in each `*Api.js` file (`patientApi.js`, `doctorApi.js`, `adminApi.js`), all built on a shared `axiosInstance`.

### Patient Endpoints (`/patient`, public `/doctors`, `/book`, `/cancel`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `ViewAlldoctors` | List all doctors |
| GET | `doctors/search?keyword=` | Search doctors by name/specialization |
| GET | `doctorsSlot/{doctorId}/availability` | Get a doctor's available slots |
| POST | `book/{slotId}/{patientId}` | Book a specific time within a slot |
| GET | `upcomingAppointments/{patientId}` | View upcoming (and missed) appointments |
| POST/DELETE | `cancel/{appointmentId}` | Cancel an appointment |
| GET | `patientSidePrescriptions/{patientId}` | View all prescriptions |
| GET | `lastpatientPrescriptions/{patientId}` | View most recent prescription |
| GET | `lastVisited/{doctorId}/{patientId}` | Last visit record with a given doctor |

### Doctor Endpoints (`/doctor`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `profile` | Get own profile (resolved from JWT) |
| PUT | `Update/profile` | Update own profile |
| POST | `addSlot/{doctorId}` | Add a new appointment slot |
| PUT | `updateSlot/{slotId}` | Update an existing slot |
| GET | `upcomingSlots/{doctorId}` | View upcoming slots |
| GET | `upcomingAppointments/{doctorId}` | View upcoming appointments |
| GET | `medicinesByPatient/{patientId}` | View medicines prescribed to a patient |
| GET | `completedCheckupsByDoctor?doctorId=&date=` | Completed checkups for a date |
| GET | `cancelledAppointmentsByDoctor?doctorId=&date=` | Cancelled appointments for a date |
| GET | `dayWiseTotalAppointments?doctorId=&date=` | Total appointments for a date |
| POST | `addPrescription/{doctorId}/{patientId}/{appointmentId}` | Create a prescription |
| POST | `addMedicine/{prescriptionId}` | Add a medicine to a prescription |
| POST | `completeConsultation/{prescriptionId}` | Mark consultation complete |
| GET | `patientPrescriptions/{patientId}` | View a patient's prescriptions |
| GET | `lastVisit/{doctorId}/{patientId}` | Last visit between doctor and patient |

### Admin Endpoints (`/admin`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `addNewDoctor` | Add a new doctor directly |
| GET | `pendingDoctors` | List pending doctor registrations |
| POST | `addDoctorFromRegistration/{registerId}` | Activate a pending doctor with full profile details |
| GET | `totalDoctors` | Total doctor count |
| GET | `getDoctor/{doctorId}` | Get a doctor's details |
| PUT | `updateDoctor/{doctorId}` | Update a doctor's details |
| PUT | `setDoctorActiveStatus/{doctorId}?active=` | Activate/deactivate a doctor |
| GET | `totalRegisterPatients` | Total registered patient count |
| GET | `completedCheckupsByDate?date=` | Completed checkups on a given date |
| POST | `addSlot/{doctorId}` | Add a slot on behalf of a doctor |
| GET | `getAllDoctors` | List all doctors |
| GET | `viewSlots/{doctorId}` | View a doctor's slots |
| PUT | `updateSlot/{slotId}` | Update a slot |
| GET | `upcomingAppointments/{doctorId}` | Upcoming appointments for a doctor |
| GET | `dayWiseTotalAppointments?doctorId=&date=` | Total appointments for a doctor/date |
| GET | `cancelledAppointmentsByDoctor?doctorId=&date=` | Cancelled appointments for a doctor/date |
| GET | `cancelledAppointmentsByDate?date=` | Cancelled appointments across all doctors for a date |
| GET | `completedCheckupsByDoctor?doctorId=&date=` | Completed checkups for a doctor/date |
| GET | `totalRevenue` | Total revenue across all doctors |
| GET | `revenueByDoctor?doctorId=` | Revenue for a specific doctor |
| GET | `revenueByDateRange?from=&to=` | Revenue within a date range |
| GET | `revenueByDoctorAndDateRange?doctorId=&from=&to=` | Revenue for a doctor within a date range |

## Frontend Setup Notes

### Patient Dashboard
1. Copy the `patient-dashboard` folder into your `src/` directory.
2. Set your API base URL — either:
   - Create React App: add `REACT_APP_API_BASE_URL=http://localhost:8080` to `.env`
   - Vite: see the commented-out line at the top of `api/patientApi.js`
3. Render it wherever the patient lands after login, e.g.:
   jsx
   import PatientDashboard from './patient-dashboard/PatientDashboard';
   <Route path="/patient/dashboard" element={<PatientDashboard />} />
  
4. `PatientDashboard.jsx` currently reads `patientId`, `patientName`, and `token` from `localStorage`. Point these at wherever your login flow already stores them (context, Redux, a JWT claim, etc).

Field-name assumptions to double check** — components read a couple of likely field names with `??` fallbacks (e.g. `doctor.name ?? doctor.doctorName`) since the exact DTO shapes weren't available:
-  Doctors: `doctorId`/`id`, `name`, `specialization`, `experience`, `fee`/`consultationFee`
- Slots: `slotId`/`id`, `slotTime`/`time`/`startTime`
- Appointments: `appointmentId`/`id`, `doctorName`, `appointmentDate`, `appointmentTime`, `status`
- Prescriptions: `prescriptionId`/`id`, `medicineName`/`medication`, `dosage`, `notes`
- Medical records: no dedicated endpoint yet — built by calling `lastVisited/{doctorId}/{patientId}` once per doctor from `ViewAlldoctors` and keeping the ones with a result

Booking flow: Clicking **View Slots** calls `doctorsSlot/{doctorId}/availability` and renders each slot as a button. Clicking a slot calls `POST book/{slotId}/{patientId}` and refreshes the slot list on success.

Search: debounces 400ms then calls `doctors/search` with `?keyword=` — rename the param in `searchDoctors()` if the controller expects something else (e.g. `name` or `query`).
Password Recovery Flow

A self-service, OTP-based reset that doesn't require admin involvement, for any register account (patient, doctor, or admin).

Backend (PasswordController + EmailService):


POST /auth/forgot-password — looks up the Register row by email, generates a random 6-digit OTP, stores it on the user along with a 5-minute expiry (otp, otpExpiry fields on Register), and emails it via Spring Mail (JavaMailSender). Returns "OTP sent to registered email", or a 400 if the email isn't found.
POST /auth/reset-password — looks up the user by email again and checks, in order: an OTP actually exists, the submitted OTP matches, and it hasn't expired. Only if all three pass does it encode and save the new password (via PasswordEncoder) and clear the stored OTP/expiry. Returns "Password updated successfully", or a descriptive 400 ("Invalid OTP", "OTP Expired", "No active OTP found") otherwise.

Frontend (ForgotPasswordPage → ResetPasswordPage):

ForgotPasswordPage — validates the email format client-side, calls forgotPassword(email), and on success reveals a second inline form for entering the 6-digit OTP (format-checked only, not verified yet at this point).
Submitting that OTP form doesn't call the backend — it navigates to /reset-password, passing email and otp through React Router's location.state.
ResetPasswordPage — reads email/otp from location.state. If either is missing (e.g. the user navigated here directly or refreshed), it shows a "session expired" view with a button back to /forgot-password instead of a broken form.
The user enters a new password (6–20 characters, client-checked); submitting calls resetPassword({ email, otp, newPassword }), which is where the OTP is actually validated server-side. Success redirects to /login after a short delay; an OTP-related error surfaces a "Request a new OTP" link back to the first step.
## Known Limitations / Possible Follow-ups

- Missed appointments (booked, past-due, never attended) remain in status `Booked` indefinitely with no automatic cleanup job to mark them `NO_SHOW` or similar
- Appointment status casing is inconsistent across the codebase (`"Booked"` vs `"CANCELLED"`/`"COMPLETED"`) — works today because nothing cross-compares them directly, but worth standardizing
- No automated test suite yet

## Getting Started

### Backend
bash
cd backend
mvn spring-boot:run

Configure your MySQL connection in `src/main/resources/application.properties`.

### Frontend
bash
cd frontend
npm install
npm start

Built iteratively as a learning/portfolio project covering role-based access control, appointment scheduling logic, and admin approval workflows in a realistic clinic domain.
