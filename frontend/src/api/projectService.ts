import axiosInstance from './axiosInstance';

export const getProjects = async (page = 1, limit = 10) => {
  const res = await axiosInstance.get(`/projects`, { params: { page, limit } });
  return res.data;
};

export const createProject = async (data: any) => {
  const res = await axiosInstance.post(`/projects`, data);
  return res.data;
};

export const updateProject = async (id: number, data: any) => {
  const res = await axiosInstance.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number) => {
  const res = await axiosInstance.delete(`/projects/${id}`);
  return res.data;
};