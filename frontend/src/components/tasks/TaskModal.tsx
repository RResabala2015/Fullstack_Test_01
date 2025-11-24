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
import type { CreateTaskDTO } from "../../api/taskService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (task: CreateTaskDTO) => void;
  task: any; // puede ser TaskResponse (editar) o null (crear)
}

export default function TaskModal({ open, onClose, onSave, task }: Props) {
  const defaultValues = task
    ? {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
      }
    : {
        title: "",
        description: "",
        priority: "mid",
        status: "pending",
      };

  const { register, handleSubmit, reset } = useForm<CreateTaskDTO>({
    defaultValues,
  });

  // reset cuando cambia la tarea
  if (task) reset(defaultValues);

  const submit = (data: CreateTaskDTO) => {
    onSave({
      ...data,
      projectId: task?.projectId ?? task?.project_id ?? 0, // Asegurar que exista
    });
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Título"
              {...register("title", { required: true })}
              fullWidth />
            <TextField
              label="Descripción"
              {...register("description", { required: true })}
              fullWidth
              multiline
              rows={3}
            />

            <TextField select label="Prioridad" {...register("priority", { required: true })}>
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="mid">Media</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </TextField>

            <TextField select label="Estado" {...register("status" , { required: true })}>
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="inProgress">En Progreso</MenuItem>
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
