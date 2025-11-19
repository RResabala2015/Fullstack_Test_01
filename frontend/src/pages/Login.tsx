import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/login.schema";
import type { LoginFormData } from "../validation/login.schema";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/userSlice";
import { loginRequest } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography, Box } from "@mui/material";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      localStorage.setItem("token", res.token);
      //alert("Login correcto!");
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Credenciales incorrectas");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>
        Iniciar Sesión
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Correo"
          fullWidth
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Ingresar
        </Button>
      </Box>
    </Container>
  );
}
