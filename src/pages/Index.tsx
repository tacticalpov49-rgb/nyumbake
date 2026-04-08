import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to discover page (Index is now just a redirect)
    if (location.pathname === "/") {
      // Already on discover route handled by App.tsx
    }
  }, []);

  return null;
};

export default Index;
