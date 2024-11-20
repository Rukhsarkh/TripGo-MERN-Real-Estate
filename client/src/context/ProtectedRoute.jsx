import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route location

  const { isLoggedIn } = useAuth();
  useEffect(() => {
    if (!isLoggedIn) {
      // Save the attempted URL to localStorage before redirecting
      localStorage.setItem("returnTo", location.pathname);
      navigate("/login");
    }
  }, [isLoggedIn, navigate, location]);

  return isLoggedIn ? children : null;
};

export default ProtectedRoute;
