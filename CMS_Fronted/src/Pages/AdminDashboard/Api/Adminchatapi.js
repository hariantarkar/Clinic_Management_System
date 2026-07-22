// Central place for every call to the Spring Boot "admin chat" endpoints.
// Assumes the same shared axios instance used by the rest of the admin
// dashboard. Adjust the import path below if your admin API files live
// in a different folder than this one.

import API from '../../patient-dashboard/api/axiosInstance'; // TODO: CONFIRM this path matches your admin-dashboard api folder

/** GET /admin/chat/emergencies/active */
export async function getActiveEmergencies() {
  const { data } = await API.get('admin/emergencies/active');
  return data;
}

/** GET /admin/chat/service-requests/active */
export async function getActiveServiceRequests() {
  const { data } = await API.get('/admin/service-requests/active');
  return data;
}

/** GET /admin/chat/session/{sessionId} */
export async function getSessionTranscript(sessionId) {
  const { data } = await API.get(`/admin/session/${sessionId}`);
  return data;
}

/** PUT /admin/chat/{sessionId}/resolve */
export async function resolveSession(sessionId, adminId, notes) {
  const { data } = await API.put(`/admin/${sessionId}/resolve`, {
    adminId,
    notes,
  });
  return data;
}