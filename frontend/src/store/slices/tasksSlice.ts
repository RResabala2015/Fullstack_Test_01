// src/store/slices/tasksSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import tasksApi, { type CreateTaskDTO, type UpdateTaskDTO } from '../../api/taskService';
import type { Task } from "../../@types/Task";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  currentProjectId: number | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  currentProjectId: null,
};

// ============================================
// Async Thunks
// ============================================

/**
 * Obtener todas las tareas
 */
export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await tasksApi.getAll();
      console.log('Fetched all tasks:', tasks);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar tareas'
      );
    }
  }
);

/**
 * Obtener tareas con filtros
 */
export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (
    filters: {
      projectId?: number;
      status?: string;
      priority?: string;
      assignedTo?: number;
      sort?: string;
      order?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const tasks = await tasksApi.getTasks(filters);
      console.log('Fetched tasks filtered:', tasks);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al cargar tareas");
    }
  }
);

/**
 * Obtener tareas por proyecto
 */
export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchByProject',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const tasks = await tasksApi.getByProject(projectId);
      return { tasks, projectId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar tareas del proyecto'
      );
    }
  }
);

/**
 * Obtener una tarea por ID
 */
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const task = await tasksApi.getById(id);
      return task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar tarea'
      );
    }
  }
);

/**
 * Crear una nueva tarea
 */
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: CreateTaskDTO, { rejectWithValue }) => {
    try {
      const newTask = await tasksApi.create(taskData);
      return newTask;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear tarea'
      );
    }
  }
);

/**
 * Actualizar una tarea
 */
export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    { id, data }: { id: number; data: UpdateTaskDTO },
    { rejectWithValue }
  ) => {
    try {
      const updatedTask = await tasksApi.update(id, data);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar tarea'
      );
    }
  }
);

/**
 * Eliminar una tarea
 */
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await tasksApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar tarea'
      );
    }
  }
);

export const assignTask = createAsyncThunk(
  "tasks/assign",
  async ({ taskId, userId }: { taskId: number; userId: number }, { rejectWithValue }) => {
    try {
      const updatedTask = await tasksApi.assignTask(taskId, userId);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error al asignar tarea");
    }
  }
);

// ============================================
// Slice
// ============================================

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /**
     * Seleccionar una tarea
     */
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },

    /**
     * Limpiar errores
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Actualización optimista del estado de una tarea (para drag & drop)
     */
    updateTaskStatusOptimistic: (
      state,
      action: PayloadAction<{ id: number; status: Task['status'] }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },

    /**
     * Establecer proyecto actual (para filtrar tareas)
     */
    setCurrentProject: (state, action: PayloadAction<number | null>) => {
      state.currentProjectId = action.payload;
    },

    /**
     * Limpiar todas las tareas
     */
    clearTasks: (state) => {
      state.tasks = [];
      state.selectedTask = null;
      state.currentProjectId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ============================================
    // Fetch all tasks
    // ============================================
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ============================================
    // Fetch tasks by project
    // ============================================
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.currentProjectId = action.payload.projectId;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ============================================
    // Fetch task by ID
    // ============================================
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
        
        // Actualizar también en la lista si existe
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ============================================
    // Create task
    // ============================================
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ============================================
    // Update task
    // ============================================
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        
        // Actualizar selectedTask si es la misma
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ============================================
    // Delete task
    // ============================================
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        
        // Limpiar selectedTask si es la que se eliminó
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    builder.addCase(assignTask.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.tasks.findIndex(t => t.id === updated.id);
      if (index !== -1) state.tasks[index] = updated;
    });
  },
});

// ============================================
// Actions & Selectors
// ============================================

export const {
  setSelectedTask,
  clearError,
  updateTaskStatusOptimistic,
  setCurrentProject,
  clearTasks,
} = tasksSlice.actions;

// Selectores
export const selectAllTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksLoading = (state: { tasks: TasksState }) => state.tasks.loading;
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error;
export const selectSelectedTask = (state: { tasks: TasksState }) => state.tasks.selectedTask;

// Selector para filtrar tareas por estado
export const selectTasksByStatus = (status: Task['status']) => (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter((task) => task.status === status);

// Selector para filtrar tareas por prioridad
export const selectTasksByPriority = (priority: Task['priority']) => (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter((task) => task.priority === priority);

// Selector para contar tareas por estado
export const selectTasksCountByStatus = (state: { tasks: TasksState }) => ({
  pending: state.tasks.tasks.filter((t) => t.status === 'pending').length,
  inProgress: state.tasks.tasks.filter((t) => t.status === 'inProgress').length,
  completed: state.tasks.tasks.filter((t) => t.status === 'completed').length,
});

export default tasksSlice.reducer;