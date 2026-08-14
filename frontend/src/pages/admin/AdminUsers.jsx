import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaBuilding,
  FaCalendarCheck,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaFlag,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaTimes,
  FaUser,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

import { getAllUsers } from "../../services/adminApi";
import { getAllPropertiesForAdmin } from "../../services/propertyApi";
import { getAllBookings } from "../../services/bookingApi";
import { getAllPayments } from "../../services/paymentApi";
import { getAllNegotiations } from "../../services/negotiationApi";
import "../../assets/css/adminUsers.css";

const roleTabs = [
  { value: "ALL", label: "All Users" },
  { value: "LANDLORD", label: "Landlords" },
  { value: "TENANT", label: "Tenants" },
  { value: "FLAGGED", label: "Flagged" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeRole, setActiveRole] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      getAllUsers(),
      getAllPropertiesForAdmin(),
      getAllBookings(),
      getAllPayments(),
      getAllNegotiations(),
    ]).then((results) => {
      const [rows, properties, bookings, payments, negotiations] = results.map((result) => result.status === "fulfilled" && Array.isArray(result.value) ? result.value : []);
      const belongsTo = (record, user, prefix) => {
        const candidates = [
          record?.[`${prefix}Id`],
          record?.[`${prefix}Email`],
          record?.[`${prefix}Name`],
        ].filter((value) => value !== undefined && value !== null).map((value) => String(value).trim().toLowerCase());
        return [user.id, user.email, user.name, user.fullName]
          .filter(Boolean)
          .map((value) => String(value).trim().toLowerCase())
          .some((value) => candidates.includes(value));
      };

      setUsers((Array.isArray(rows) ? rows : []).map((u) => {
        const role = String(u.role || "TENANT").toUpperCase();
        const userProperties = (properties || []).filter((item) => belongsTo(item, u, "landlord"));
        const userBookings = (bookings || []).filter((item) => belongsTo(item, u, role === "LANDLORD" ? "landlord" : "tenant"));
        const userPayments = (payments || []).filter((item) => belongsTo(item, u, role === "LANDLORD" ? "landlord" : "tenant"));
        const userNegotiations = (negotiations || []).filter((item) => belongsTo(item, u, role === "LANDLORD" ? "landlord" : "tenant"));
        return {
          ...u,
          id: u.id,
          role,
          status: "ACTIVE",
          flagged: false,
          name: u.name || u.fullName || "User",
          phone: u.phone || "",
          city: "",
          address: "",
          registeredOn: u.createdAt,
          lastLogin: "Not recorded",
          verificationStatus: "REGISTERED",
          propertiesCount: userProperties.length,
          approvedProperties: userProperties.filter((item) => item.approvalStatus === "APPROVED").length,
          pendingProperties: userProperties.filter((item) => item.approvalStatus === "PENDING").length,
          bookingsCount: userBookings.length,
          activeBookings: userBookings.filter((item) => ["PAID", "ACTIVE", "LEASE_ACTIVE"].includes(item.status)).length,
          inquiriesCount: userNegotiations.length,
          totalEarnings: role === "LANDLORD" ? userPayments.filter((item) => ["PAID", "SUCCESS"].includes(item.status)).reduce((sum, item) => sum + Number(item.totalAmount || item.amount || 0), 0) : 0,
          totalPaid: role === "TENANT" ? userPayments.filter((item) => ["PAID", "SUCCESS"].includes(item.status)).reduce((sum, item) => sum + Number(item.totalAmount || item.amount || 0), 0) : 0,
        };
      }));
    });
  }, []);

  const selectedUser = useMemo(
    () =>
      users.find((user) => user.id === selectedUserId) || null,
    [selectedUserId, users]
  );

  const summary = useMemo(
    () => ({
      total: users.length,
      landlords: users.filter((user) => user.role === "LANDLORD")
        .length,
      tenants: users.filter((user) => user.role === "TENANT").length,
      suspended: users.filter((user) => user.status === "SUSPENDED")
        .length,
      flagged: users.filter((user) => user.flagged).length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        activeRole === "ALL" ||
        (activeRole === "FLAGGED"
          ? user.flagged
          : user.role === activeRole);

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      const searchableText = [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.city,
        user.address,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [activeRole, search, statusFilter, users]);

  const updateUserStatus = (userId, nextStatus) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: nextStatus,
            }
          : user
      )
    );

    toast.success(`User status changed to ${nextStatus}.`);
  };

  const toggleUserFlag = (userId) => {
    let nextFlagValue = false;

    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        nextFlagValue = !user.flagged;

        return {
          ...user,
          flagged: nextFlagValue,
        };
      })
    );

    toast.success(
      nextFlagValue
        ? "User flagged for administrator review."
        : "User flag removed."
    );
  };

  const resetFilters = () => {
    setActiveRole("ALL");
    setStatusFilter("ALL");
    setSearch("");
  };

  return (
    <div className="admin-users-page">
      <motion.section
        className="admin-users-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="admin-users-eyebrow">
            User management
          </span>

          <h1>Manage landlords and tenants</h1>

          <p>
            Monitor registered users, verification status, activity,
            bookings and policy violations.
          </p>
        </div>

        <div className="admin-users-header-icon">
          <FaUsers />
        </div>
      </motion.section>

      <section className="user-summary-grid">
        <article className="user-summary-card">
          <div className="user-summary-top">
            <span>Total Users</span>

            <div className="user-summary-icon total">
              <FaUsers />
            </div>
          </div>

          <strong>{summary.total}</strong>
          <small>All registered accounts</small>
        </article>

        <article className="user-summary-card">
          <div className="user-summary-top">
            <span>Landlords</span>

            <div className="user-summary-icon landlords">
              <FaBuilding />
            </div>
          </div>

          <strong>{summary.landlords}</strong>
          <small>Registered property owners</small>
        </article>

        <article className="user-summary-card">
          <div className="user-summary-top">
            <span>Tenants</span>

            <div className="user-summary-icon tenants">
              <FaUserCheck />
            </div>
          </div>

          <strong>{summary.tenants}</strong>
          <small>Registered property seekers</small>
        </article>

        <article className="user-summary-card">
          <div className="user-summary-top">
            <span>Suspended</span>

            <div className="user-summary-icon suspended">
              <FaUserSlash />
            </div>
          </div>

          <strong>{summary.suspended}</strong>
          <small>Accounts with restricted access</small>
        </article>
      </section>

      <section className="admin-users-content">
        <div className="admin-users-toolbar">
          <div className="admin-user-tabs">
            {roleTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={activeRole === tab.value ? "active" : ""}
                onClick={() => setActiveRole(tab.value)}
              >
                {tab.label}

                {tab.value === "FLAGGED" && summary.flagged > 0 && (
                  <span>{summary.flagged}</span>
                )}
              </button>
            ))}
          </div>

          <div className="admin-user-toolbar-controls">
            <div className="admin-user-search">
              <FaSearch />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone or city"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter users by status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <button
              type="button"
              className="admin-user-reset"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="admin-users-result-heading">
          <div>
            <span>User directory</span>

            <h2>
              {activeRole === "ALL"
                ? "All users"
                : activeRole === "FLAGGED"
                  ? "Flagged users"
                  : `${activeRole.toLowerCase()} accounts`}
            </h2>
          </div>

          <p>
            {filteredUsers.length} result
            {filteredUsers.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="admin-user-grid">
          {filteredUsers.map((user, index) => (
            <motion.article
              key={user.id}
              className={`admin-user-card ${
                user.flagged ? "flagged" : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="admin-user-card-top">
                <div className="admin-user-avatar">
                  <FaUser />
                </div>

                <div>
                  <div className="admin-user-reference">
                    <span>{user.id}</span>

                    {user.flagged && (
                      <span className="admin-user-flagged-label">
                        <FaFlag />
                        Flagged
                      </span>
                    )}
                  </div>

                  <h3>{user.name}</h3>

                  <span className={`admin-user-role ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>

                <span
                  className={`admin-user-status ${user.status.toLowerCase()}`}
                >
                  {user.status}
                </span>
              </div>

              <div className="admin-user-contact">
                <p>
                  <FaEnvelope />
                  {user.email}
                </p>

                <p>
                  <FaPhoneAlt />
                  {user.phone}
                </p>

                <p>
                  <FaMapMarkerAlt />
                  {user.city}
                </p>
              </div>

              <div className="admin-user-stat-grid">
                {user.role === "LANDLORD" ? (
                  <>
                    <div>
                      <span>Properties</span>
                      <strong>{user.propertiesCount}</strong>
                    </div>

                    <div>
                      <span>Bookings</span>
                      <strong>{user.bookingsCount}</strong>
                    </div>

                    <div>
                      <span>Earnings</span>
                      <strong>
                        ₹{Number(user.totalEarnings || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span>Bookings</span>
                      <strong>{user.bookingsCount}</strong>
                    </div>

                    <div>
                      <span>Inquiries</span>
                      <strong>{user.inquiriesCount}</strong>
                    </div>

                    <div>
                      <span>Total Paid</span>
                      <strong>
                        ₹{Number(user.totalPaid || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </>
                )}
              </div>

              <div className="admin-user-card-footer">
                <div>
                  <span>Registered</span>
                  <strong>{user.registeredOn}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <FaEye />
                  View Details
                </button>
              </div>
            </motion.article>
          ))}

          {filteredUsers.length === 0 && (
            <div className="admin-users-empty">
              <FaUsers />

              <h3>No users found</h3>

              <p>
                Try changing the search text or selected filters.
              </p>

              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedUser && (
        <div
          className="admin-user-modal-backdrop"
          onMouseDown={() => setSelectedUserId(null)}
        >
          <div
            className="admin-user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="admin-user-modal-close"
              onClick={() => setSelectedUserId(null)}
              aria-label="Close user details"
            >
              <FaTimes />
            </button>

            <div className="admin-user-modal-header">
              <div className="admin-user-modal-avatar">
                <FaUser />
              </div>

              <div>
                <div className="admin-user-reference">
                  <span>{selectedUser.id}</span>

                  {selectedUser.flagged && (
                    <span className="admin-user-flagged-label">
                      <FaFlag />
                      Flagged
                    </span>
                  )}
                </div>

                <h2 id="admin-user-modal-title">
                  {selectedUser.name}
                </h2>

                <p>
                  {selectedUser.role} account registered on{" "}
                  {selectedUser.registeredOn}
                </p>
              </div>

              <span
                className={`admin-user-status ${selectedUser.status.toLowerCase()}`}
              >
                {selectedUser.status}
              </span>
            </div>

            <div className="admin-user-modal-body">
              <section className="admin-user-detail-grid">
                <div>
                  <FaEnvelope />
                  <span>Email address</span>
                  <strong>{selectedUser.email}</strong>
                </div>

                <div>
                  <FaPhoneAlt />
                  <span>Phone number</span>
                  <strong>{selectedUser.phone}</strong>
                </div>

                <div>
                  <FaMapMarkerAlt />
                  <span>Address</span>
                  <strong>{selectedUser.address}</strong>
                </div>

                <div>
                  <FaUserCheck />
                  <span>Verification</span>
                  <strong>
                    {selectedUser.verificationStatus.replaceAll(
                      "_",
                      " "
                    )}
                  </strong>
                </div>

                <div>
                  <FaUserClock />
                  <span>Last login</span>
                  <strong>{selectedUser.lastLogin}</strong>
                </div>
              </section>

              {selectedUser.role === "LANDLORD" ? (
                <section className="admin-user-activity-section">
                  <h3>Landlord activity</h3>

                  <div className="admin-user-activity-grid">
                    <div>
                      <FaBuilding />
                      <span>Total properties</span>
                      <strong>{selectedUser.propertiesCount}</strong>
                    </div>

                    <div>
                      <FaCheckCircle />
                      <span>Approved properties</span>
                      <strong>{selectedUser.approvedProperties}</strong>
                    </div>

                    <div>
                      <FaUserClock />
                      <span>Pending properties</span>
                      <strong>{selectedUser.pendingProperties}</strong>
                    </div>

                    <div>
                      <FaCalendarCheck />
                      <span>Total bookings</span>
                      <strong>{selectedUser.bookingsCount}</strong>
                    </div>

                    <div>
                      <FaWallet />
                      <span>Total earnings</span>
                      <strong>
                        ₹
                        {Number(selectedUser.totalEarnings || 0).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="admin-user-activity-section">
                  <h3>Tenant activity</h3>

                  <div className="admin-user-activity-grid">
                    <div>
                      <FaCalendarCheck />
                      <span>Total bookings</span>
                      <strong>{selectedUser.bookingsCount}</strong>
                    </div>

                    <div>
                      <FaCheckCircle />
                      <span>Active bookings</span>
                      <strong>{selectedUser.activeBookings}</strong>
                    </div>

                    <div>
                      <FaUserClock />
                      <span>Rent inquiries</span>
                      <strong>{selectedUser.inquiriesCount}</strong>
                    </div>

                    <div>
                      <FaWallet />
                      <span>Total paid</span>
                      <strong>
                        ₹
                        {Number(selectedUser.totalPaid || 0).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>
                </section>
              )}

              {selectedUser.suspensionReason && (
                <section className="admin-user-suspension-note">
                  <FaUserSlash />

                  <div>
                    <strong>Suspension reason</strong>
                    <p>{selectedUser.suspensionReason}</p>
                  </div>
                </section>
              )}

              <div className="admin-user-modal-actions">
                {selectedUser.status === "ACTIVE" && (
                  <button
                    type="button"
                    className="admin-user-deactivate"
                    onClick={() =>
                      updateUserStatus(selectedUser.id, "INACTIVE")
                    }
                  >
                    Deactivate User
                  </button>
                )}

                {selectedUser.status === "INACTIVE" && (
                  <button
                    type="button"
                    className="admin-user-activate"
                    onClick={() =>
                      updateUserStatus(selectedUser.id, "ACTIVE")
                    }
                  >
                    Activate User
                  </button>
                )}

                {selectedUser.status !== "SUSPENDED" && (
                  <button
                    type="button"
                    className="admin-user-suspend"
                    onClick={() =>
                      updateUserStatus(selectedUser.id, "SUSPENDED")
                    }
                  >
                    Suspend User
                  </button>
                )}

                {selectedUser.status === "SUSPENDED" && (
                  <button
                    type="button"
                    className="admin-user-activate"
                    onClick={() =>
                      updateUserStatus(selectedUser.id, "ACTIVE")
                    }
                  >
                    Restore Access
                  </button>
                )}

                <button
                  type="button"
                  className={
                    selectedUser.flagged
                      ? "admin-user-remove-flag"
                      : "admin-user-add-flag"
                  }
                  onClick={() => toggleUserFlag(selectedUser.id)}
                >
                  <FaFlag />

                  {selectedUser.flagged
                    ? "Remove Flag"
                    : "Flag User"}
                </button>

                <button
                  type="button"
                  className="admin-user-close-details"
                  onClick={() => setSelectedUserId(null)}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
