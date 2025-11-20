import { useState } from "react";
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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ProjectModal from "../components/projects/ProjectModal";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Proyecto Principal",
      description: "Proyecto de ejemplo para iniciar",
      createdAt: "2025-11-01",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenNew = () => {
    setSelectedProject(null);
    setOpenModal(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Deseas eliminar este proyecto?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSave = (data: any) => {
    if (selectedProject) {
      // actualizar
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id ? { ...p, ...data } : p
        )
      );
    } else {
      // crear nuevo
      setProjects((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ...data,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    setOpenModal(false);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Proyectos
      </Typography>

      <Button variant="contained" onClick={handleOpenNew}>
        Nuevo Proyecto
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Creado el</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.createdAt}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(project)}
                  >
                    <EditIcon />
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
          </TableBody>
        </Table>
      </TableContainer>

      <ProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        project={selectedProject}
      />
    </Box>
  );
}
