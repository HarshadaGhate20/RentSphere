import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

import {
  clearAuthData,
  getDashboardPath,
  getName,
  getRole,
  isAuthenticated,
} from "../utils/auth";

import "../assets/css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    loggedIn: isAuthenticated(),
    role: getRole(),
    name: getName(),
  });

  const refreshAuthState = () => {
    setAuthState({
      loggedIn: isAuthenticated(),
      role: getRole(),
      name: getName(),
    });
  };

  useEffect(() => {
    refreshAuthState();

    window.addEventListener(
      "rentsphere-auth-change",
      refreshAuthState
    );

    window.addEventListener(
      "storage",
      refreshAuthState
    );

    return () => {
      window.removeEventListener(
        "rentsphere-auth-change",
        refreshAuthState
      );

      window.removeEventListener(
        "storage",
        refreshAuthState
      );
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setAuthState({
      loggedIn: false,
      role: null,
      name: null,
    });

    navigate("/login", {
      replace: true,
    });
  };

  const dashboardPath = getDashboardPath();

  return (
    <header className="public-navbar">
      <div className="public-navbar-container">
        <Link
          to="/"
          className="public-navbar-brand"
        >
          <FaHome />
          <span>RentSphere</span>
        </Link>

        <nav className="public-navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            About
          </NavLink>

          <NavLink
            to="/properties"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Explore
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="public-navbar-actions">
          {authState.loggedIn ? (
            <>
              <Link
                to={dashboardPath}
                className="public-dashboard-button"
              >
                <FaTachometerAlt />

                <span>
                  {authState.role === "TENANT"
                    ? "Tenant Dashboard"
                    : authState.role === "LANDLORD"
                    ? "Landlord Dashboard"
                    : "Admin Dashboard"}
                </span>
              </Link>

              <button
                type="button"
                className="public-logout-button"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="public-login-button"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="public-register-button"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;