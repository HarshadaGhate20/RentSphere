import React, { useState } from "react";
import { FaArrowLeft, FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordOtp, resetPassword, verifyPasswordOtp } from "../services/authService";
import "../assets/css/auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const change = ({ target: { name, value } }) => { setForm(current => ({ ...current, [name]: value })); setError(""); };
  const submit = async event => {
    event.preventDefault(); setSubmitting(true); setError(""); setMessage("");
    try {
      if (step === 1) { const result = await requestPasswordOtp(form.email.trim()); setMessage(result.developmentOtp ? `${result.message} Development OTP: ${result.developmentOtp}` : result.message); setStep(2); }
      else if (step === 2) { await verifyPasswordOtp(form.email.trim(), form.otp.trim()); setMessage("OTP verified. Choose a new password."); setStep(3); }
      else { if (form.password.length < 8) throw new Error("Password must contain at least 8 characters."); if (form.password !== form.confirmPassword) throw new Error("Passwords do not match."); await resetPassword(form.email.trim(), form.otp.trim(), form.password); navigate("/login", { replace: true }); }
    } catch (submitError) { setError(submitError.response?.data?.message || submitError.message || "Request failed."); }
    finally { setSubmitting(false); }
  };
  return <div className="auth-page"><div className="auth-card"><Link to="/" className="auth-back-link"><FaArrowLeft /> Back to Home</Link><h2>Forgot Password</h2><p>{step === 1 ? "Enter your registered email." : step === 2 ? "Enter the 6-digit OTP sent to your email." : "Create your new password."}</p>{message && <div className="alert alert-success">{message}</div>}{error && <div className="alert alert-danger">{error}</div>}<form onSubmit={submit}>{step === 1 && <div className="input-group mb-3"><span className="input-group-text"><FaEnvelope /></span><input required type="email" name="email" className="form-control" placeholder="Email Address" value={form.email} onChange={change} /></div>}{step === 2 && <div className="input-group mb-3"><span className="input-group-text"><FaKey /></span><input required inputMode="numeric" pattern="[0-9]{6}" maxLength="6" name="otp" className="form-control" placeholder="6-digit OTP" value={form.otp} onChange={change} /></div>}{step === 3 && <><div className="input-group mb-3"><span className="input-group-text"><FaLock /></span><input required minLength="8" type="password" name="password" className="form-control" placeholder="New Password" value={form.password} onChange={change} /></div><div className="input-group mb-3"><span className="input-group-text"><FaLock /></span><input required type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={form.confirmPassword} onChange={change} /></div></>}<button className="btn btn-primary w-100" disabled={submitting}>{submitting ? "Please wait..." : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}</button></form>{step > 1 && <button type="button" className="btn btn-link w-100 mt-2" onClick={() => { setStep(1); setMessage(""); }}>Use another email</button>}</div></div>;
};
export default ForgotPassword;
