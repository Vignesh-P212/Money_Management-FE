import axiosInstance from "../api/axiosInstance";

export const getLiabilities = async () => {
    const res = await axiosInstance.get('/liabilities');
    return res.data;
};

export const createLiability = async (data) => {
    const res = await axiosInstance.post('/liabilities', data);
    return res.data;
};

export const updateLiability = async (id, data) => {
    const res = await axiosInstance.put(`/liabilities/${id}`, data);
    return res.data;
};

export const deleteLiability = async (id) => {
    const res = await axiosInstance.delete(`/liabilities/${id}`);
    return res.data;
};
