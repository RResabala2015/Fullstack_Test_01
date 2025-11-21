import axiosInstance from "./axiosInstance";

export const getProjectCollaborators = async (projectId: number) => {
  try {
    const { data } = await axiosInstance.get(`/projects/${projectId}/collaborators`);
    return data.collaborators;
  } catch (error) {
    console.error("Error obteniendo colaboradores del proyecto:", error);
    throw error;
  }
};

export const addCollaboratorToProject = async (projectId: number, userId: number) => {
  try {
    const res = await axiosInstance.post(`/projects/add-collaborator`, {
      projectId,
      userId,
    });
    return res.data;
  } catch (error) {
    console.error("Error agregando colaborador:", error);
    throw error;
  }
};
