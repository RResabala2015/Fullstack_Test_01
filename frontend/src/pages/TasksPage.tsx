import { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, Chip, CircularProgress, Alert } from "@mui/material";
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
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllTasks,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatusOptimistic,
  clearError
} from "../store/slices/tasksSlice";
import KanbanColumn from "../components/tasks/KanbanColumn";
import TaskModal from "../components/tasks/TaskModal";
import type { Task } from "../@types/Task";

const COLUMNS = [
  {
    id: "pending",
    title: "Pendiente",
    status: "pending" as const,
    color: "#ffa500",
  },
  {
    id: "inProgress",
    title: "Haciendo",
    status: "inProgress" as const,
    color: "#4caf50",
  },
  {
    id: "completed",
    title: "Completado",
    status: "completed" as const,
    color: "#e3e3e3",
  },
];

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const [initialLoad, setInitialLoad] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    projectId: 1,
    status: "pending",
    priority: "high",
    assignedTo: 1,
    sort: "createdAt",
    order: "desc",
  });
  const sensors = useSensors(useSensor(PointerSensor));

  
  const collaborators =
    projects.find((p) => p.id === Number(filters.projectId))?.collaborators || [];

  // Cargar tareas al montar el componente
  useEffect(() => {
    if (initialLoad) {
      dispatch(fetchAllTasks());
      //setInitialLoad(false);
      return;
    }
    dispatch(fetchTasks({
      projectId: filters.projectId ? Number(filters.projectId) : 0,
      status: filters.status,
      priority: filters.priority,
      assignedTo: filters.assignedTo ? Number(filters.assignedTo) : 0,
      sort: filters.sort,
      order: filters.order,
    }));
  }, [dispatch, filters, initialLoad]);

  // Manejar drag & drop
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as Task['status'];

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Actualización optimista
    dispatch(updateTaskStatusOptimistic({ id: taskId, status: newStatus }));

    // Actualización en el backend
    try {
      await dispatch(updateTask({ id: taskId, data: { status: newStatus } })).unwrap();
    } catch (error) {
      // Si falla, revertir (volver a cargar)
      dispatch(fetchTasks({
        projectId: filters.projectId ? Number(filters.projectId) : 0,
        status: filters.status,
        priority: filters.priority,
        assignedTo: filters.assignedTo ? Number(filters.assignedTo) : 0,
        sort: filters.sort,
        order: filters.order,
      }));
      setInitialLoad(true)
    }
  };

  // Abrir modal para editar
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setOpenModal(true);
  };

  // Guardar tarea (crear o actualizar)
  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        // Actualizar tarea existente
        await dispatch(
          updateTask({
            id: editingTask.id,
            data: {
              title: taskData.title,
              description: taskData.description,
              status: taskData.status,
              priority: taskData.priority,
            },
          })
        ).unwrap();
      } else {
        // Crear nueva tarea
        // NOTA: Ajusta el projectId según tu lógica (parámetro de URL, selector Redux, etc.)
        const selectedProjectId = 1; // TODO: Obtener del estado global o parámetros
        
        await dispatch(
          createTask({
            title: taskData.title!,
            description: taskData.description!,
            status: taskData.status,
            priority: taskData.priority,
            projectId: selectedProjectId || 0,
            assignedTo: taskData.assignedTo || 0,
          })
        ).unwrap();
      }

      setOpenModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error al guardar tarea:', error);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  // Contador de tareas por estado
  const getTaskCountByStatus = (status: string) => {
    return tasks.filter((t) => t.status === status).length;
  };

  // Loading state
  if (loading && tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Tareas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {tasks.length} tareas en total
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTask(null);
              setOpenModal(true);
            }}
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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}
      </Box>
      {/* Filtros */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Proyecto */}
        <select
          value={filters.projectId}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, projectId: Number(e.target.value)}))
          }
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">Todos los proyectos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Estado */}
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="inProgress">Haciendo</option>
          <option value="completed">Completado</option>
        </select>

        {/* Prioridad */}
        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="mid">Media</option>
          <option value="high">Alta</option>
        </select>

        {/* Asignado a */}
        <select
          value={filters.assignedTo}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, assignedTo: Number(e.target.value) }))
          }
          disabled={!filters.projectId}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">Todos los usuarios</option>
          {collaborators.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Ordenar por */}
        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sort: e.target.value }))
          }
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="createdAt">Fecha creación</option>
          <option value="priority">Prioridad</option>
          <option value="status">Estado</option>
        </select>

        {/* Orden ASC/DESC */}
        <select
          value={filters.order}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, order: e.target.value }))
          }
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <Button
          variant="outlined"
          onClick={() =>
            setFilters({
              projectId: 0,
              status: "pending",
              priority: "low",
              assignedTo: 0,
              sort: "createdAt",
              order: "desc",
            })
          }
        >
          Limpiar filtros
        </Button>
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
                      setEditingTask={handleEditTask}
                      openModal={setOpenModal}
                      onDelete={handleDeleteTask}
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
                      onClick={() => {
                        setEditingTask(null);
                        setOpenModal(true);
                      }}
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