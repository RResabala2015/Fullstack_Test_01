import axiosInstance from "./axiosInstance";

export const getUserStats = async (range = "30d") => {
  const res = await axiosInstance.get(`/stats/general?range=${range}`);
  return res.data;
};
