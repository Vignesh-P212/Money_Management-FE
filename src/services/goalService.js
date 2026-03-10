import axiosInstance from "../api/axiosInstance";

export const getGoals = async () => {
    const res = await axiosInstance.get('/goals');
    return res.data;
};

export const createGoal = async (data) => {
    const res = await axiosInstance.post('/goals', data);
    return res.data;
};

export const updateGoal = async (id, data) => {
    const res = await axiosInstance.put(`/goals/${id}`, data);
    return res.data;
};

export const deleteGoal = async (id) => {
    const res = await axiosInstance.delete(`/goals/${id}`);
    return res.data;
};
