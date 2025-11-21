import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Paper, Select, MenuItem, FormControl } from "@mui/material";
import { Grid }  from "@mui/material";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";

import {
  getUserStats
} from "../api/statsService";

interface UserStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  tasksByStatus: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  tasksByPriority: {
    low: number;
    mid: number;
    high: number;
  };
  tasksOverTime: Array<{
    date: string;
    pending: number;
    inProgress: number;
    completed: number;
  }>;
  activityByDay: Array<{
    day: string;
    tasks: number;
  }>;
}

export default function UserStatsPage() {
  const [stats, setStats] = useState<UserStats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    tasksByStatus: {
      pending: 0,
      inProgress: 0,
      completed: 0,
    },
    tasksByPriority: {
      low: 0,
      mid: 0,
      high: 0,
    },
    tasksOverTime: [],
    activityByDay: [],
  });

  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
  loadStats();
}, [timeRange]);

  const loadStats = async () => {
    try {
      const data = await getUserStats(timeRange);

      setStats({
        totalProjects: data.totalProjects,
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        tasksByStatus: data.tasksByStatus,
        tasksByPriority: data.tasksByPriority,
        tasksOverTime: data.tasksOverTime,
        activityByDay: data.activityByDay,
      });
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const statusData = [
    {
      id: 0,
      value: stats.tasksByStatus.pending,
      label: "Pending",
      color: "#6366f1",
    },
    {
      id: 1,
      value: stats.tasksByStatus.inProgress,
      label: "In Progress",
      color: "#f59e0b",
    },
    {
      id: 2,
      value: stats.tasksByStatus.completed,
      label: "Completed",
      color: "#10b981",
    },
  ];

  const priorityData = [
    {
      id: 0,
      value: stats.tasksByPriority.low,
      label: "Low",
      color: "#94a3b8",
    },
    {
      id: 1,
      value: stats.tasksByPriority.mid,
      label: "Mid",
      color: "#f59e0b",
    },
    {
      id: 2,
      value: stats.tasksByPriority.high,
      label: "High",
      color: "#ef4444",
    },
  ];

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    trend,
  }: {
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: { value: number; data: number[] };
  }) => (
    <Card sx={{ height: "100%", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: "primary.50",
              borderRadius: 1.5,
              p: 1,
              display: "flex",
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box mt={2}>
            <LineChart
              series={[
                {
                  data: trend.data,
                  color: "#6366f1",
                  showMark: false,
                  curve: "natural",
                },
              ]}
              height={60}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
              sx={{
                "& .MuiLineElement-root": {
                  strokeWidth: 2,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your projects and tasks
        </Typography>
      </Box>

      {/* Time Range Selector */}
      <Box mb={3} display="flex" justifyContent="flex-end">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ bgcolor: "white" }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<FolderIcon />}
            trend={{
              value: 12,
              data: [3, 4, 4, 5, 5],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            subtitle={`${stats.completedTasks} completed`}
            icon={<AssignmentIcon />}
            trend={{
              value: 8,
              data: [18, 22, 28, 40, 48],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Completion Rate"
            value={
              stats.totalTasks > 0
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                : 0
            }
            subtitle={`${stats.completedTasks}/${stats.totalTasks} tasks`}
            icon={<TrendingUpIcon />}
            trend={{
              value: 15,
              data: [56, 68, 64, 75, 67],
            }}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={3}>
        {/* Tasks Over Time */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Tasks Over Time
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Task distribution by status
              </Typography>
            </Box>
            <LineChart
              series={[
                {
                  data: stats.tasksOverTime.map((d) => d.pending),
                  label: "Pending",
                  color: "#6366f1",
                  showMark: true,
                  curve: "natural",
                },
                {
                  data: stats.tasksOverTime.map((d) => d.inProgress),
                  label: "In Progress",
                  color: "#f59e0b",
                  showMark: true,
                  curve: "natural",
                },
                {
                  data: stats.tasksOverTime.map((d) => d.completed),
                  label: "Completed",
                  color: "#10b981",
                  showMark: true,
                  curve: "natural",
                },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: stats.tasksOverTime.map((d) => d.date),
                },
              ]}
              height={350}
              margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
            />
          </Paper>
        </Grid>

        {/* Tasks by Status */}
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", height: "100%" }}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Tasks by Status
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Current distribution
              </Typography>
            </Box>
            <PieChart
              series={[
                {
                  data: statusData,
                  innerRadius: 50,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              height={300}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
              slotProps={{
                legend: {
                  position: { vertical: "middle", horizontal: "end" },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Tasks by Priority */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Tasks by Priority
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Priority distribution
              </Typography>
            </Box>
            <BarChart
              series={[
                {
                  data: priorityData.map((d) => d.value),
                  color: "#6366f1",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: priorityData.map((d) => d.label),
                },
              ]}
              height={300}
              margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
            />
          </Paper>
        </Grid>

        {/* Activity by Day */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Activity by Day
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tasks created per day
              </Typography>
            </Box>
            <BarChart
              series={[
                {
                  data: stats.activityByDay.map((d) => d.tasks),
                  color: "#10b981",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: stats.activityByDay.map((d) => d.day),
                },
              ]}
              height={300}
              margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}