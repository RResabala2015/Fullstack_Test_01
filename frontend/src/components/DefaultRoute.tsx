import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/index";

interface DefaultRouteProps {
  children: React.ReactNode;
}

export default function DefaultRoute({ children }: DefaultRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return children;
}
