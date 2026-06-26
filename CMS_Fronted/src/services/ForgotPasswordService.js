
import API from "../api/axiosConfig";
export const forgotPassword = (email) => {
  return API.post("/auth/forgot-password", { email });
};
 
export const resetPassword = ({ email, otp, newPassword }) => {
  return API.post("/auth/reset-password", { email, otp, newPassword });
};