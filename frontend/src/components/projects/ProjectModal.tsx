import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProjectForm) => void;
  project: any | null;
}

interface ProjectForm {
  name: string;
  description: string;
}

export default function ProjectModal({
  open,
  onClose,
  onSave,
  project,
}: ProjectModalProps) {
  const { register, handleSubmit, reset } = useForm<ProjectForm>({
    defaultValues: project || {
      name: "",
      description: "",
    },
  });

  if (project) {
    reset(project);
  }

  const submit = (data: ProjectForm) => {
    onSave(data);
    reset({
      name: "",
      description: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {project ? "Editar Proyecto" : "Nuevo Proyecto"}
      </DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nombre del proyecto"
              fullWidth
              {...register("name", { required: true })}
            />

            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
            />
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
