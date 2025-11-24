import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import projectsApi, { type Project, type CreateProjectDTO, type UpdateProjectDTO } from '../../api/projectService';

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;

  total: number;
  page: number;
  totalPages: number;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1
};

// ============================================
// Async Thunks
// ============================================




// Obtener todos los proyectos del usuario
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getProjects(page, limit);
      //console.log('API response for fetchProjects:', response);
      return {
        projects: response.data,
        total: response.total,
        page: response.page,
        totalPages: response.totalPages
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proyectos');
    }
  }
);

// Obtener un proyecto por ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const project = await projectsApi.getProjectById(id);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proyecto');
    }
  }
);

// Crear proyecto
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: CreateProjectDTO, { rejectWithValue }) => {
    try {
      const newProject = await projectsApi.createProject(projectData);
      return newProject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear proyecto');
    }
  }
);

// Actualizar proyecto
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: number; data: UpdateProjectDTO }, { rejectWithValue }) => {
    try {
      const updatedProject = await projectsApi.updateProject(id, data);
      return updatedProject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar proyecto');
    }
  }
);

// Eliminar proyecto
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await projectsApi.deleteProject(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar proyecto');
    }
  }
);

// Agregar colaborador
export const addCollaborator = createAsyncThunk(
  'projects/addCollaborator',
  async ({ projectId, userId }: { projectId: number; userId: number }, { rejectWithValue }) => {
    try {
      await projectsApi.addCollaborator(projectId, userId);
      return { projectId, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al agregar colaborador');
    }
  }
);

// Remover colaborador
export const removeCollaborator = createAsyncThunk(
  'projects/removeCollaborator',
  async ({ projectId, userId }: { projectId: number; userId: number }, { rejectWithValue }) => {
    try {
      await projectsApi.removeCollaborator(projectId, userId);
      return { projectId, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al remover colaborador');
    }
  }
);

// ============================================
// Slice
// ============================================

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        //console.log('Fetched projects:', action.payload);
        state.loading = false;
        state.projects = action.payload.projects;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch project by ID
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        const newProject: Project = action.payload;
        state.projects.push(newProject);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updated: Project = action.payload;
        const index = state.projects.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.projects[index] = updated;
        }
        if (state.selectedProject?.id === updated.id) {
          state.selectedProject = updated;
      }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload as number;
        state.projects = state.projects.filter((p) => p.id !== id);
        if (state.selectedProject?.id === id) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add collaborator
    builder
      .addCase(addCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollaborator.fulfilled, (state) => {
        state.loading = false;
        // Recargar proyecto si es necesario
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove collaborator
    builder
      .addCase(removeCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCollaborator.fulfilled, (state) => {
        state.loading = false;
        // Recargar proyecto si es necesario
      })
      .addCase(removeCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProject, clearError, clearProjects } = projectsSlice.actions;
export default projectsSlice.reducer;