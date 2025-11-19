import axiosInstance from './axiosInstance';
import type { LoginFormData } from "../validation/login.schema";
import type { RegisterFormData } from "../validation/register.schema";


export const loginRequest = async (data: LoginFormData) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const registerRequest = async (data: RegisterFormData) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};