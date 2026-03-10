import axiosInstance from "../api/axiosInstance";

export const getInsights = async () => {
    const res = await axiosInstance.get('/insights');
    return res.data;
};
