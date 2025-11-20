import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Topbar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "white", color: "black", borderBottom: "1px solid #ddd" }}
    >
      <Toolbar>
        <Typography variant="h6" flexGrow={1}>
          Panel de Control
        </Typography>

        <Box>
          <Typography variant="body2" color="gray">
            Bienvenido
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
