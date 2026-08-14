import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaBuilding,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlus,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";

import { getAllPropertiesForAdmin } from "../services/propertyApi";
import { getAllBookings } from "../services/bookingApi";
import { getAllPayments } from "../services/paymentApi";
import { getAllUsers } from "../services/adminApi";

import "../assets/css/dashboard.css";

const iconMap = {
  properties: <FaBuilding />,
  pending: <FaClock />,
  landlords: <FaUserPlus />,
  tenants: <FaUsers />,
};

const quickActions = [
  {
    title: "Add Location",
    description: "Create a new service city or locality.",
    icon: <FaMapMarkerAlt />,
    path: "/admin/locations",
  },
  {
    title: "Review Properties",
    description: "Approve or reject landlord listings.",
    icon: <FaBuilding />,
    path: "/admin/properties",
  },
  {
    title: "Rent Bookings",
    description: "Review current rental booking requests.",
    icon: <FaCalendarCheck />,
    path: "/admin/rent-bookings",
  },
  {
    title: "Payments",
    description: "View tenant payment transactions.",
    icon: <FaCreditCard />,
    path: "/admin/payments",
  },
];

const AdminDashboard = () => {
  const [adminStats, setAdminStats] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    Promise.allSettled([getAllPropertiesForAdmin(), getAllBookings(), getAllPayments(), getAllUsers()]).then((results) => {
      const [properties, bookings, payments, users] = results.map((result) => result.status === "fulfilled" && Array.isArray(result.value) ? result.value : []);
      setAdminStats([
        { id: 1, title: "Total Properties", value: properties.length, change: "Live", changeText: "database records", type: "properties" },
        { id: 2, title: "Pending Reviews", value: properties.filter((p) => p.approvalStatus === "PENDING").length, change: "Live", changeText: "awaiting review", type: "pending" },
        { id: 3, title: "Total Landlords", value: users.filter((u) => String(u.role).toUpperCase() === "LANDLORD").length, change: "Live", changeText: "registered users", type: "landlords" },
        { id: 4, title: "Total Tenants", value: users.filter((u) => String(u.role).toUpperCase() === "TENANT").length, change: "Live", changeText: "registered users", type: "tenants" },
      ]);
      setRecentProperties(properties.slice(-3).reverse().map((p) => ({ id: p.id, name: p.title, location: [p.area, p.city].filter(Boolean).join(", "), landlord: p.landlordName || "Landlord", rent: Number(p.monthlyRent || p.rentPerBed || p.dailyRent || 0), type: p.category, status: p.approvalStatus, image: p.image })));
      setRecentPayments(payments.slice(-3).reverse().map((p) => ({ id: p.id, tenant: p.tenantName || "Tenant", property: p.propertyTitle || "Property", amount: Number(p.totalAmount || 0), date: p.paymentDate || p.createdAt, status: p.status })));
      setRecentActivities(bookings.slice(-4).reverse().map((b) => ({ id: b.id, title: "Booking updated", description: `${b.id} for ${b.propertyTitle || "property"} is ${b.status}.`, time: b.updatedAt || b.createdAt, type: "booking" })));
    }).catch(console.error);
  }, []);
  const administratorName =
    localStorage.getItem("name") || "Administrator";

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="premium-dashboard">
      <motion.section
        className="dashboard-welcome"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="dashboard-welcome-content">
          <span className="dashboard-label">Admin overview</span>

          <h1>
            Welcome back, <span>{administratorName}</span>
          </h1>

          <p>
            Monitor listings, users, bookings and payments from one
            centralized workspace.
          </p>

          <div className="dashboard-date">
            <FaCalendarCheck />
            {currentDate}
          </div>
        </div>

        <div className="dashboard-welcome-summary">
          <span>Pending today</span>
          <strong>{adminStats.find((item) => item.type === "pending")?.value || 0} Properties</strong>

          <Link to="/admin/properties">
            Review submissions
            <FaArrowRight />
          </Link>
        </div>
      </motion.section>

      <section className="dashboard-stat-grid">
        {adminStats.map((stat, index) => (
          <motion.article
            key={stat.id}
            className={`premium-stat-card stat-${stat.type}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -5 }}
          >
            <div className="premium-stat-top">
              <span className="premium-stat-icon">
                {iconMap[stat.type]}
              </span>

              <span className="premium-stat-change">
                {stat.change}
              </span>
            </div>

            <div className="premium-stat-content">
              <span>{stat.title}</span>
              <strong>{stat.value}</strong>
              <small>{stat.changeText}</small>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="dashboard-main-grid">
        <motion.article
          className="dashboard-section-card dashboard-properties-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-label">Property moderation</span>
              <h2>Recent property submissions</h2>
            </div>

            <Link to="/admin/properties" className="dashboard-text-link">
              View all
              <FaArrowRight />
            </Link>
          </div>

          <div className="dashboard-property-list">
            {recentProperties.map((property) => (
              <div className="dashboard-property-row" key={property.id}>
                <img
                  src={property.image}
                  alt={property.name}
                  className="dashboard-property-image"
                />

                <div className="dashboard-property-info">
                  <strong>{property.name}</strong>

                  <span>
                    <FaMapMarkerAlt />
                    {property.location}
                  </span>
                </div>

                <div className="dashboard-property-owner">
                  <span>Landlord</span>
                  <strong>{property.landlord}</strong>
                </div>

                <div className="dashboard-property-rent">
                  <strong>
                    ₹{property.rent.toLocaleString("en-IN")}
                  </strong>
                  <span>/month</span>
                </div>

                <span
                  className={`dashboard-status status-${property.status.toLowerCase()}`}
                >
                  {property.status}
                </span>

                <Link
                  className="dashboard-view-action"
                  to="/admin/properties"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          className="dashboard-section-card dashboard-activity-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-label">Live updates</span>
              <h2>Recent activity</h2>
            </div>
          </div>

          <div className="dashboard-activity-list">
            {recentActivities.map((activity) => (
              <div className="dashboard-activity-item" key={activity.id}>
                <span
                  className={`activity-dot activity-${activity.type}`}
                />

                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                  <small>{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="dashboard-secondary-grid">
        <motion.article
          className="dashboard-section-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-label">Transactions</span>
              <h2>Recent payments</h2>
            </div>

            <Link to="/admin/payments" className="dashboard-text-link">
              View all
              <FaArrowRight />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="premium-dashboard-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.id}</strong>
                      <span>{payment.date}</span>
                    </td>

                    <td>{payment.tenant}</td>
                    <td>{payment.property}</td>

                    <td>
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`dashboard-status payment-${payment.status.toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.article>

        <motion.article
          className="dashboard-section-card dashboard-revenue-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-label">Revenue</span>
              <h2>Monthly collection</h2>
            </div>

            <span className="revenue-icon">
              <FaMoneyBillWave />
            </span>
          </div>

          <div className="dashboard-revenue-value">
            <strong>₹15,80,000</strong>
            <span>+16.4% compared with July</span>
          </div>

          <div className="dashboard-revenue-chart">
            {[44, 62, 51, 72, 58, 81, 68, 91, 76, 88, 70, 96].map(
              (height, index) => (
                <div className="revenue-bar-wrapper" key={index}>
                  <div
                    className="revenue-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            )}
          </div>

          <div className="dashboard-revenue-footer">
            <span>Aug 1</span>
            <span>Aug 31</span>
          </div>
        </motion.article>
      </section>

      <section className="dashboard-quick-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-label">Shortcuts</span>
            <h2>Quick actions</h2>
          </div>
        </div>

        <div className="dashboard-quick-grid">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + index * 0.05 }}
            >
              <Link className="dashboard-quick-card" to={action.path}>
                <span className="dashboard-quick-icon">
                  {action.icon}
                </span>

                <div>
                  <strong>{action.title}</strong>
                  <p>{action.description}</p>
                </div>

                <FaArrowRight className="dashboard-quick-arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
