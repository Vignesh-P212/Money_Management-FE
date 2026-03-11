import axiosInstance from "../api/axiosInstance";

export const getAssets = async () => {
    const res = await axiosInstance.get('/api/assets');
    return res.data;
};

export const createAsset = async (data) => {
    const res = await axiosInstance.post('/api/assets', data);
    return res.data;
};

export const updateAsset = async (id, data) => {
    const res = await axiosInstance.put(`/api/assets/${id}`, data);
    return res.data;
};

export const deleteAsset = async (id) => {
    const res = await axiosInstance.delete(`/api/assets/${id}`);
    return res.data;
};
