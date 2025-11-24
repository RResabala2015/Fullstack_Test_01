import { Box, Card, CardContent, Typography, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../../@types/Task";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  setEditingTask: (task: Task) => void;
  openModal: (open: boolean) => void;
  onDelete?: (taskId: number) => void;
}

// Componente de Tarea Draggable
function DraggableTask({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    : undefined;

  const priorityColors = {
    low: '#94a3b8',
    mid: '#f59e0b',
    high: '#ef4444',
  };

  const priorityLabels = {
    low: 'Baja',
    mid: 'Media',
    high: 'Alta',
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        mb: 1.5,
        cursor: 'grab',
        '&:hover': {
          boxShadow: 2,
        },
        ...style,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1, pr: 1 }}>
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            sx={{ mt: -0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                onEdit();
                setAnchorEl(null);
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete();
                setAnchorEl(null);
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Eliminar
            </MenuItem>
          </Menu>
        </Box>

        {task.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box display="flex" gap={1} mt={1.5}>
          <Chip
            label={priorityLabels[task.priority as "low" | "mid" | "high"]}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.7rem',
              bgcolor: priorityColors[task.priority  as "low" | "mid" | "high"],
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function KanbanColumn({
  id,
  tasks,
  setEditingTask,
  openModal,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box ref={setNodeRef} sx={{ minHeight: 200 }}>
      {tasks.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">Sin tareas</Typography>
        </Box>
      ) : (
        tasks.map((task) => (
          <DraggableTask
            key={task.id}
            task={task}
            onEdit={() => {
              setEditingTask(task);
              openModal(true);
            }}
            onDelete={() => onDelete?.(task.id)}
          />
        ))
      )}
    </Box>
  );
}
