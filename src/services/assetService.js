import axiosInstance from "../api/axiosInstance";

export const getAssets = async () => {
    const res = await axiosInstance.get('/assets');
    return res.data;
};

export const createAsset = async (data) => {
    const res = await axiosInstance.post('/assets', data);
    return res.data;
};

export const updateAsset = async (id, data) => {
    const res = await axiosInstance.put(`/assets/${id}`, data);
    return res.data;
};

export const deleteAsset = async (id) => {
    const res = await axiosInstance.delete(`/assets/${id}`);
    return res.data;
};
