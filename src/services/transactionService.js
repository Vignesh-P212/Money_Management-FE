import axiosInstance from "../api/axiosInstance";

export const getTransactions = async (params) => {
    const res = await axiosInstance.get('/api/transactions', { params });
    return res.data;
};

export const createTransaction = async (data) => {
    const res = await axiosInstance.post('/api/transactions', data);
    return res.data;
};

export const updateTransaction = async (id, data) => {
    const res = await axiosInstance.put(`/api/transactions/${id}`, data);
    return res.data;
};

export const deleteTransaction = async (id) => {
    const res = await axiosInstance.delete(`/api/transactions/${id}`);
    return res.data;
};
