import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FaBuilding,
  FaCalendarCheck,
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaDownload,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import { getAllPropertiesForAdmin } from "../../services/propertyApi";
import { getAllBookings } from "../../services/bookingApi";
import { getAllPayments } from "../../services/paymentApi";
import { getAllUsers } from "../../services/adminApi";
import "../../assets/css/adminReports.css";

const formatCurrency = (amount) =>
  `₹${amount.toLocaleString("en-IN")}`;

const AdminReports = () => {
  const [period, setPeriod] = useState("6_MONTHS");
  const [adminReportData, setAdminReportData] = useState({ summary: { totalRevenue: 0, totalBookings: 0, activeProperties: 0, registeredUsers: 0 }, monthlyRevenue: [{ month: "Current", amount: 0 }], monthlyBookings: [{ month: "Current", count: 0 }], propertyStatus: [], paymentStatus: [], cityPerformance: [], userDistribution: { landlords: 0, tenants: 0 }, recentActivity: [] });

  useEffect(() => {
    Promise.allSettled([getAllPropertiesForAdmin(), getAllBookings(), getAllPayments(), getAllUsers()]).then((results) => {
      const [properties, bookings, payments, users] = results.map((result) => result.status === "fulfilled" && Array.isArray(result.value) ? result.value : []);
      const revenue = payments.filter((p) => ["PAID", "SUCCESS"].includes(p.status)).reduce((sum, p) => sum + Number(p.totalAmount || p.amount || 0), 0);
      const countBy = (rows, value) => rows.filter((row) => row.status === value || row.approvalStatus === value).length;
      const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))];
      setAdminReportData({
        summary: { totalRevenue: revenue, totalBookings: bookings.length, activeProperties: properties.filter((p) => p.approvalStatus === "APPROVED").length, registeredUsers: users.length },
        monthlyRevenue: [{ month: "Current", amount: revenue }],
        monthlyBookings: [{ month: "Current", count: bookings.length }],
        propertyStatus: ["APPROVED", "PENDING", "REJECTED"].map((status) => ({ label: status[0] + status.slice(1).toLowerCase(), count: countBy(properties, status) })),
        paymentStatus: ["PAID", "PENDING", "FAILED", "REFUNDED"].map((status) => ({ label: status === "PAID" ? "Successful" : status[0] + status.slice(1).toLowerCase(), count: countBy(payments, status) })),
        cityPerformance: cities.map((city) => ({ city, properties: properties.filter((p) => p.city === city).length, bookings: bookings.filter((b) => b.propertyCity === city).length, revenue: payments.filter((p) => p.propertyCity === city).reduce((sum, p) => sum + Number(p.totalAmount || 0), 0) })),
        userDistribution: { landlords: users.filter((u) => String(u.role).toUpperCase() === "LANDLORD").length, tenants: users.filter((u) => String(u.role).toUpperCase() === "TENANT").length },
        recentActivity: bookings.slice(-4).reverse().map((b) => ({ id: b.id, type: "BOOKING", title: "Booking status", description: `${b.id} is ${b.status}`, date: b.updatedAt || b.createdAt })),
      });
    }).catch(console.error);
  }, []);

  const maxRevenue = useMemo(
    () =>
      Math.max(
        1, ...adminReportData.monthlyRevenue.map(
          (item) => item.amount
        )
      ),
    [adminReportData.monthlyRevenue]
  );

  const maxBookings = useMemo(
    () =>
      Math.max(
        1, ...adminReportData.monthlyBookings.map(
          (item) => item.count
        )
      ),
    [adminReportData.monthlyBookings]
  );

  const totalUsers =
    adminReportData.userDistribution.landlords +
    adminReportData.userDistribution.tenants;

  const landlordPercentage = totalUsers ? Math.round(
    (adminReportData.userDistribution.landlords /
      totalUsers) *
      100
  ) : 0;

  const tenantPercentage = 100 - landlordPercentage;

  const handleExport = () => {
    const report = {
      generatedOn: new Date().toISOString(),
      selectedPeriod: period,
      ...adminReportData,
    };

    const file = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      }
    );

    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "rentsphere-admin-report.json";
    link.click();

    URL.revokeObjectURL(fileUrl);
  };

  return (
    <div className="admin-reports-page">
      <motion.section
        className="admin-reports-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="admin-reports-eyebrow">
            Reports and analytics
          </span>

          <h1>Platform performance overview</h1>

          <p>
            Monitor revenue, bookings, properties, payments and user
            growth across RentSphere.
          </p>
        </div>

        <div className="admin-reports-header-actions">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="30_DAYS">Last 30 days</option>
            <option value="3_MONTHS">Last 3 months</option>
            <option value="6_MONTHS">Last 6 months</option>
            <option value="1_YEAR">Last 1 year</option>
          </select>

          <button type="button" onClick={handleExport}>
            <FaDownload />
            Export Report
          </button>
        </div>
      </motion.section>

      <section className="report-summary-grid">
        <article className="report-summary-card">
          <div className="report-summary-top">
            <span>Total Revenue</span>

            <div className="report-summary-icon revenue">
              <FaMoneyBillWave />
            </div>
          </div>

          <strong>
            {formatCurrency(
              adminReportData.summary.totalRevenue
            )}
          </strong>

          <small>Revenue recorded across the platform</small>
        </article>

        <article className="report-summary-card">
          <div className="report-summary-top">
            <span>Total Bookings</span>

            <div className="report-summary-icon bookings">
              <FaCalendarCheck />
            </div>
          </div>

          <strong>
            {adminReportData.summary.totalBookings}
          </strong>

          <small>Property and PG booking records</small>
        </article>

        <article className="report-summary-card">
          <div className="report-summary-top">
            <span>Active Properties</span>

            <div className="report-summary-icon properties">
              <FaBuilding />
            </div>
          </div>

          <strong>
            {adminReportData.summary.activeProperties}
          </strong>

          <small>Listings currently visible to tenants</small>
        </article>

        <article className="report-summary-card">
          <div className="report-summary-top">
            <span>Registered Users</span>

            <div className="report-summary-icon users">
              <FaUsers />
            </div>
          </div>

          <strong>
            {adminReportData.summary.registeredUsers}
          </strong>

          <small>Landlords and tenants combined</small>
        </article>
      </section>

      <section className="report-main-grid">
        <article className="report-panel report-revenue-panel">
          <div className="report-panel-heading">
            <div>
              <span>Financial performance</span>
              <h2>Monthly revenue</h2>
            </div>

            <strong>
              {formatCurrency(
                adminReportData.summary.totalRevenue
              )}
            </strong>
          </div>

          <div className="report-bar-chart">
            {adminReportData.monthlyRevenue.map((item) => (
              <div
                className="report-bar-column"
                key={item.month}
              >
                <span className="report-bar-value">
                  {formatCurrency(item.amount)}
                </span>

                <div className="report-bar-track">
                  <div
                    className="report-bar-fill"
                    style={{
                      height: `${
                        (item.amount / maxRevenue) * 100
                      }%`,
                    }}
                  />
                </div>

                <strong>{item.month}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <span>User distribution</span>
              <h2>Platform users</h2>
            </div>

            <FaUsers />
          </div>

          <div className="report-user-distribution">
            <div
              className="report-user-ring"
              style={{
                background: `conic-gradient(
                  #2563eb 0 ${landlordPercentage}%,
                  #38bdf8 ${landlordPercentage}% 100%
                )`,
              }}
            >
              <div>
                <strong>{totalUsers}</strong>
                <span>Total users</span>
              </div>
            </div>

            <div className="report-user-legend">
              <div>
                <span className="landlord-dot" />

                <div>
                  <strong>
                    {
                      adminReportData.userDistribution
                        .landlords
                    }
                  </strong>

                  <span>
                    Landlords ({landlordPercentage}%)
                  </span>
                </div>
              </div>

              <div>
                <span className="tenant-dot" />

                <div>
                  <strong>
                    {
                      adminReportData.userDistribution
                        .tenants
                    }
                  </strong>

                  <span>
                    Tenants ({tenantPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="report-secondary-grid">
        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <span>Booking activity</span>
              <h2>Monthly bookings</h2>
            </div>

            <FaChartBar />
          </div>

          <div className="report-booking-bars">
            {adminReportData.monthlyBookings.map((item) => (
              <div key={item.month}>
                <div className="report-booking-label">
                  <span>{item.month}</span>
                  <strong>{item.count}</strong>
                </div>

                <div className="report-booking-track">
                  <div
                    style={{
                      width: `${
                        (item.count / maxBookings) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <span>Listing moderation</span>
              <h2>Property status</h2>
            </div>

            <FaBuilding />
          </div>

          <div className="report-status-list">
            {adminReportData.propertyStatus.map((item) => (
              <div key={item.label}>
                <span
                  className={`report-status-icon ${item.label.toLowerCase()}`}
                >
                  {item.label === "Approved" && (
                    <FaCheckCircle />
                  )}

                  {item.label === "Pending" && <FaClock />}

                  {item.label === "Rejected" && (
                    <FaTimesCircle />
                  )}
                </span>

                <div>
                  <strong>{item.label}</strong>
                  <span>{item.count} properties</span>
                </div>

                <b>{item.count}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <span>Transaction health</span>
              <h2>Payment status</h2>
            </div>

            <FaCreditCard />
          </div>

          <div className="report-payment-list">
            {adminReportData.paymentStatus.map((item) => (
              <div key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.count} transactions</span>
                </div>

                <span
                  className={`report-payment-count ${item.label.toLowerCase()}`}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="report-bottom-grid">
        <article className="report-panel report-city-panel">
          <div className="report-panel-heading">
            <div>
              <span>Location performance</span>
              <h2>Top performing cities</h2>
            </div>

            <FaBuilding />
          </div>

          <div className="report-city-table-wrapper">
            <table className="report-city-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Properties</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {adminReportData.cityPerformance.map(
                  (city) => (
                    <tr key={city.city}>
                      <td>
                        <strong>{city.city}</strong>
                      </td>

                      <td>{city.properties}</td>
                      <td>{city.bookings}</td>

                      <td>
                        <strong>
                          {formatCurrency(city.revenue)}
                        </strong>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <span>Latest updates</span>
              <h2>Recent activity</h2>
            </div>

            <FaClock />
          </div>

          <div className="report-activity-list">
            {adminReportData.recentActivity.map(
              (activity) => (
                <div key={activity.id}>
                  <span
                    className={`report-activity-icon ${activity.type.toLowerCase()}`}
                  >
                    {activity.type === "PAYMENT" && (
                      <FaCreditCard />
                    )}

                    {activity.type === "BOOKING" && (
                      <FaCalendarCheck />
                    )}

                    {activity.type === "PROPERTY" && (
                      <FaBuilding />
                    )}

                    {activity.type === "USER" && <FaUser />}
                  </span>

                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.description}</p>
                    <small>{activity.date}</small>
                  </div>
                </div>
              )
            )}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminReports;
