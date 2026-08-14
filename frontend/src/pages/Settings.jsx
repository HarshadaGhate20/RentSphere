import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaBell, FaCog, FaLock, FaSave } from "react-icons/fa";
import { getRole } from "../utils/auth";
import "../assets/css/settings.css";

const keyForRole = (role) => `rentsphere_settings_${role.toLowerCase()}`;

const Settings = () => {
  const role = getRole() || "TENANT";
  const [settings, setSettings] = useState({ inAppNotifications: true, bookingUpdates: true, negotiationUpdates: true, paymentUpdates: true });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(keyForRole(role)) || "null");
      if (stored) setSettings((current) => ({ ...current, ...stored }));
    } catch (error) {
      console.warn("Unable to read settings:", error);
    }
  }, [role]);

  const toggle = (name) => setSettings((current) => ({ ...current, [name]: !current[name] }));
  const save = () => {
    localStorage.setItem(keyForRole(role), JSON.stringify(settings));
    toast.success("Settings saved successfully.");
  };

  const options = [
    ["inAppNotifications", "In-app notifications", "Show updates inside your RentSphere portal", FaBell],
    ["bookingUpdates", "Booking updates", "Notify me when a booking status changes", FaCog],
    ["negotiationUpdates", "Negotiation updates", "Notify me about rent offers and responses", FaCog],
    ["paymentUpdates", "Payment updates", "Notify me about payment and receipt status", FaLock],
  ];

  return (
    <div className="settings-page">
      <header><span>{role} PREFERENCES</span><h1>Settings</h1><p>Manage notifications and account preferences for your portal.</p></header>
      <section>
        <h2>Notification preferences</h2>
        {options.map(([name, title, description, Icon]) => (
          <label className="settings-row" key={name}>
            <span className="settings-icon"><Icon /></span>
            <span className="settings-copy"><strong>{title}</strong><small>{description}</small></span>
            <input type="checkbox" checked={settings[name]} onChange={() => toggle(name)} />
          </label>
        ))}
      </section>
      <section className="settings-security"><FaLock /><div><h2>Account security</h2><p>Use Forgot Password on the login page to securely change your password with OTP verification.</p></div></section>
      <button className="settings-save" type="button" onClick={save}><FaSave /> Save Settings</button>
    </div>
  );
};

export default Settings;
