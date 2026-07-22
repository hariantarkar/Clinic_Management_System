// Central place for every call to the Spring Boot "patient chat" endpoints.
// Uses the shared axios instance (./axiosInstance) — same pattern as patientApi.js.

import API from "./axiosInstance";

/** POST /patient/chat/start/{patientId} */
export async function startChatSession(patientId) {
  const { data } = await API.post(`patient/start/${patientId}`);
  return data;
}

/** POST /patient/chat/message */
export async function sendChatMessage(sessionId, message) {
  const { data } = await API.post(`/patient/message`, {
    sessionId,
    message,
  });
  return data;
}

/** GET /patient/chat/history/{sessionId} */
export async function getChatHistory(sessionId) {
  const { data } = await API.get(`/patient/history/${sessionId}`);
  return data;
}

/** GET /patient/chat/sessions/{patientId} */
export async function getChatSessions(patientId) {
  const { data } = await API.get(`/patient/sessions/${patientId}`);
  return data;
}