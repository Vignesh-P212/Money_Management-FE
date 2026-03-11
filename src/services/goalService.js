import axiosInstance from "../api/axiosInstance";

export const getGoals = async () => {
    const res = await axiosInstance.get('/api/goals');
    return res.data;
};

export const createGoal = async (data) => {
    const res = await axiosInstance.post('/api/goals', data);
    return res.data;
};

export const updateGoal = async (id, data) => {
    const res = await axiosInstance.put(`/api/goals/${id}`, data);
    return res.data;
};

export const deleteGoal = async (id) => {
    const res = await axiosInstance.delete(`/api/goals/${id}`);
    return res.data;
};
