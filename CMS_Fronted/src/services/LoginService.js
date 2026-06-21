import API from "../api/axiosConfig";

export const loginUser = (credentials) => {
  return API.post("/auth/login", credentials);
};
 