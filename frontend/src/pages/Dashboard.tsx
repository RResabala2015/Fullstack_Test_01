import { /*useSelector,*/ useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
//import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  ////const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <h1>Bienvenido {"Usuario"}</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
