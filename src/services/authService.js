import axiosInstance from "../api/axiosInstance";

export const registerUser = async (data) => {
    const res = await axiosInstance.post('/api/auth/register', data);
    return res.data;
};

export const loginUser = async (data) => {
    const res = await axiosInstance.post('/api/auth/login', data);
    return res.data;
};
