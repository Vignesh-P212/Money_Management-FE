import axiosInstance from "../api/axiosInstance";

export const getLiabilities = async () => {
    const res = await axiosInstance.get('/api/liabilities');
    return res.data;
};

export const createLiability = async (data) => {
    const res = await axiosInstance.post('/api/liabilities', data);
    return res.data;
};

export const updateLiability = async (id, data) => {
    const res = await axiosInstance.put(`/api/liabilities/${id}`, data);
    return res.data;
};

export const deleteLiability = async (id) => {
    const res = await axiosInstance.delete(`/api/liabilities/${id}`);
    return res.data;
};
