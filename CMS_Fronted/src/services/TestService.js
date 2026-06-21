import API from "../api/axiosConfig";

export const testConnection = () => {
    return API.get("/auth/test");
};