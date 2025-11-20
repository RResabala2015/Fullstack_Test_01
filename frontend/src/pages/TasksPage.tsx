import { useState } from "react";
import { Box, Typography, Button, IconButton, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
 type DragEndEvent,
} from "@dnd-kit/core";
import KanbanColumn from "../components/tasks/KanbanColumn";
import TaskModal from "../components/tasks/TaskModal";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "mid" | "high";
};

const COLUMNS = [
  {
    id: "pending",
    title: "To Do",
    status: "pending" as const,
    color: "#ffa500",
  },
  {
    id: "in-progress",
    title: "Doing",
    status: "in-progress" as const,
    color: "#4caf50",
  },
  {
    id: "completed",
    title: "Closed",
    status: "completed" as const,
    color: "#e3e3e3",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Diseñar login",
      description: "Pantalla de login en Figma",
      status: "pending",
      priority: "mid",
    },
    {
      id: "2",
      title: "Implementar API /login",
      description: "Crear endpoint y validaciones",
      status: "in-progress",
      priority: "high",
    },
    {
      id: "3",
      title: "Actualizar README",
      description: "Agregar instrucciones del proyecto",
      status: "completed",
      priority: "low",
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const updated = [...tasks];
    const taskIndex = updated.findIndex((t) => t.id === active.id);
    const newStatus =
      over.id === "pending"
        ? "pending"
        : over.id === "in-progress"
        ? "in-progress"
        : "completed";
    updated[taskIndex].status = newStatus;
    setTasks(updated);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks([...tasks, { ...task, id: String(Date.now()) }]);
    }
    setOpenModal(false);
    setEditingTask(null);
  };

  const getTaskCountByStatus = (status: string) => {
    return tasks.filter((t) => t.status === status).length;
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#fafafa" }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "white",
          px: 3,
          py: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            Tareas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Nueva Tarea
          </Button>
        </Box>
      </Box>

      {/* Board Container */}
      <Box
        sx={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          px: 2,
          py: 3,
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              height: "100%",
              minWidth: "min-content",
            }}
          >
            {COLUMNS.map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column.status);
              const taskCount = getTaskCountByStatus(column.status);

              return (
                <Box
                  key={column.id}
                  sx={{
                    width: 340,
                    minWidth: 340,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "white",
                    borderRadius: 1,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  {/* Column Header */}
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: column.color,
                        }}
                      />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {column.title}
                      </Typography>
                      <Chip
                        label={taskCount}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.75rem",
                          bgcolor: "#f5f5f5",
                        }}
                      />
                    </Box>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Column Content */}
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      p: 2,
                      bgcolor: "#fafafa",
                    }}
                  >
                    <KanbanColumn
                      id={column.id}
                      title=""
                      tasks={columnTasks}
                      setEditingTask={setEditingTask}
                      openModal={setOpenModal}
                    />
                  </Box>

                  {/* Add Issue Button */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <Button
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => setOpenModal(true)}
                      sx={{
                        textTransform: "none",
                        color: "text.secondary",
                        justifyContent: "flex-start",
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
                      }}
                    >
                      Crear Tarea
                    </Button>
                  </Box>
                </Box>
              );
            })}

            {/* Closed Column */}
            {/* <Box
              sx={{
                width: 340,
                minWidth: 340,
                display: "flex",
                flexDirection: "column",
                bgcolor: "white",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#9e9e9e",
                    }}
                  />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Closed
                  </Typography>
                  <Chip
                    label={0}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.75rem",
                      bgcolor: "#f5f5f5",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  p: 4,
                }}
              >
                <Typography variant="body2">No closed issues</Typography>
              </Box>
            </Box> */}
          </Box>
        </DndContext>
      </Box>

      <TaskModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </Box>
  );
}