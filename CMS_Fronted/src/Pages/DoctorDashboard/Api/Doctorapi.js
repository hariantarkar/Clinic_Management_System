import API from "../../patient-dashboard/api/axiosInstance";

/** GET /doctor/profile — resolves the doctor from the JWT, no path param needed */
export async function getMyProfile() {
  const { data } = await API.get("/doctor/profile");
  return data;
}

/** PUT /doctor/Update/profile */
export async function updateProfile(payload) {
  const { data } = await API.put("/doctor/Update/profile", payload);
  return data;
}

/** POST /doctor/addSlot/{doctorId} */
export async function addSlot(doctorId, slot) {
  const { data } = await API.post(`/doctor/addSlot/${doctorId}`, slot);
  return data;
}

/** PATCH /doctor/updateSlot/{slotId} */
export async function updateSlot(slotId, updatedSlot) {
  const { data } = await API.patch(`/doctor/updateSlot/${slotId}`, updatedSlot);
  return data;
}

/** GET /doctor/upcomingSlots/{doctorId} */
export async function getUpcomingSlots(doctorId) {
  const { data } = await API.get(`/doctor/upcomingSlots/${doctorId}`);
  return data;
}

/** GET /doctor/upcomingAppointments/{doctorId} */
export async function getUpcomingAppointments(doctorId) {
  const { data } = await API.get(`/doctor/upcomingAppointments/${doctorId}`);
  return data;
}

/** GET /doctor/completedCheckupsByDoctor?doctorId=&date= */
export async function getCompletedCheckups(doctorId, date) {
  const { data } = await API.get("/doctor/completedCheckupsByDoctor", {
    params: { doctorId, date },
  });
  return data;
}

/** GET /doctor/cancelledAppointmentsByDoctor?doctorId=&date= */
export async function getCancelledAppointments(doctorId, date) {
  const { data } = await API.get("/doctor/cancelledAppointmentsByDoctor", {
    params: { doctorId, date },
  });
  return data;
}

/** GET /doctor/dayWiseTotalAppointments?doctorId=&date= */
export async function getDayWiseTotalAppointments(doctorId, date) {
  const { data } = await API.get("/doctor/dayWiseTotalAppointments", {
    params: { doctorId, date },
  });
  return data;
}

/** POST /doctor/addPrescription/{doctorId}/{patientId}/{appointmentId} */
export async function addPrescription(doctorId, patientId, appointmentId, prescription) {
  const { data } = await API.post(
    `/doctor/addPrescription/${doctorId}/${patientId}/${appointmentId}`,
    prescription
  );
  return data;
}

/** POST /doctor/addMedicine/{prescriptionId} */
export async function addMedicine(prescriptionId, medicine) {
  const { data } = await API.post(`/doctor/addMedicine/${prescriptionId}`, medicine);
  return data;
}

/** POST /doctor/completeConsultation/{prescriptionId} */
export async function completeConsultation(prescriptionId) {
  const { data } = await API.post(`/doctor/completeConsultation/${prescriptionId}`);
  return data;
}

/** GET /doctor/patientPrescriptions/{patientId} */
export async function getPatientPrescriptions(patientId) {
  const { data } = await API.get(`/doctor/patientPrescriptions/${patientId}`);
  return data;
}

/** GET /doctor/lastVisit/{doctorId}/{patientId} */
export async function getLastVisit(doctorId, patientId) {
  const { data } = await API.get(`/doctor/lastVisit/${doctorId}/${patientId}`);
  return data;
}
