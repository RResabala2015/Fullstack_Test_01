// Lib Externas:
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
} from "@mui/material";
// Lib Internas:
import { registerSchema } from "../validation/register.schema";
import type { RegisterFormData } from "../validation/register.schema";
import { registerRequest } from "../api/authService";
import { loginSuccess } from "../store/slices/userSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await registerRequest(data);
      dispatch(loginSuccess({ token: res.token }));
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar el usuario");
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
            Crear cuenta
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>

            <TextField
              fullWidth
              label="Nombre completo"
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              fullWidth
              label="Correo electrónico"
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
              {isSubmitting ? "Registrando..." : "Registrar"}
            </Button>

            <Typography textAlign="center" mt={2}>
              ¿Ya tienes cuenta?{" "}
              <Link component={RouterLink} to="/login">
                Inicia sesión
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
