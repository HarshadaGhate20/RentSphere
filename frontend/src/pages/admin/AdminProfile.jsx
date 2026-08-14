import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaAddressCard,
  FaCheckCircle,
  FaCity,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHistory,
  FaKey,
  FaLaptop,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSave,
  FaShieldAlt,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserShield,
} from "react-icons/fa";

import adminProfileData from "../../data/adminProfileData";
import { getAllUsers } from "../../services/adminApi";
import "../../assets/css/adminProfile.css";

const AdminProfile = () => {
  const [profile, setProfile] = useState(adminProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    address: profile.address,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    getAllUsers().then((users) => {
      const admin = (Array.isArray(users) ? users : []).find((user) => user.email === email) || {};
      const live = { ...profile, id: admin.id || profile.id, name: admin.name || localStorage.getItem("name") || profile.name, email: admin.email || email || profile.email, phone: admin.phone || "", registeredOn: admin.createdAt || profile.registeredOn };
      setProfile(live);
      setProfileForm((form) => ({ ...form, name: live.name, email: live.email, phone: live.phone }));
    }).catch(console.error);
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const saveProfile = (event) => {
    event.preventDefault();

    if (
      !profileForm.name.trim() ||
      !profileForm.email.trim() ||
      !profileForm.phone.trim()
    ) {
      toast.error("Name, email and phone are required.");
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      ...profileForm,
    }));

    setIsEditing(false);
    toast.success("Admin profile updated successfully.");
  };

  const cancelEditing = () => {
    setProfileForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      address: profile.address,
    });

    setIsEditing(false);
  };

  const updatePassword = (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must contain at least 8 characters.");
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    toast.success("Password updated successfully.");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleTwoFactor = () => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      security: {
        ...currentProfile.security,
        twoFactorEnabled:
          !currentProfile.security.twoFactorEnabled,
      },
    }));

    toast.success(
      profile.security.twoFactorEnabled
        ? "Two-factor authentication disabled."
        : "Two-factor authentication enabled."
    );
  };

  const removeSession = (sessionId) => {
    const session = profile.loginActivity.find(
      (item) => item.id === sessionId
    );

    if (session?.current) {
      toast.error("You cannot remove the current session.");
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      loginActivity: currentProfile.loginActivity.filter(
        (item) => item.id !== sessionId
      ),
      security: {
        ...currentProfile.security,
        activeSessions: Math.max(
          1,
          currentProfile.security.activeSessions - 1
        ),
      },
    }));

    toast.success("Session removed successfully.");
  };

  return (
    <div className="admin-profile-page">
      <motion.section
        className="admin-profile-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="admin-profile-eyebrow">
            Administrator account
          </span>

          <h1>Profile and security</h1>

          <p>
            Manage administrator information, account security and
            active login sessions.
          </p>
        </div>

        <div className="admin-profile-header-icon">
          <FaUserShield />
        </div>
      </motion.section>

      <section className="admin-profile-layout">
        <aside className="admin-profile-summary">
          <div className="admin-profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <FaUser />
            )}
          </div>

          <h2>{profile.name}</h2>

          <span className="admin-profile-role">
            <FaUserShield />
            Administrator
          </span>

          <span
            className={`admin-profile-account-status ${profile.accountStatus.toLowerCase()}`}
          >
            <FaCheckCircle />
            {profile.accountStatus}
          </span>

          <div className="admin-profile-summary-details">
            <div>
              <FaEnvelope />

              <span>
                Email
                <strong>{profile.email}</strong>
              </span>
            </div>

            <div>
              <FaPhoneAlt />

              <span>
                Phone
                <strong>{profile.phone}</strong>
              </span>
            </div>

            <div>
              <FaMapMarkerAlt />

              <span>
                Location
                <strong>{profile.city}</strong>
              </span>
            </div>

            <div>
              <FaHistory />

              <span>
                Last login
                <strong>{profile.lastLogin}</strong>
              </span>
            </div>
          </div>

          <div className="admin-profile-verification">
            <FaShieldAlt />

            <div>
              <strong>Verified account</strong>
              <span>
                Administrator identity has been verified.
              </span>
            </div>
          </div>
        </aside>

        <main className="admin-profile-main">
          <section className="admin-profile-panel">
            <div className="admin-profile-panel-heading">
              <div>
                <span>Personal information</span>
                <h2>Admin details</h2>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="admin-profile-edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form
              className="admin-profile-form"
              onSubmit={saveProfile}
            >
              <div className="admin-profile-form-grid">
                <label>
                  <span>
                    <FaUser />
                    Full name
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </label>

                <label>
                  <span>
                    <FaEnvelope />
                    Email address
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </label>

                <label>
                  <span>
                    <FaPhoneAlt />
                    Phone number
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </label>

                <label>
                  <span>
                    <FaCity />
                    City
                  </span>

                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </label>

                <label className="admin-profile-full-field">
                  <span>
                    <FaAddressCard />
                    Address
                  </span>

                  <textarea
                    name="address"
                    rows="3"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </label>
              </div>

              {isEditing && (
                <div className="admin-profile-form-actions">
                  <button
                    type="button"
                    className="admin-profile-cancel-button"
                    onClick={cancelEditing}
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-profile-save-button"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </section>

          <section className="admin-profile-panel">
            <div className="admin-profile-panel-heading">
              <div>
                <span>Account protection</span>
                <h2>Change password</h2>
              </div>

              <FaLock />
            </div>

            <form
              className="admin-password-form"
              onSubmit={updatePassword}
            >
              <label>
                <span>Current password</span>

                <div className="admin-password-field">
                  <FaKey />

                  <input
                    type={
                      showPasswords.current
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        current: !current.current,
                      }))
                    }
                    aria-label="Show or hide current password"
                  >
                    {showPasswords.current ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </label>

              <label>
                <span>New password</span>

                <div className="admin-password-field">
                  <FaLock />

                  <input
                    type={
                      showPasswords.new ? "text" : "password"
                    }
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        new: !current.new,
                      }))
                    }
                    aria-label="Show or hide new password"
                  >
                    {showPasswords.new ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </label>

              <label>
                <span>Confirm new password</span>

                <div className="admin-password-field">
                  <FaCheckCircle />

                  <input
                    type={
                      showPasswords.confirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((current) => ({
                        ...current,
                        confirm: !current.confirm,
                      }))
                    }
                    aria-label="Show or hide password confirmation"
                  >
                    {showPasswords.confirm ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="admin-password-submit"
              >
                <FaLock />
                Update Password
              </button>
            </form>
          </section>

          <section className="admin-profile-panel">
            <div className="admin-profile-panel-heading">
              <div>
                <span>Security controls</span>
                <h2>Account security</h2>
              </div>

              <FaShieldAlt />
            </div>

            <div className="admin-security-list">
              <div className="admin-security-item">
                <div className="admin-security-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <strong>
                    Two-factor authentication
                  </strong>

                  <span>
                    Add another verification step during login.
                  </span>
                </div>

                <button
                  type="button"
                  className={
                    profile.security.twoFactorEnabled
                      ? "enabled"
                      : ""
                  }
                  onClick={toggleTwoFactor}
                >
                  {profile.security.twoFactorEnabled
                    ? "Enabled"
                    : "Enable"}
                </button>
              </div>

              <div className="admin-security-item">
                <div className="admin-security-icon">
                  <FaKey />
                </div>

                <div>
                  <strong>Password last changed</strong>

                  <span>
                    {profile.security.passwordLastChanged}
                  </span>
                </div>
              </div>

              <div className="admin-security-item">
                <div className="admin-security-icon">
                  <FaLaptop />
                </div>

                <div>
                  <strong>Active sessions</strong>

                  <span>
                    {profile.loginActivity.length} logged-in
                    devices
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-profile-panel">
            <div className="admin-profile-panel-heading">
              <div>
                <span>Login history</span>
                <h2>Recent sessions</h2>
              </div>

              <FaHistory />
            </div>

            <div className="admin-session-list">
              {profile.loginActivity.map((session) => (
                <article
                  key={session.id}
                  className="admin-session-item"
                >
                  <div className="admin-session-device-icon">
                    <FaLaptop />
                  </div>

                  <div className="admin-session-information">
                    <div>
                      <strong>{session.device}</strong>

                      {session.current && (
                        <span>Current session</span>
                      )}
                    </div>

                    <p>
                      {session.location} • {session.ipAddress}
                    </p>

                    <small>{session.loginTime}</small>
                  </div>

                  {!session.current && (
                    <button
                      type="button"
                      onClick={() =>
                        removeSession(session.id)
                      }
                    >
                      <FaSignOutAlt />
                      Remove
                    </button>
                  )}
                </article>
              ))}
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default AdminProfile;
