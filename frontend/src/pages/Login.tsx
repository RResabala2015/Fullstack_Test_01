// Lib Externas:
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
 Button,
 TextField,
 Typography,
 Box,
 Card,
 CardContent,
 Link
 } from "@mui/material";
// Lib Internas:
import { loginSchema } from "../validation/login.schema";
import type { LoginFormData } from "../validation/login.schema";
import { loginRequest } from "../api/authService";
import { loginSuccess } from "../store/slices/userSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginRequest(data);
      dispatch(
        loginSuccess({
          token: res.token,
        })
      );
      navigate("/projects");
    } catch (error: any) {
      alert(error.response?.data?.message || "Credenciales incorrectas");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
    >
      <Card sx={{ width: 380, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Iniciar Sesión
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>

            <TextField
              fullWidth
              label="Correo"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>

            <Typography textAlign="center" mt={2}>
              ¿No tienes cuenta?{" "}
              <Link component={RouterLink} to="/register">
                Registrate
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
