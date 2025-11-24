import axiosInstance from './axiosInstance';
import type { Task } from "../@types/Task";

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  projectId: number;
  assignedTo: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
}

export interface TasksResponse {
  data: Task[];
}

export interface TaskResponse {
  message: string;
  task: Task;
}

const tasksApi = {
  // Obtener todas las tareas
  getAll: async (): Promise<Task[]> => {
    const response = await axiosInstance.get<TasksResponse>('/tasks');
    return response.data.data;
  },

  getTasks: async (params: {
    projectId?: number;
    assignedTo?: number;
    sort?: string;
    order?: string;
  }) => {

    console.log(params);
    const response = await axiosInstance.get<Task[]>("/tasks/filtered", { params });
    return response.data;
  },

  // Obtener una tarea por ID
  getById: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Crear una nueva tarea
  create: async (task: CreateTaskDTO): Promise<Task> => {
    const response = await axiosInstance.post<TaskResponse>('/tasks', task);
    return response.data.task;
  },

  // Actualizar una tarea
  update: async (id: number, task: UpdateTaskDTO): Promise<Task> => {
    const response = await axiosInstance.put<TaskResponse>(`/tasks/${id}`, task);
    return response.data.task;
  },

  // Eliminar una tarea
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  // Obtener tareas por proyecto
  getByProject: async (projectId: number): Promise<Task[]> => {
    const response = await axiosInstance.get<TasksResponse>(`/tasks?projectId=${projectId}`);
    return response.data.data;
  },

  assignTask: async (taskId: number, userId: number) => {
    const response = await axiosInstance.put(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },

};

export default tasksApi;