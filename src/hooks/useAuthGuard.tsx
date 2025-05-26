import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AUTH_TOKEN_KEY = "authToken";

const useAuthGuard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      navigate(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    const issued = Number(token);
    // expiration: 1 hour
    if (Date.now() - issued > 3600000) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      navigate(`/login?expired=true`);
    }
  }, [navigate, pathname]);
};

export default useAuthGuard;
