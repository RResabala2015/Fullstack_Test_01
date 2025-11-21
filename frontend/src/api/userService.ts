import axiosInstance from './axiosInstance';

export interface User {
  id: number;
  name: string;
  email?: string;
}

export const getUsers = async () => {
  try {
    const res = await axiosInstance.get("/users");
    return res.data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw error;
  }
};
