import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRole,
}) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("_token");

  const role = String(
    localStorage.getItem("role") || ""
  ).toUpperCase();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRole ||
    role ===
      String(allowedRole).toUpperCase()
  ) {
    return children;
  }

  if (role === "TENANT") {
    return (
      <Navigate
        to="/tenant"
        replace
      />
    );
  }

  if (role === "LANDLORD") {
    return (
      <Navigate
        to="/landlord"
        replace
      />
    );
  }

  if (role === "ADMIN") {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
};

export default ProtectedRoute;