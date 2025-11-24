// src/pages/ProjectsPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
  //Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import GroupIcon from '@mui/icons-material/Group';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  clearError,
} from '../store/slices/projectsSlice';
import type { Project, CreateProjectDTO } from '../api/projectService';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  //const { user } = useAppSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectDTO>({
    name: '',
    description: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuProject, setSelectedMenuProject] = useState<Project | null>(null);

  // Cargar proyectos al montar
  useEffect(() => {
    dispatch(fetchProjects({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Abrir modal para crear
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '' });
    setOpenModal(true);
  };

  // Abrir modal para editar
  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
    });
    setOpenModal(true);
    handleCloseMenu();
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProject(null);
    setFormData({ name: '', description: '' });
  };

  // Guardar proyecto (crear o actualizar)
  const handleSaveProject = async () => {
    if (!formData.name.trim()) {
      alert('El nombre del proyecto es requerido');
      return;
    }

    try {
      if (editingProject) {
        // Actualizar
        await dispatch(
          updateProject({
            id: editingProject.id,
            data: formData,
          })
        ).unwrap();
      } else {
        // Crear
        await dispatch(createProject(formData)).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    }
  };

  // Eliminar proyecto
  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`¿Eliminar el proyecto "${project.name}"?`)) return;

    try {
      await dispatch(deleteProject(project.id)).unwrap();
      handleCloseMenu();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  // Ver tareas del proyecto
  const handleViewProject = (project: Project) => {
    dispatch(setSelectedProject(project));
    navigate(`/projects/${project.id}/tasks`);
  };

  // Menu de acciones
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMenuProject(project);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMenuProject(null);
  };

  // Loading state
  if (loading && projects.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Mis Proyectos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Nuevo Proyecto
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <FolderIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes proyectos aún
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Crea tu primer proyecto para empezar a organizar tus tareas
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
            Crear Proyecto
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => handleViewProject(project)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box
                      sx={{
                        bgcolor: 'primary.50',
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                      }}
                    >
                      <FolderIcon color="primary" />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, project)}
                      sx={{ mt: -1, mr: -1 }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                    {project.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 40,
                    }}
                  >
                    {project.description || 'Sin descripción'}
                  </Typography>

                  {/* Owner Badge */}
                  {/* {project.ownerId === user?.id && (
                    <Chip
                      label="Propietario"
                      size="small"
                      color="primary"
                      sx={{ mt: 2, fontSize: '0.7rem' }}
                    />
                  )} */}

                  {/* Collaborators */}
                  {/* {project.collaborators && project.collaborators.length > 0 && (
                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <GroupIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {project.collaborators.length}{' '}
                        {project.collaborators.length === 1 ? 'colaborador' : 'colaboradores'}
                      </Typography>
                    </Box>
                  )} */}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    fullWidth
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProject(project);
                    }}
                  >
                    Ver Tareas
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu de Acciones */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => selectedMenuProject && handleOpenEditModal(selectedMenuProject)}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => selectedMenuProject && handleDeleteProject(selectedMenuProject)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Modal de Crear/Editar */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Proyecto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              autoFocus
              required
            />
            <TextField
              fullWidth
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProject}
            variant="contained"
            disabled={!formData.name.trim()}
            sx={{ textTransform: 'none' }}
          >
            {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
