import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaBell,
  FaBuilding,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaExchangeAlt,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlus,
  FaTimesCircle,
  FaTools,
  FaUser,
} from "react-icons/fa";

import propertyDetailsData from "../data/propertyDetailsData";

import {
  getTenantBookings,
} from "../utils/tenantBookings";

import {
  getMaintenanceRequests,
  MAINTENANCE_STATUS,
} from "../utils/maintenanceRequests";

import {
  getPropertyStatuses,
  PROPERTY_STATUS,
} from "../utils/propertyStatus";

import {
  getName,
} from "../utils/auth";

import "../assets/css/landlordDashboard.css";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString(
    "en-IN"
  )}`;

const formatStatus = (status) =>
  String(status || "UNKNOWN").replaceAll(
    "_",
    " "
  );

const getPropertyImage = (property) =>
  property.images?.[0] ||
  property.image ||
  "";

const getPropertyCategory = (property) =>
  property.category ||
  property.type ||
  "Property";

const getPropertyRent = (property) =>
  Number(
    property.rent ||
    property.monthlyRent ||
    0
  );

const createRevenueMonths = () => {
  const months = [];
  const currentDate = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index,
      1
    );

    months.push({
      key: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,

      label: date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      ),

      amount: 0,
    });
  }

  return months;
};

const parsePaymentDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  return Number.isNaN(
    parsedDate.getTime()
  )
    ? null
    : parsedDate;
};

const LandlordDashboard = () => {
  const [bookings, setBookings] =
    useState(() =>
      getTenantBookings()
    );

  const [
    maintenanceRequests,
    setMaintenanceRequests,
  ] = useState(() =>
    getMaintenanceRequests()
  );

  const [
    propertyStatuses,
    setPropertyStatuses,
  ] = useState(() =>
    getPropertyStatuses()
  );

  const landlordName =
    getName() || "RentSphere Landlord";

  useEffect(() => {
    const refreshDashboard = () => {
      setBookings(
        getTenantBookings()
      );

      setMaintenanceRequests(
        getMaintenanceRequests()
      );

      setPropertyStatuses(
        getPropertyStatuses()
      );
    };

    refreshDashboard();

    window.addEventListener(
      "focus",
      refreshDashboard
    );

    window.addEventListener(
      "storage",
      refreshDashboard
    );

    return () => {
      window.removeEventListener(
        "focus",
        refreshDashboard
      );

      window.removeEventListener(
        "storage",
        refreshDashboard
      );
    };
  }, []);

  const getGreeting = () => {
    const currentHour =
      new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    }

    if (currentHour < 17) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };

  const propertiesWithStatus =
    useMemo(
      () =>
        propertyDetailsData.map(
          (property) => ({
            ...property,

            status:
              propertyStatuses[
                String(property.id)
              ] ||
              PROPERTY_STATUS.AVAILABLE,
          })
        ),
      [propertyStatuses]
    );

  const paidBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.paymentStatus ===
          "PAID"
      ),
    [bookings]
  );

  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === "ACTIVE"
      ),
    [bookings]
  );

  const pendingBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === "PENDING"
      ),
    [bookings]
  );

  const approvedBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status ===
          "APPROVED"
      ),
    [bookings]
  );

  const totalRevenue = useMemo(
    () =>
      paidBookings.reduce(
        (total, booking) =>
          total +
          Number(
            booking.paymentAmount ||
              Number(
                booking.approvedMonthlyRent ||
                  0
              ) +
                Number(
                  booking.securityDeposit ||
                    0
                )
          ),
        0
      ),
    [paidBookings]
  );

  const monthlyRentRevenue = useMemo(
    () =>
      activeBookings.reduce(
        (total, booking) =>
          total +
          Number(
            booking.approvedMonthlyRent ||
              0
          ),
        0
      ),
    [activeBookings]
  );

  const revenueOverview = useMemo(() => {
    const months =
      createRevenueMonths();

    paidBookings.forEach(
      (booking) => {
        const paymentDate =
          parsePaymentDate(
            booking.paidOn
          );

        const date =
          paymentDate ||
          new Date();

        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        const month =
          months.find(
            (item) =>
              item.key === key
          );

        if (month) {
          month.amount += Number(
            booking.paymentAmount ||
              Number(
                booking.approvedMonthlyRent ||
                  0
              ) +
                Number(
                  booking.securityDeposit ||
                    0
                )
          );
        }
      }
    );

    return months;
  }, [paidBookings]);

  const maxRevenue = useMemo(
    () =>
      Math.max(
        ...revenueOverview.map(
          (item) => item.amount
        ),
        1
      ),
    [revenueOverview]
  );

  const maintenanceSummary =
    useMemo(
      () => ({
        pending:
          maintenanceRequests.filter(
            (request) =>
              request.status ===
              MAINTENANCE_STATUS.PENDING
          ).length,

        inProgress:
          maintenanceRequests.filter(
            (request) =>
              request.status ===
              MAINTENANCE_STATUS.IN_PROGRESS
          ).length,

        resolved:
          maintenanceRequests.filter(
            (request) =>
              request.status ===
              MAINTENANCE_STATUS.RESOLVED
          ).length,

        urgent:
          maintenanceRequests.filter(
            (request) =>
              request.priority ===
                "URGENT" &&
              [
                MAINTENANCE_STATUS.PENDING,
                MAINTENANCE_STATUS.IN_PROGRESS,
              ].includes(
                request.status
              )
          ).length,
      }),
      [maintenanceRequests]
    );

  const summary = useMemo(
    () => ({
      totalProperties:
        propertiesWithStatus.length,

      availableProperties:
        propertiesWithStatus.filter(
          (property) =>
            property.status ===
            PROPERTY_STATUS.AVAILABLE
        ).length,

      waitingPayment:
        propertiesWithStatus.filter(
          (property) =>
            property.status ===
            PROPERTY_STATUS.WAITING_PAYMENT
        ).length,

      occupiedProperties:
        propertiesWithStatus.filter(
          (property) =>
            [
              PROPERTY_STATUS.BOOKED,
              PROPERTY_STATUS.LEASE_ACTIVE,
            ].includes(
              property.status
            )
        ).length,

      pendingBookings:
        pendingBookings.length,

      activeBookings:
        activeBookings.length,
    }),
    [
      activeBookings,
      pendingBookings,
      propertiesWithStatus,
    ]
  );

  const recentProperties =
    useMemo(
      () =>
        propertiesWithStatus.slice(
          0,
          4
        ),
      [propertiesWithStatus]
    );

  const recentBookings =
    useMemo(
      () =>
        [...bookings]
          .reverse()
          .slice(0, 5),
      [bookings]
    );

  const notifications =
    useMemo(() => {
      const bookingNotifications =
        bookings.map(
          (booking) => ({
            id: `BOOKING-${booking.id}`,
            type: "BOOKING",

            title: `Booking ${formatStatus(
              booking.status
            ).toLowerCase()}`,

            message: `${
              booking.propertyTitle
            } — ${formatCurrency(
              booking.approvedMonthlyRent
            )} monthly rent.`,

            time:
              booking.updatedOn ||
              booking.createdOn ||
              "Recently",
          })
        );

      const paymentNotifications =
        paidBookings.map(
          (booking) => ({
            id: `PAYMENT-${booking.id}`,
            type: "PAYMENT",

            title:
              "Payment received",

            message: `${formatCurrency(
              booking.paymentAmount ||
                Number(
                  booking.approvedMonthlyRent ||
                    0
                ) +
                  Number(
                    booking.securityDeposit ||
                      0
                  )
            )} received for ${
              booking.propertyTitle
            }.`,

            time:
              booking.paidOn ||
              booking.updatedOn ||
              "Recently",
          })
        );

      const maintenanceNotifications =
        maintenanceRequests.map(
          (request) => ({
            id: `MAINTENANCE-${request.id}`,
            type: "MAINTENANCE",

            title: `Maintenance ${formatStatus(
              request.status
            ).toLowerCase()}`,

            message: `${
              request.title
            } — ${
              request.propertyTitle
            }.`,

            time:
              request.updatedOn ||
              request.createdOn ||
              "Recently",
          })
        );

      return [
        ...paymentNotifications,
        ...bookingNotifications,
      ].slice(0, 6);
    }, [
      bookings,
      maintenanceRequests,
      paidBookings,
    ]);

  const getNotificationIcon = (
    type
  ) => {
    switch (type) {
      case "PROPERTY":
        return <FaBuilding />;

      case "BOOKING":
        return (
          <FaCalendarCheck />
        );

      case "PAYMENT":
        return (
          <FaCreditCard />
        );

      case "MAINTENANCE":
        return <FaTools />;

      default:
        return <FaBell />;
    }
  };

  const getBookingIcon = (
    status
  ) => {
    if (
      [
        "APPROVED",
        "ACTIVE",
        "COMPLETED",
      ].includes(status)
    ) {
      return (
        <FaCheckCircle />
      );
    }

    if (
      [
        "REJECTED",
        "CANCELLED",
      ].includes(status)
    ) {
      return (
        <FaTimesCircle />
      );
    }

    return <FaClock />;
  };

  return (
    <div className="landlord-dashboard-page">
      <motion.section
        className="landlord-dashboard-hero"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div>
          <span className="landlord-dashboard-eyebrow">
            Landlord dashboard
          </span>

          <h1>
            {getGreeting()},{" "}
            {landlordName} 👋
          </h1>

          <p>
            Manage properties, booking
            requests, payments, active
            rentals and account activity
            from one place.
          </p>
        </div>

        <div className="landlord-dashboard-hero-actions">
          <Link
            to="/landlord/add-property"
            className="landlord-primary-action"
          >
            <FaPlus />
            Add Property
          </Link>

          <Link
            to="/landlord/properties"
            className="landlord-secondary-action"
          >
            View Properties
          </Link>
        </div>
      </motion.section>

      <section className="landlord-summary-grid">
        <motion.article
          className="landlord-summary-card"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="landlord-summary-top">
            <span>
              Total Properties
            </span>

            <div className="landlord-summary-icon total">
              <FaBuilding />
            </div>
          </div>

          <strong>
            {
              summary.totalProperties
            }
          </strong>

          <small>
            All rental listings
          </small>
        </motion.article>

        <motion.article
          className="landlord-summary-card"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
          }}
        >
          <div className="landlord-summary-top">
            <span>Available</span>

            <div className="landlord-summary-icon approved">
              <FaCheckCircle />
            </div>
          </div>

          <strong>
            {
              summary.availableProperties
            }
          </strong>

          <small>
            Open for new bookings
          </small>
        </motion.article>

        <motion.article
          className="landlord-summary-card"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
        >
          <div className="landlord-summary-top">
            <span>
              Waiting Payment
            </span>

            <div className="landlord-summary-icon pending">
              <FaClock />
            </div>
          </div>

          <strong>
            {
              summary.waitingPayment
            }
          </strong>

          <small>
            Approved tenant payments pending
          </small>
        </motion.article>

        <motion.article
          className="landlord-summary-card"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
        >
          <div className="landlord-summary-top">
            <span>Occupied</span>

            <div className="landlord-summary-icon occupied">
              <FaHome />
            </div>
          </div>

          <strong>
            {
              summary.occupiedProperties
            }
          </strong>

          <small>
            Booked or under active lease
          </small>
        </motion.article>

        <motion.article
          className="landlord-summary-card landlord-revenue-summary"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
        >
          <div className="landlord-summary-top">
            <span>
              Total Revenue
            </span>

            <div className="landlord-summary-icon revenue">
              <FaMoneyBillWave />
            </div>
          </div>

          <strong>
            {formatCurrency(
              totalRevenue
            )}
          </strong>

          <small>
            Verified payments received
          </small>
        </motion.article>
      </section>

      <section className="landlord-dashboard-live-summary">
        <article>
          <FaCalendarCheck />

          <div>
            <span>
              Pending bookings
            </span>

            <strong>
              {
                summary.pendingBookings
              }
            </strong>
          </div>
        </article>

        <article>
          <FaHome />

          <div>
            <span>
              Active rentals
            </span>

            <strong>
              {
                summary.activeBookings
              }
            </strong>
          </div>
        </article>

        <article>
          <FaMoneyBillWave />

          <div>
            <span>
              Monthly rent value
            </span>

            <strong>
              {formatCurrency(
                monthlyRentRevenue
              )}
            </strong>
          </div>
        </article>

      </section>

      <section className="landlord-dashboard-main-grid">
        <article className="landlord-dashboard-panel landlord-revenue-panel">
          <div className="landlord-panel-heading">
            <div>
              <span>
                Revenue performance
              </span>

              <h2>
                Payment overview
              </h2>
            </div>

            <Link to="/landlord/payments">
              View payments
              <FaArrowRight />
            </Link>
          </div>

          <div className="landlord-revenue-chart">
            {revenueOverview.map(
              (item) => (
                <div
                  key={item.key}
                  className="landlord-revenue-column"
                >
                  <span>
                    {formatCurrency(
                      item.amount
                    )}
                  </span>

                  <div className="landlord-revenue-track">
                    <div
                      className="landlord-revenue-fill"
                      style={{
                        height: `${
                          item.amount > 0
                            ? Math.max(
                                12,
                                (item.amount /
                                  maxRevenue) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <strong>
                    {item.label}
                  </strong>
                </div>
              )
            )}
          </div>
        </article>

        <article className="landlord-dashboard-panel">
          <div className="landlord-panel-heading">
            <div>
              <span>
                Quick navigation
              </span>

              <h2>
                Quick actions
              </h2>
            </div>

            <FaArrowRight />
          </div>

          <div className="landlord-quick-actions">
            <Link to="/landlord/add-property">
              <span className="landlord-quick-icon add">
                <FaPlus />
              </span>

              <div>
                <strong>
                  Add Property
                </strong>

                <small>
                  Create a new listing
                </small>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/landlord/bookings">
              <span className="landlord-quick-icon bookings">
                <FaCalendarCheck />
              </span>

              <div>
                <strong>
                  Booking Requests
                </strong>

                <small>
                  Review tenant requests
                </small>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/landlord/payments">
              <span className="landlord-quick-icon payments">
                <FaCreditCard />
              </span>

              <div>
                <strong>Payments</strong>

                <small>
                  View received payments
                </small>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/landlord/negotiations">
              <span className="landlord-quick-icon negotiations">
                <FaExchangeAlt />
              </span>

              <div>
                <strong>
                  Negotiations
                </strong>

                <small>
                  Review rent offers
                </small>
              </div>

              <FaArrowRight />
            </Link>
          </div>
        </article>
      </section>

      <section className="landlord-dashboard-bottom-grid">
        <article className="landlord-dashboard-panel">
          <div className="landlord-panel-heading">
            <div>
              <span>
                Property portfolio
              </span>

              <h2>
                Recent properties
              </h2>
            </div>

            <Link to="/landlord/properties">
              View all
              <FaArrowRight />
            </Link>
          </div>

          {recentProperties.length > 0 ? (
            <div className="landlord-recent-properties">
              {recentProperties.map(
                (property) => (
                  <article
                    key={property.id}
                    className="landlord-property-row"
                  >
                    <img
                      src={getPropertyImage(
                        property
                      )}
                      alt={property.title}
                    />

                    <div className="landlord-property-info">
                      <span>
                        {getPropertyCategory(
                          property
                        )}
                      </span>

                      <h3>
                        {property.title}
                      </h3>

                      <p>
                        <FaMapMarkerAlt />

                        {
                          property.locality
                        }
                        , {property.city}
                      </p>
                    </div>

                    <div className="landlord-property-price">
                      <strong>
                        {formatCurrency(
                          getPropertyRent(
                            property
                          )
                        )}
                      </strong>

                      <span>
                        /month
                      </span>
                    </div>

                    <span
                      className={`landlord-property-status ${property.status
                        .toLowerCase()
                        .replaceAll(
                          "_",
                          "-"
                        )}`}
                    >
                      {formatStatus(
                        property.status
                      )}
                    </span>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="landlord-dashboard-empty-state">
              <FaBuilding />

              <h3>
                No properties found
              </h3>

              <Link to="/landlord/add-property">
                Add Property
              </Link>
            </div>
          )}
        </article>

        <article className="landlord-dashboard-panel">
          <div className="landlord-panel-heading">
            <div>
              <span>
                Tenant requests
              </span>

              <h2>
                Recent booking requests
              </h2>
            </div>

            <Link to="/landlord/bookings">
              View all
              <FaArrowRight />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="landlord-booking-list">
              {recentBookings.map(
                (request) => (
                  <article
                    key={request.id}
                    className="landlord-booking-row"
                  >
                    <div className="landlord-booking-avatar">
                      <FaUser />
                    </div>

                    <div className="landlord-booking-info">
                      <span>
                        {request.id}
                      </span>

                      <h3>
                        RentSphere Tenant
                      </h3>

                      <p>
                        {
                          request.propertyTitle
                        }
                      </p>
                    </div>

                    <div className="landlord-booking-rent">
                      <span>
                        Approved rent
                      </span>

                      <strong>
                        {formatCurrency(
                          request.approvedMonthlyRent
                        )}
                      </strong>
                    </div>

                    <div className="landlord-booking-date">
                      <span>
                        Move-in
                      </span>

                      <strong>
                        {
                          request.moveInDate
                        }
                      </strong>
                    </div>

                    <span
                      className={`landlord-booking-status ${request.status.toLowerCase()}`}
                    >
                      {getBookingIcon(
                        request.status
                      )}

                      {formatStatus(
                        request.status
                      )}
                    </span>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="landlord-dashboard-empty-state">
              <FaCalendarCheck />

              <h3>
                No booking requests
              </h3>

              <p>
                Tenant booking requests
                will appear here.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="landlord-dashboard-panel landlord-notification-panel">
        <div className="landlord-panel-heading">
          <div>
            <span>
              Latest updates
            </span>

            <h2>
              Recent notifications
            </h2>
          </div>

          <FaBell />
        </div>

        {notifications.length > 0 ? (
          <div className="landlord-notification-grid">
            {notifications.map(
              (notification) => (
                <article
                  key={
                    notification.id
                  }
                  className="landlord-notification-item"
                >
                  <span
                    className={`landlord-notification-icon ${notification.type.toLowerCase()}`}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </span>

                  <div>
                    <strong>
                      {
                        notification.title
                      }
                    </strong>

                    <p>
                      {
                        notification.message
                      }
                    </p>

                    <small>
                      {
                        notification.time
                      }
                    </small>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="landlord-dashboard-empty-state">
            <FaBell />

            <h3>
              No recent notifications
            </h3>

            <p>
              Booking, payment and property
              updates will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandlordDashboard;
