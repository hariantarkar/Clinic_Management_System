import API from "../api/axiosConfig";

export const registerUser = (userData) => {
    return API.post("/auth/reg", userData);
}
