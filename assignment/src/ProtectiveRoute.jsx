import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectiveRoute = () => {
  const token = localStorage.getItem("token"); // Assuming the token is stored as "email"

  // If the token does not exist, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, allow access to the route (Outlet will render the child components)
  return <Outlet />;
};

export default ProtectiveRoute;
