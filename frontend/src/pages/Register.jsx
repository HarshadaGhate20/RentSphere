import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  FaArrowLeft,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import {
  register,
} from "../services/authService";

import "../assets/css/auth.css";

const Register = () => {
  const navigate =
    useNavigate();

  const [
    user,
    setUser,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Tenant",
  });

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const changeHandler = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setUser(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  const validatePassword = (
    password
  ) => {
    if (
      password.length < 8
    ) {
      return "Password must contain at least 8 characters.";
    }

    if (
      !/[A-Z]/.test(
        password
      )
    ) {
      return "Password must contain at least one uppercase letter.";
    }

    if (
      !/[a-z]/.test(
        password
      )
    ) {
      return "Password must contain at least one lowercase letter.";
    }

    if (
      !/[0-9]/.test(
        password
      )
    ) {
      return "Password must contain at least one number.";
    }

    if (
      !/[!@#$%^&*]/.test(
        password
      )
    ) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const submitHandler =
    async (event) => {
      event.preventDefault();

      const passwordError =
        validatePassword(
          user.password
        );

      if (passwordError) {
        toast.error(
          passwordError
        );
        return;
      }

      if (
        user.password !==
        confirmPassword
      ) {
        toast.error(
          "Password and Confirm Password do not match."
        );
        return;
      }

      if (
        !/^[0-9]{10}$/.test(
          user.phone
        )
      ) {
        toast.error(
          "Phone number must contain exactly 10 digits."
        );
        return;
      }

      try {
        setSubmitting(true);

        console.log(
          "Registration payload:",
          {
            ...user,
            password:
              "********",
          }
        );

        await register(
          user
        );

        toast.success(
          "Registration successful. Please login."
        );

        navigate(
          "/login"
        );
      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        toast.error(
          error.response?.data
            ?.message ||
            error.message ||
            "Registration failed."
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link to="/" className="auth-back-link"><FaArrowLeft /> Back to Home</Link>

        <h2 className="text-center">
          Create Account
        </h2>

        <form
          onSubmit={
            submitHandler
          }
        >

          {/* FULL NAME */}

          <div className="input-group mb-3">

            <span className="input-group-text">
              <FaUser />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="name"
              value={
                user.name
              }
              onChange={
                changeHandler
              }
              required
            />

          </div>

          {/* EMAIL */}

          <div className="input-group mb-3">

            <span className="input-group-text">
              <FaEnvelope />
            </span>

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={
                user.email
              }
              onChange={
                changeHandler
              }
              required
            />

          </div>

          {/* PHONE */}

          <div className="input-group mb-3">

            <span className="input-group-text">
              <FaPhone />
            </span>

            <input
              type="tel"
              className="form-control"
              placeholder="Phone Number"
              name="phone"
              value={
                user.phone
              }
              onChange={
                changeHandler
              }
              maxLength="10"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="input-group mb-2">

            <span className="input-group-text">
              <FaLock />
            </span>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              className="form-control"
              name="password"
              placeholder="Password"
              value={
                user.password
              }
              onChange={
                changeHandler
              }
              required
            />

            <button
              type="button"
              className="input-group-text"
              onClick={() =>
                setShowPassword(
                  (
                    current
                  ) =>
                    !current
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          <div className="mb-3">
            <small className="text-muted">
              Minimum 8 characters,
              including uppercase,
              lowercase, number and
              special character.
            </small>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="input-group mb-3">

            <span className="input-group-text">
              <FaLock />
            </span>

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              className="form-control"
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(
                event
              ) =>
                setConfirmPassword(
                  event.target
                    .value
                )
              }
              required
            />

            <button
              type="button"
              className="input-group-text"
              onClick={() =>
                setShowConfirmPassword(
                  (
                    current
                  ) =>
                    !current
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          {/* PASSWORD MATCH MESSAGE */}

          {confirmPassword && (
            <div className="mb-3">

              {user.password ===
              confirmPassword ? (
                <small className="text-success">
                  ✓ Passwords match
                </small>
              ) : (
                <small className="text-danger">
                  Passwords do not match
                </small>
              )}

            </div>
          )}

          {/* ROLE */}

          <select
            className="form-select mb-3"
            name="role"
            value={
              user.role
            }
            onChange={
              changeHandler
            }
            required
          >
            <option value="Tenant">
              Tenant
            </option>

            <option value="Landlord">
              Landlord
            </option>
          </select>

          {/* REGISTER */}

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={
              submitting
            }
          >
            {submitting
              ? "Registering..."
              : "Register"}
          </button>

        </form>

        <p className="text-center mt-3">
          Already have an
          account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;
