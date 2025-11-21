import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";

import { getUsers, type User } from "../../api/userService";
import {
  getProjectCollaborators,
  addCollaboratorToProject,
} from "../../api/collaboratorService";

interface Collaborator {
  userId: number;
  name: string;
  role: "owner" | "collaborator";
}

export default function CollaboratorsModal({ open, onClose, project }: any) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [pending, setPending] = useState<Collaborator[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [newRole, setNewRole] = useState<"owner" | "collaborator">(
    "collaborator"
  );

  useEffect(() => {
    if (open && project?.id) {
      loadUsers();
      loadProjectCollaborators();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProjectCollaborators = async () => {
    try {
      const data = await getProjectCollaborators(project.id);

      setCollaborators(
        data.map((u: any) => ({
          userId: u.id,
          name: u.name,
          role: u.role || "collaborator",
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    if (!selectedUserId) return;

    const user = users.find((u) => u.id === selectedUserId);
    if (!user) return;

    if (
      collaborators.some((c) => c.userId === user.id) ||
      pending.some((c) => c.userId === user.id)
    ) {
      alert("Este usuario ya es colaborador.");
      return;
    }

    const newCollab: Collaborator = {
      userId: user.id,
      name: user.name,
      role: newRole,
    };

    setPending([...pending, newCollab]);
    setSelectedUserId("");
  };

  const handleRemovePending = (userId: number) => {
    setPending(pending.filter((c) => c.userId !== userId));
  };

  const handleSave = async () => {
    if (pending.length === 0) {
      alert("No hay colaboradores nuevos por asignar");
      return;
    }

    try {
      await Promise.all(
        pending.map((col) =>
          addCollaboratorToProject(project.id, col.userId)
        )
      );

      alert("Colaboradores asignados exitosamente");

      setPending([]);
      loadProjectCollaborators();
      onClose();

    } catch (error) {
      console.error(error);
      alert("Error asignando colaboradores");
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Colaboradores de <strong>{project.name}</strong>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" gap={2} mt={1}>
          <TextField
            select
            label="Colaborador"
            value={selectedUserId}
            fullWidth
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Rol"
            value={newRole}
            onChange={(e) =>
              setNewRole(e.target.value as "owner" | "collaborator")
            }
            sx={{ width: 180 }}
          >
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="collaborator">Colaborador</MenuItem>
          </TextField>
        </Box>

        <Button sx={{ mt: 2 }} variant="contained" onClick={handleAdd}>
          Agregar
        </Button>

        <Typography mt={3} mb={1} variant="h6">
          Colaboradores actuales
        </Typography>
        <List>
          {collaborators.map((c) => (
            <ListItem key={c.userId}>
              <ListItemText primary={c.name} />
            </ListItem>
          ))}
        </List>

        {pending.length > 0 && (
          <>
            <Typography mt={3} mb={1} variant="h6">
              Por asignar
            </Typography>

            <List>
              {pending.map((c) => (
                <ListItem
                  key={c.userId}
                  secondaryAction={
                    <IconButton
                      onClick={() => handleRemovePending(c.userId)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={c.name} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button onClick={handleSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
