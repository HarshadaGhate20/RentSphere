import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaEnvelope,
  FaHome,
  FaLock,
} from "react-icons/fa";

import {
  getDashboardPath,
  isAuthenticated,
  saveAuthData,
} from "../utils/auth";

import "../assets/css/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(getDashboardPath(), {
        replace: true,
      });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const apiResponse = await axios.post(
        "http://localhost:5279/api/auth/login",
        {
          email: user.email.trim(),
          password: user.password,
        }
      );

      const responseData = apiResponse.data;

      saveAuthData(responseData);

      const role = String(
        responseData.role || ""
      ).toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin", {
          replace: true,
        });
      } else if (role === "LANDLORD") {
        navigate("/landlord", {
          replace: true,
        });
      } else if (role === "TENANT") {
        navigate("/tenant", {
          replace: true,
        });
      } else {
        setErrorMessage(
          "Your account has an unknown role."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Login failed. Check your email and password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center">
          <Link to="/" className="auth-back-link"><FaHome /> Back to Home</Link>
          <FaHome className="auth-logo" />

          <h2>Welcome Back</h2>

          <p>
            Login to your RentSphere account
          </p>
        </div>

        {errorMessage && (
          <div className="auth-error-message">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaEnvelope />
            </span>

            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaLock />
            </span>

            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <div className="text-center mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
