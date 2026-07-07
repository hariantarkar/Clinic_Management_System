// Central place for every call to the Spring Boot "patient" endpoints.
// Uses the shared axios instance (./axiosInstance) so the base URL, auth
// header, and error shape are handled in one place — same as your other
// dashboards.

import API from "./axiosInstance";

/** GET /patient/ViewAlldoctors */
export async function getAllDoctors() {
  const { data } = await API.get("/patient/ViewAlldoctors");
  return data;
}

/** GET /patient/doctors/search?keyword=... */
export async function searchDoctors(keyword) {
  const { data } = await API.get("/patient/doctors/search", {
    params: { keyword },
  });
  return data;
}

/** GET /patient/doctorsSlot/{doctorId}/availability */
export async function getDoctorAvailability(doctorId) {
  const { data } = await API.get(`/patient/doctorsSlot/${doctorId}/availability`);
  return data;
}

/** POST /patient/book/{slotId}/{patientId}?appointmentTime=... */
export async function bookSlot(slotId, patientId, appointmentTime) {
  const { data } = await API.post(`/patient/book/${slotId}/${patientId}`, null, {
    params: { appointmentTime },
  });
  return data;
}

/** GET /patient/upcomingAppointments/{patientId} */
export async function getUpcomingAppointments(patientId) {
  const { data } = await API.get(`/patient/upcomingAppointments/${patientId}`);
  return data;
}

/** PUT /patient/cancel/{appointmentId} */
export async function cancelAppointment(appointmentId) {
  const { data } = await API.put(`/patient/cancel/${appointmentId}`);
  return data;
}

/** GET /patient/patientSidePrescriptions/{patientId} */
export async function getAllPrescriptions(patientId) {
  const { data } = await API.get(`/patient/patientSidePrescriptions/${patientId}`);
  return data;
}
/** GET /patient/medicinesByPatient/{patientId} */
export async function getMedicinesByPatient(patientId) {
  const { data } = await API.get(`/patient/medicinesByPatient/${patientId}`);
  return data;
}

/** GET /patient/lastpatientPrescriptions/{patientId} */
export async function getLastPrescription(patientId) {
  const { data } = await API.get(`/patient/lastpatientPrescriptions/${patientId}`);
  return data;
}

/** GET /patient/lastVisited/{doctorId}/{patientId} */
export async function getLastVisited(doctorId, patientId) {
  const { data } = await API.get(`/patient/lastVisited/${doctorId}/${patientId}`);
  return data;
}
