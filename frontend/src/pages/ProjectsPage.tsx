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

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectService";

interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [openCollaborators, setOpenCollaborators] = useState(false);
  const [collabProject, setCollabProject] = useState<Project | null>(null);

  const handleCollaborators = (project: Project) => {
    setCollabProject(project);
    setOpenCollaborators(true);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects(page + 1, limit);
      setProjects(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [page, limit]);

  const handleOpenNew = () => {
    setSelectedProject(null);
    setOpenModal(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas eliminar este proyecto?")) return;

    try {
      await deleteProject(id);

      if (projects.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        loadProjects();
      }
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
    }
  };

  const handleSave = async (data: any) => {
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
                        onClick={() => handleDelete(project.id)}
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
        onSave={handleSave}
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
