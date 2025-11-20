import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import type { Task } from "../../pages/TasksPage";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
}

export default function TaskModal({ open, onClose, onSave, task }: Props) {
  const { register, handleSubmit, reset } = useForm<Task>({
    defaultValues:
      task || {
        id: "",
        title: "",
        description: "",
        status: "pending",
        priority: "low",
      },
  });

  if (task) reset(task);

  const submit = (data: Task) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Título" {...register("title")} fullWidth />
            <TextField
              label="Descripción"
              {...register("description")}
              fullWidth
              multiline
              rows={3}
            />

            <TextField select label="Prioridad" {...register("priority")}>
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="mid">Media</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </TextField>

            <TextField select label="Estado" {...register("status")}>
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="in-progress">En Progreso</MenuItem>
              <MenuItem value="completed">Completada</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
