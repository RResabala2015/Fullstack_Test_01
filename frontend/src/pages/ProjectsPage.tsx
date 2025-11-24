import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  TablePagination,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/GroupAdd";

import ProjectModal from "../components/projects/ProjectModal";
import CollaboratorsModal from "../components/projects/CollaboratorsModal";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../store/slices/projectsSlice';

import type { Project } from '../api/projectService';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { total, projects, loading } = useAppSelector((state) => state.projects);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [openCollaborators, setOpenCollaborators] = useState(false);
  const [collabProject, setCollabProject] = useState<Project | null>(null);

  const handleCollaborators = (project: Project) => {
    setCollabProject(project);
    setOpenCollaborators(true);
  };

  useEffect(() => {
    dispatch(fetchProjects({ page: page + 1, limit }));
  }, [dispatch, page, limit]);

  const handleOpenNew = () => {
    setSelectedProject(null);
    setOpenModal(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`¿Eliminar el proyecto "${project.name}"?`)) return;

    try {
      await dispatch(deleteProject(project.id)).unwrap();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  /* const handleSave = async (data: any) => {
    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, data);
      } else {
        await createProject(data);
      }

      setOpenModal(false);
      loadProjects();
    } catch (error) {
      console.error("Error guardando proyecto:", error);
    }
  }; */

  const handleSaveProject = async (data: any) => {
    try {
      if (selectedProject) {
        await dispatch(
          updateProject({
            id: selectedProject.id,
            data: data,
          })
        ).unwrap();
      } else {
        // Crear
        await dispatch(createProject(data)).unwrap();
      }
      setOpenModal(false);
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const text = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(text) ||
      (p.description || "").toLowerCase().includes(text)
    );
  });


  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Proyectos
      </Typography>

      <Button variant="contained" onClick={handleOpenNew}>
        Nuevo Proyecto
      </Button>

      {/* Campo de búsqueda */}
      <Box mt={3} mb={2}>
        <TextField
          label="Buscar proyectos"
          placeholder="Filtrar por nombre o descripción..."
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box mt={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(project)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleCollaborators(project)}
                      >
                        <GroupIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDeleteProject(project)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No hay resultados para tu búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      )}

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveProject}
        project={selectedProject}
      />
      <CollaboratorsModal
        open={openCollaborators}
        onClose={() => setOpenCollaborators(false)}
        project={collabProject}
      />
    </Box>
  );
}
