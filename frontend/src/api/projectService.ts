// src/api/projectService.ts
import axiosInstance from "./axiosInstance";

export interface Collaborator {
  id: number;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  collaborators?: Collaborator[];
}

export interface CreateProjectDTO {
  name: string;
  description: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}

export interface ProjectsResponse {
  total: number;
  page: number;
  totalPages: number;
  data: Project[];
}

export interface ProjectSingleResponse {
  message: string;
  project: Project;
}

const projectsApi = {
  // Obtener todos los proyectos
  getAll: async (): Promise<ProjectsResponse> => {
    const response = await axiosInstance.get<ProjectsResponse>("/projects");
    return response.data;
  },

  // Obtener proyectos con paginación
  getProjects: async (page = 1, limit = 10): Promise<ProjectsResponse> => {
    const response = await axiosInstance.get<ProjectsResponse>('/projects', {
      params: { page, limit },
    });
    return response.data;
  },
/*
  getProjects: async (page = 1, limit = 10): Promise<ProjectResponse[]> => {
  const response = await axiosInstance.get<ProjectsResponse>('/projects', {
    params: { page, limit },
  });
  return response.data;
}
*/
  getProjectById: async (id: number): Promise<Project> => {
    const response = await axiosInstance.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Crear
  createProject: async (data: CreateProjectDTO): Promise<Project> => {
    const response = await axiosInstance.post<ProjectSingleResponse>(
      "/projects",
      data
    );
    return response.data.project;
  },

  // Actualizar
  updateProject: async (
    id: number,
    data: UpdateProjectDTO
  ): Promise<Project> => {
    const response = await axiosInstance.put<ProjectSingleResponse>(
      `/projects/${id}`,
      data
    );
    return response.data.project;
  },

  deleteProject: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}`);
  },

  addCollaborator: async (projectId: number, userId: number): Promise<void> => {
    await axiosInstance.post(`/projects/${projectId}/collaborators`, { userId });
  },

  removeCollaborator: async (
    projectId: number,
    userId: number
  ): Promise<void> => {
    await axiosInstance.delete(
      `/projects/${projectId}/collaborators/${userId}`
    );
  },
};

export default projectsApi;
