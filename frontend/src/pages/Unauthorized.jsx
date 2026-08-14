import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const role = String(
      localStorage.getItem("role") || ""
    ).toUpperCase();

    if (role === "TENANT") {
      navigate("/tenant", {
        replace: true,
      });
      return;
    }

    if (role === "LANDLORD") {
      navigate("/landlord", {
        replace: true,
      });
      return;
    }

    if (role === "ADMIN") {
      navigate("/admin", {
        replace: true,
      });
      return;
    }

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="container text-center py-5">
      <h1 className="text-danger fw-bold">
        403
      </h1>

      <h2>
        Access Denied
      </h2>

      <p className="text-muted">
        You do not have permission to open this page.
      </p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGoBack}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;