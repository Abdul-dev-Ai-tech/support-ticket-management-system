import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/authApi";

const TOKEN_KEY = "ticketflow_token";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem(TOKEN_KEY);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [isError]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="auth-check-screen">
        <div className="auth-check-loader"></div>
        <p>Checking your session...</p>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;