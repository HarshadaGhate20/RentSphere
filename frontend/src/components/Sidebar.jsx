import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaBuilding,
  FaCalendarCheck,
  FaCity,
  FaClipboardList,
  FaCog,
  FaCreditCard,
  FaChartBar,
  FaExchangeAlt,
  FaFileContract,
  FaHeart,
  FaHome,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTools,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

import {
  clearAuthData,
  getRole,
} from "../utils/auth";

import "../assets/css/sidebar.css";

const menuItems = {
  ADMIN: [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      label: "Locations",
      path: "/admin/locations",
      icon: <FaMapMarkerAlt />,
    },
    {
      label: "Properties",
      path: "/admin/properties",
      icon: <FaBuilding />,
    },
    {
      label: "Rent Inquiries",
      path: "/admin/inquiries",
      icon: <FaClipboardList />,
    },
    {
      label: "Bookings",
      path: "/admin/bookings",
      icon: <FaCalendarCheck />,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: <FaCreditCard />,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: <FaChartBar />,
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: <FaUserCircle />,
    },
  ],

  LANDLORD: [
    {
      label: "Dashboard",
      path: "/landlord",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      label: "Add Property",
      path: "/landlord/add-property",
      icon: <FaHome />,
    },
    {
      label: "My Properties",
      path: "/landlord/properties",
      icon: <FaBuilding />,
    },
    {
      label: "Bookings",
      path: "/landlord/bookings",
      icon: <FaCalendarCheck />,
    },
    {
      label: "Payments",
      path: "/landlord/payments",
      icon: <FaCreditCard />,
    },
    
    {
      label: "Negotiations",
      path: "/landlord/negotiations",
      icon: <FaExchangeAlt />,
    },
    {
      label: "My Profile",
      path: "/landlord/profile",
      icon: <FaUserCircle />,
    },
  ],

  TENANT: [
    {
      label: "Dashboard",
      path: "/tenant",
      icon: <FaTachometerAlt />,
      end: true,
    },
    {
      label: "Explore Properties",
      path: "/properties",
      icon: <FaBuilding />,
    },
    {
      label: "Wishlist",
      path: "/tenant/wishlist",
      icon: <FaHeart />,
    },
    {
      label: "My Bookings",
      path: "/tenant/bookings",
      icon: <FaCalendarCheck />,
    },
    {
      label: "My Rental",
      path: "/tenant/lease",
      icon: <FaFileContract />,
    },
    {
      label: "Negotiations",
      path: "/tenant/negotiations",
      icon: <FaExchangeAlt />,
    },
    {
      label: "My Profile",
      path: "/tenant/profile",
      icon: <FaUserCircle />,
    },
  ],
};

const Sidebar = () => {
  const navigate = useNavigate();

  const role = getRole() || "ADMIN";
  const items = menuItems[role] || [];

  const handleLogout = () => {
    clearAuthData();

    toast.success("Logged out successfully");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FaHome />
        </div>

        <div>
          <h3>RentSphere</h3>

          <span>
            {role.toLowerCase()} portal
          </span>
        </div>
      </div>

      <nav
        className="sidebar-navigation"
        aria-label="Dashboard navigation"
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-link-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          className="sidebar-link"
          to="/"
        >
          <span className="sidebar-link-icon">
            <FaHome />
          </span>

          <span>Public Website</span>
        </NavLink>

        <NavLink
          className="sidebar-link"
          to={`/${role.toLowerCase()}/settings`}
        >
          <span className="sidebar-link-icon">
            <FaCog />
          </span>

          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
