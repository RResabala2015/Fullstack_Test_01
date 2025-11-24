import { Paper, Typography, Chip, Box } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../../@types/Task";

interface Props {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ p: 2, mb: 2, cursor: "grab" }}
      style={style}
      onClick={onClick}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {task.title}
      </Typography>

      <Typography variant="body2" mt={1} mb={1}>
        {task.description}
      </Typography>

      <Box>
        <Chip
          label={task.priority}
          color={
            task.priority === "high"
              ? "error"
              : task.priority === "mid"
              ? "warning"
              : "default"
          }
          size="small"
        />
      </Box>
    </Paper>
  );
}
