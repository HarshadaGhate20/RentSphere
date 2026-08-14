import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import NotificationCenter from "../components/NotificationCenter";
import "../assets/css/dashboard.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <NotificationCenter />

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
