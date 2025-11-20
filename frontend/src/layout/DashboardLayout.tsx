import { useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar onLogout={handleLogout} />

      <Box flexGrow={1} bgcolor="#f7f9fc">
        <Topbar />
        <Box p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
