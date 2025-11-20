import { Typography, Paper } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import type { Task } from "../../pages/TasksPage";

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  setEditingTask: (t: Task) => void;
  openModal: (b: boolean) => void;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  setEditingTask,
  openModal,
}: Props) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Paper sx={{ p: 2, height: "80vh", overflowY: "auto" }} ref={setNodeRef}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => {
            setEditingTask(task);
            openModal(true);
          }}
        />
      ))}
    </Paper>
  );
}
