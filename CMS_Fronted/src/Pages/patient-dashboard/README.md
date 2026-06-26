# Patient Dashboard

Matches the Clinic CMS screens you shared (navy sidebar, 4 nav items, white
cards, pill counters, empty states) and wires every section to the endpoint
you listed.

## Files
```
patient-dashboard/
├── PatientDashboard.jsx        # shell: sidebar + page switcher
├── PatientDashboard.css        # all styling for the dashboard
├── api/
│   └── patientApi.js           # one fetch wrapper per endpoint
└── components/
    ├── Sidebar.jsx
    ├── BookAppointment.jsx     # ViewAlldoctors, doctors/search, doctorsSlot/.../availability, book/{slotId}/{patientId}
    ├── MyAppointments.jsx      # upcomingAppointments/{patientId}, cancel/{appointmentId}
    ├── MyPrescriptions.jsx     # patientSidePrescriptions/{patientId}, lastpatientPrescriptions/{patientId}
    ├── MedicalRecords.jsx      # ViewAlldoctors + lastVisited/{doctorId}/{patientId} per doctor
    ├── EmptyState.jsx
    └── icons.jsx
```

## Drop-in setup
1. Copy the `patient-dashboard` folder into your `src/` directory.
2. Set your API base URL — either:
   - Create React App: add `REACT_APP_API_BASE_URL=http://localhost:8080` to `.env`
   - Vite: see the commented-out line at the top of `api/patientApi.js`
3. Render it wherever the patient lands after login, e.g.:
   ```jsx
   import PatientDashboard from './patient-dashboard/PatientDashboard';
   <Route path="/patient/dashboard" element={<PatientDashboard />} />
   ```
4. `PatientDashboard.jsx` currently reads `patientId`, `patientName`, and
   `token` from `localStorage`. Point these at wherever your login flow
   already stores them (context, Redux, a JWT claim, etc).

## Field-name assumptions to double check
I don't have your DTO shapes, so each component reads a couple of likely
field names with `??` fallbacks (e.g. `doctor.name ?? doctor.doctorName`).
These are the spots most likely to need a one-line tweak once you wire it
up against the real API:

- **Doctors** (`ViewAlldoctors`, `doctors/search`): `doctorId`/`id`, `name`,
  `specialization`, `experience`, `fee`/`consultationFee`.
- **Slots** (`doctorsSlot/{id}/availability`): `slotId`/`id`,
  `slotTime`/`time`/`startTime`.
- **Appointments** (`upcomingAppointments/{id}`): `appointmentId`/`id`,
  `doctorName`, `appointmentDate`, `appointmentTime`, `status`.
- **Prescriptions** (`patientSidePrescriptions`, `lastpatientPrescriptions`):
  `prescriptionId`/`id`, `medicineName`/`medication`, `dosage`, `notes`.
- **Medical records**: there's no single "records" endpoint in the list you
  gave me, so `MedicalRecords.jsx` builds the table by calling
  `lastVisited/{doctorId}/{patientId}` once per doctor from `ViewAlldoctors`
  and keeping the ones with a result. If you add a dedicated records
  endpoint later, that's the one block to replace.

## Booking flow
Clicking **View Slots** calls `doctorsSlot/{doctorId}/availability` and
renders each slot as a button. Clicking a slot calls
`POST book/{slotId}/{patientId}` and refreshes the slot list on success, so
a booked slot disappears immediately.

## Search
The search box debounces 400ms then calls `doctors/search`. It currently
sends the query as `?keyword=...` — rename the param in
`api/patientApi.js → searchDoctors()` if your controller expects something
else (e.g. `name` or `query`).
