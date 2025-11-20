import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: Props) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
      }}
    >
      <Toolbar>
        <Typography variant="h6">GestorApp</Typography>
      </Toolbar>

      <Box sx={{ mt: 2 }}>
        <List>
          <ListItemButton component={RouterLink} to="/projects">
            <ListItemText primary="Proyectos" />
          </ListItemButton>

          <ListItemButton component={RouterLink} to="/tasks">
            <ListItemText primary="Tareas" />
          </ListItemButton>

          <ListItemButton component={RouterLink} to="/stats">
            <ListItemText primary="Estadísticas" />
          </ListItemButton>
        </List>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="error"
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
