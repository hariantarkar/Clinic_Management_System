import API from "../../patient-dashboard/api/axiosInstance";

/** POST /admin/addNewDoctor */
export async function addDoctor(doctor) {
  const { data } = await API.post("/admin/addNewDoctor", doctor);
  return data;
}
/** GET /admin/pendingDoctors */
export async function getPendingDoctors() {
  const { data } = await API.get("/admin/pendingDoctors");
  return data;
}

/** POST /admin/addDoctorFromRegistration/{registerId} */
export async function addDoctorFromRegistration(registerId, doctorDetails) {
  const { data } = await API.post(`/admin/addDoctorFromRegistration/${registerId}`, doctorDetails);
  return data;
}
/** GET /admin/totalDoctors */
export async function getTotalDoctors() {
  const { data } = await API.get("/admin/totalDoctors");
  return data;
}


/** GET /admin/getDoctor/{doctorId} */
export async function getDoctorById(doctorId) {
  const { data } = await API.get(`/admin/getDoctor/${doctorId}`);
  return data;
}

/** PUT /admin/updateDoctor/{doctorId} */
export async function updateDoctor(doctorId, doctor) {
  const { data } = await API.put(`/admin/updateDoctor/${doctorId}`, doctor);
  return data;
}

/** PUT /admin/setDoctorActiveStatus/{doctorId}?active=true|false */
export async function setDoctorActiveStatus(doctorId, active) {
  const { data } = await API.put(`/admin/setDoctorActiveStatus/${doctorId}`, null, {
    params: { active },
  });
  return data;
}

/** GET /admin/totalRegisterPatients */
export async function getTotalPatients() {
  const { data } = await API.get("/admin/totalRegisterPatients");
  return data;
}

/** GET /admin/completedCheckupsByDate?date= */
export async function getCompletedCheckupsByDate(date) {
  const { data } = await API.get("/admin/completedCheckupsByDate", { params: { date } });
  return data;
}

/** POST /admin/addSlot/{doctorId} */
export async function addSlot(doctorId, slot) {
  const { data } = await API.post(`/admin/addSlot/${doctorId}`, slot);
  return data;
}

/** GET /admin/getAllDoctors */
export async function getAllDoctors() {
  const { data } = await API.get("/admin/getAllDoctors");
  return data;
}
/** GET /admin/viewSlots/{doctorId} */
export async function viewSlots(doctorId) {
  const { data } = await API.get(`/admin/viewSlots/${doctorId}`);
  return data;
}

/** put /admin/updateSlot/{slotId} — switch to PUT if CORS rejects it, same issue as the doctor side */
export async function updateSlot(slotId, updatedSlot) {
  const { data } = await API.put(`/admin/updateSlot/${slotId}`, updatedSlot);
  return data;
}
/** GET /admin/upcomingAppointments/{doctorId} */
export async function getUpcomingAppointments(doctorId) {
  const { data } = await API.get(`/admin/upcomingAppointments/${doctorId}`);
  return data;
}

/** GET /admin/dayWiseTotalAppointments?doctorId=&date= */
export async function getDayWiseTotalAppointments(doctorId, date) {
  const { data } = await API.get("/admin/dayWiseTotalAppointments", { params: { doctorId, date } });
  return data;
}
/** GET /admin/cancelledAppointmentsByDoctor?doctorId=&date= */
export async function getCancelledAppointmentsByDoctor(doctorId, date) {
  const { data } = await API.get("/admin/cancelledAppointmentsByDoctor", { params: { doctorId, date } });
  return data;
}
/** GET /admin/cancelledAppointmentsByDate?date= */
export async function getCancelledAppointmentsByDate(date) {
  const { data } = await API.get("/admin/cancelledAppointmentsByDate", { params: { date } });
  return data;
}
/** GET /admin/completedCheckupsByDoctor?doctorId=&date= */
export async function getCompletedCheckupsByDoctor(doctorId, date) {
  const { data } = await API.get("/admin/completedCheckupsByDoctor", { params: { doctorId, date } });
  return data;
}
/** GET /admin/totalRevenue */
export async function getTotalRevenue() {
  const { data } = await API.get("/admin/totalRevenue");
  return data;
}

/** GET /admin/revenueByDoctor?doctorId= */
export async function getRevenueByDoctor(doctorId) {
  const { data } = await API.get("/admin/revenueByDoctor", { params: { doctorId } });
  return data;
}

/** GET /admin/revenueByDateRange?from=&to= */
export async function getRevenueByDateRange(from, to) {
  const { data } = await API.get("/admin/revenueByDateRange", { params: { from, to } });
  return data;
}

/** GET /admin/revenueByDoctorAndDateRange?doctorId=&from=&to= */
export async function getRevenueByDoctorAndDateRange(doctorId, from, to) {
  const { data } = await API.get("/admin/revenueByDoctorAndDateRange", { params: { doctorId, from, to } });
  return data;
}