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
  FaFileContract,
  FaHeart,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaTools,
  FaUserShield,
  FaWrench,
} from "react-icons/fa";

import {
  getTenantBookings as getTenantBookingsApi,
} from "../services/bookingApi";
import { getPropertyById } from "../services/propertyApi";
import { getTenantUser } from "../utils/sessionUser";

import {
  getMaintenanceRequests,
  MAINTENANCE_STATUS,
} from "../utils/maintenanceRequests";

import {
  getWishlist,
} from "../utils/wishlist";

import {
  getName,
} from "../utils/auth";

import "../assets/css/tenantDashboard.css";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString(
    "en-IN"
  )}`;

const formatStatus = (status) =>
  String(status || "UNKNOWN").replaceAll(
    "_",
    " "
  );

const parseLocalDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(
    `${dateValue}T00:00:00`
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const formatDate = (dateValue) => {
  const date =
    dateValue instanceof Date
      ? dateValue
      : parseLocalDate(dateValue);

  if (!date) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const calculateLeaseEndDate = (
  moveInDate,
  durationMonths
) => {
  const startDate =
    parseLocalDate(moveInDate);

  if (
    !startDate ||
    !durationMonths
  ) {
    return null;
  }

  const endDate =
    new Date(startDate);

  endDate.setMonth(
    endDate.getMonth() +
      Number(durationMonths)
  );

  endDate.setDate(
    endDate.getDate() - 1
  );

  return endDate;
};

const calculateNextRentDue = (
  moveInDate
) => {
  const startDate =
    parseLocalDate(moveInDate);

  if (!startDate) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dueDate =
    new Date(startDate);

  while (dueDate < today) {
    dueDate.setMonth(
      dueDate.getMonth() + 1
    );
  }

  return dueDate;
};

const calculateDaysRemaining = (
  dueDate
) => {
  if (!dueDate) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const difference =
    dueDate.getTime() -
    today.getTime();

  return Math.max(
    0,
    Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    )
  );
};

const TenantDashboard = () => {
  const [bookings, setBookings] = useState([]);

  const [
    maintenanceRequests,
    setMaintenanceRequests,
  ] = useState(() =>
    getMaintenanceRequests()
  );

  const [
    wishlist,
    setWishlist,
  ] = useState(() =>
    getWishlist()
  );

  const tenantName =
    getName() ||
    "RentSphere Tenant";

  useEffect(() => {
    const refreshDashboard = async () => {
      try {
        const tenant = getTenantUser();
        const rows = await getTenantBookingsApi(tenant.id);
        const normalized = await Promise.all((Array.isArray(rows) ? rows : []).map(async (booking) => {
          let property = null;
          try {
            property = await getPropertyById(booking.propertyId);
          } catch (propertyError) {
            console.warn("Unable to hydrate dashboard property:", propertyError);
          }
          return {
            ...booking,
            status: String(booking.status || "").trim().toUpperCase(),
            moveInDate: booking.leaseStartDate || booking.approvedMoveInDate || booking.requestedMoveInDate,
            paidOn: booking.paymentDate || booking.updatedAt,
            updatedOn: booking.updatedAt,
            paymentAmount: booking.totalPayable,
            paymentStatus: String(booking.paymentStatus || (booking.paymentId ? "PAID" : "")).trim().toUpperCase(),
            propertyImage: property?.image || property?.images?.[0] || booking.propertyImage,
            locality: property?.area || booking.propertyArea || booking.locality,
            city: property?.city || booking.propertyCity || booking.city,
          };
        }));
        setBookings(normalized);
      } catch (bookingError) {
        console.error("Unable to load live dashboard bookings:", bookingError);
        setBookings([]);
      }

      setMaintenanceRequests(
        getMaintenanceRequests()
      );

      setWishlist(
        getWishlist()
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

  const greeting = useMemo(() => {
    const hour =
      new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 17) {
      return "Good Afternoon";
    }

    return "Good Evening";
  }, []);

  const activeBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            ["PAID", "ACTIVE", "LEASE_ACTIVE", "RENTED", "BOOKED", "COMPLETED"].includes(String(booking.status || "").toUpperCase()) ||
            booking.paymentStatus === "PAID" ||
            Boolean(booking.paymentId) ||
            Boolean(booking.leaseStartDate)
        ),
      [bookings]
    );

  const currentRental =
    useMemo(
      () =>
        [...activeBookings].sort(
          (
            firstBooking,
            secondBooking
          ) =>
            String(
              secondBooking.paidOn ||
                secondBooking.updatedOn ||
                ""
            ).localeCompare(
              String(
                firstBooking.paidOn ||
                  firstBooking.updatedOn ||
                  ""
              )
            )
        )[0] || null,
      [activeBookings]
    );

  const pendingBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            [
              "PENDING",
              "APPROVED",
            ].includes(
              booking.status
            )
        ),
      [bookings]
    );

  const paidBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            booking.paymentStatus ===
            "PAID"
        ),
      [bookings]
    );

  const openMaintenance =
    useMemo(
      () =>
        maintenanceRequests.filter(
          (request) =>
            [
              MAINTENANCE_STATUS.PENDING,
              MAINTENANCE_STATUS.IN_PROGRESS,
            ].includes(
              request.status
            )
        ),
      [maintenanceRequests]
    );

  const latestMaintenance =
    useMemo(
      () =>
        maintenanceRequests.slice(
          0,
          4
        ),
      [maintenanceRequests]
    );

  const leaseEndDate =
    useMemo(
      () =>
        currentRental
          ? calculateLeaseEndDate(
              currentRental.moveInDate,
              currentRental.durationMonths
            )
          : null,
      [currentRental]
    );

  const nextRentDueDate =
    useMemo(
      () =>
        currentRental
          ? calculateNextRentDue(
              currentRental.moveInDate
            )
          : null,
      [currentRental]
    );

  const daysRemaining =
    calculateDaysRemaining(
      nextRentDueDate
    );

  const totalPaid =
    useMemo(
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

  const activities =
    useMemo(() => {
      const bookingActivities =
        bookings.map(
          (booking) => ({
            id: `BOOKING-${booking.id}`,

            type:
              booking.paymentStatus ===
              "PAID"
                ? "PAYMENT"
                : "BOOKING",

            title:
              booking.paymentStatus ===
              "PAID"
                ? "Payment completed"
                : `Booking ${formatStatus(
                    booking.status
                  ).toLowerCase()}`,

            description:
              booking.paymentStatus ===
              "PAID"
                ? `${formatCurrency(
                    booking.paymentAmount ||
                      Number(
                        booking.approvedMonthlyRent ||
                          0
                      ) +
                        Number(
                          booking.securityDeposit ||
                            0
                        )
                  )} paid for ${
                    booking.propertyTitle
                  }.`
                : `${
                    booking.propertyTitle
                  } booking is ${formatStatus(
                    booking.status
                  ).toLowerCase()}.`,

            date:
              booking.paidOn ||
              booking.updatedOn ||
              booking.createdOn ||
              "Recently",
          })
        );

      return [
        ...bookingActivities,
      ].slice(0, 5);
    }, [
      bookings,
    ]);

  const getActivityIcon = (
    type
  ) => {
    switch (type) {
      case "BOOKING":
        return (
          <FaCalendarCheck />
        );

      case "PAYMENT":
        return (
          <FaCreditCard />
        );

      case "WISHLIST":
        return <FaHeart />;

      default:
        return <FaBell />;
    }
  };

  const summary = {
    activeBookings:
      activeBookings.length,

    pendingBookings:
      pendingBookings.length,

    maintenanceRequests:
      openMaintenance.length,

    savedProperties:
      wishlist.length,
  };

  return (
    <div className="tenant-dashboard-page">
      <motion.section
        className="tenant-dashboard-hero"
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
          <span className="tenant-dashboard-eyebrow">
            Tenant dashboard
          </span>

          <h1>
            {greeting},{" "}
            {tenantName} 👋
          </h1>

          <p>
            Manage your rental booking,
            payments, lease, maintenance
            requests and saved properties
            from one place.
          </p>
        </div>

        <Link
          to="/properties"
          className="tenant-browse-properties-button"
        >
          <FaBuilding />
          Browse Properties
        </Link>
      </motion.section>

      <section className="tenant-summary-grid">
        <motion.article
          className="tenant-summary-card"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="tenant-summary-top">
            <span>
              Active Rentals
            </span>

            <div className="tenant-summary-icon booking">
              <FaHome />
            </div>
          </div>

          <strong>
            {
              summary.activeBookings
            }
          </strong>

          <small>
            Currently active properties
          </small>
        </motion.article>

        <motion.article
          className="tenant-summary-card"
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
          <div className="tenant-summary-top">
            <span>
              Monthly Rent
            </span>

            <div className="tenant-summary-icon rent">
              <FaMoneyBillWave />
            </div>
          </div>

          <strong>
            {formatCurrency(
              currentRental
                ?.approvedMonthlyRent ||
                0
            )}
          </strong>

          <small>
            {currentRental
              ? `Next due in ${
                  daysRemaining ?? 0
                } days`
              : "No active rental"}
          </small>
        </motion.article>

        <motion.article
          className="tenant-summary-card"
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
          <div className="tenant-summary-top">
            <span>
              Saved Properties
            </span>

            <div className="tenant-summary-icon wishlist">
              <FaHeart />
            </div>
          </div>

          <strong>
            {
              summary.savedProperties
            }
          </strong>

          <small>
            Properties in your wishlist
          </small>
        </motion.article>
      </section>

      <section className="tenant-dashboard-main-grid">
        <article className="tenant-dashboard-panel tenant-payment-reminder">
          <div className="tenant-panel-heading">
            <div>
              <span>
                Upcoming payment
              </span>

              <h2>
                Monthly rent reminder
              </h2>
            </div>

            <FaClock />
          </div>

          {currentRental ? (
            <>
              <div className="tenant-upcoming-payment-content">
                <div>
                  <span>
                    Property
                  </span>

                  <strong>
                    {
                      currentRental.propertyTitle
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Next due date
                  </span>

                  <strong>
                    {formatDate(
                      nextRentDueDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Monthly amount
                  </span>

                  <strong>
                    {formatCurrency(
                      currentRental.approvedMonthlyRent
                    )}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong className="tenant-payment-success-status">
                    ACTIVE
                  </strong>
                </div>
              </div>

              <div className="tenant-payment-reminder-footer">
                <p>
                  Future monthly rent
                  payments will be connected
                  to the backend payment
                  schedule.
                </p>

                <Link to="/tenant/lease">
                  <FaFileContract />
                  View Rental
                </Link>
              </div>
            </>
          ) : (
            <div className="tenant-dashboard-empty-block">
              <FaHome />

              <h3>
                No active rental
              </h3>

              <p>
                Complete a booking and
                payment to activate your
                rental.
              </p>

              <Link to="/properties">
                Explore Properties
              </Link>
            </div>
          )}
        </article>

        <article className="tenant-dashboard-panel">
          <div className="tenant-panel-heading">
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

          <div className="tenant-quick-actions">
            <Link to="/properties">
              <span className="tenant-quick-icon properties">
                <FaBuilding />
              </span>

              <div>
                <strong>
                  Browse Properties
                </strong>

                <small>
                  Find your next rental
                  home
                </small>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/tenant/lease">
              <span className="tenant-quick-icon bookings">
                <FaFileContract />
              </span>

              <div>
                <strong>
                  My Rental
                </strong>

                <small>
                  View active lease details
                </small>
              </div>

              <FaArrowRight />
            </Link>

            <Link to="/tenant/bookings">
              <span className="tenant-quick-icon wishlist">
                <FaCalendarCheck />
              </span>

              <div>
                <strong>
                  My Bookings
                </strong>

                <small>
                  Track booking requests
                </small>
              </div>

              <FaArrowRight />
            </Link>

          </div>
        </article>
      </section>

      <section className="tenant-dashboard-secondary-grid">
        <article className="tenant-dashboard-panel">
          <div className="tenant-panel-heading">
            <div>
              <span>
                Current residence
              </span>

              <h2>
                Your rental property
              </h2>
            </div>

            {currentRental && (
              <Link
                to={`/property/${currentRental.propertyId}`}
              >
                View property
                <FaArrowRight />
              </Link>
            )}
          </div>

          {currentRental ? (
            <div className="tenant-current-rental">
              <img
                src={
                  currentRental.propertyImage
                }
                alt={
                  currentRental.propertyTitle
                }
              />

              <div className="tenant-current-rental-details">
                <span>
                  {
                    currentRental.propertyCategory
                  }
                </span>

                <h3>
                  {
                    currentRental.propertyTitle
                  }
                </h3>

                <p>
                  <FaMapMarkerAlt />

                  {
                    currentRental.locality
                  }
                  ,{" "}
                  {currentRental.city}
                </p>

                <div className="tenant-current-rental-finance">
                  <div>
                    <span>
                      Monthly rent
                    </span>

                    <strong>
                      {formatCurrency(
                        currentRental.approvedMonthlyRent
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Security deposit
                    </span>

                    <strong>
                      {formatCurrency(
                        currentRental.securityDeposit
                      )}
                    </strong>
                  </div>
                </div>

                <div className="tenant-lease-grid">
                  <div>
                    <span>
                      Lease start
                    </span>

                    <strong>
                      {formatDate(
                        currentRental.moveInDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Lease end
                    </span>

                    <strong>
                      {formatDate(
                        leaseEndDate
                      )}
                    </strong>
                  </div>
                </div>

                <div className="tenant-landlord-row">
                  <div>
                    <FaUserShield />
                  </div>

                  <span>
                    Landlord

                    <strong>
                      {
                        currentRental.landlordName
                      }
                    </strong>
                  </span>

                  <small>
                    <FaCheckCircle />
                    Verified
                  </small>
                </div>

                <div className="tenant-dashboard-rental-actions">
                  <Link to="/tenant/lease">
                    <FaFileContract />
                    View Lease
                  </Link>

                  <Link
                    to={`/tenant/payment-receipt/${currentRental.id}`}
                  >
                    <FaReceipt />
                    View Receipt
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="tenant-dashboard-empty-block">
              <FaBuilding />

              <h3>
                No current residence
              </h3>

              <p>
                Your active rental will
                appear here after successful
                payment.
              </p>

              <Link to="/properties">
                Browse Properties
              </Link>
            </div>
          )}
        </article>

        <article className="tenant-dashboard-panel">
          <div className="tenant-panel-heading">
            <div>
              <span>
                Latest updates
              </span>

              <h2>
                Recent activity
              </h2>
            </div>

            <FaBell />
          </div>

          {activities.length > 0 ? (
            <div className="tenant-activity-list">
              {activities.map(
                (activity) => (
                  <article
                    key={
                      activity.id
                    }
                  >
                    <span
                      className={`tenant-activity-icon ${activity.type.toLowerCase()}`}
                    >
                      {getActivityIcon(
                        activity.type
                      )}
                    </span>

                    <div>
                      <strong>
                        {
                          activity.title
                        }
                      </strong>

                      <p>
                        {
                          activity.description
                        }
                      </p>

                      <small>
                        {activity.date}
                      </small>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="tenant-dashboard-empty-block compact">
              <FaBell />

              <h3>
                No recent activity
              </h3>

              <p>
                Booking updates will appear here.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="tenant-dashboard-bottom-grid">
        <article className="tenant-dashboard-panel">
          <div className="tenant-panel-heading">
            <div>
              <span>
                Payment history
              </span>

              <h2>
                Recent payments
              </h2>
            </div>

            {currentRental && (
              <Link
                to={`/tenant/payment-receipt/${currentRental.id}`}
              >
                Latest receipt
                <FaArrowRight />
              </Link>
            )}
          </div>

          {paidBookings.length > 0 ? (
            <div className="tenant-payment-table-wrapper">
              <table className="tenant-payment-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paidBookings
                    .slice(0, 5)
                    .map(
                      (payment) => (
                        <tr
                          key={
                            payment.id
                          }
                        >
                          <td>
                            <strong>
                              {
                                payment.propertyTitle
                              }
                            </strong>

                            <span>
                              {
                                payment.id
                              }
                            </span>
                          </td>

                          <td>
                            {formatCurrency(
                              payment.paymentAmount ||
                                Number(
                                  payment.approvedMonthlyRent ||
                                    0
                                ) +
                                  Number(
                                    payment.securityDeposit ||
                                      0
                                  )
                            )}
                          </td>

                          <td>
                            {payment.paidOn ||
                              "Not available"}
                          </td>

                          <td>
                            <Link
                              to={`/tenant/payment-receipt/${payment.id}`}
                              className="tenant-payment-success-status"
                            >
                              View Receipt
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>

              <div className="tenant-dashboard-payment-total">
                <span>
                  Total paid through
                  RentSphere
                </span>

                <strong>
                  {formatCurrency(
                    totalPaid
                  )}
                </strong>
              </div>
            </div>
          ) : (
            <div className="tenant-dashboard-empty-block compact">
              <FaCreditCard />

              <h3>
                No payment history
              </h3>

              <p>
                Successful rental payments
                will appear here.
              </p>
            </div>
          )}
        </article>
      </section>

      {currentRental ? (
        <section className="tenant-dashboard-notice">
          <FaBell />

          <div>
            <strong>
              Active rental reminder
            </strong>

            <p>
              Your next monthly rent is
              expected on{" "}
              {formatDate(
                nextRentDueDate
              )}
              . The recurring rent payment
              API will be connected during
              backend integration.
            </p>
          </div>

          <Link to="/tenant/lease">
            View Rental
            <FaArrowRight />
          </Link>
        </section>
      ) : pendingBookings.length >
        0 ? (
        <section className="tenant-dashboard-notice">
          <FaClock />

          <div>
            <strong>
              Booking request in progress
            </strong>

            <p>
              You have{" "}
              {
                pendingBookings.length
              }{" "}
              booking request
              {pendingBookings.length ===
              1
                ? ""
                : "s"}{" "}
              awaiting approval or
              payment.
            </p>
          </div>

          <Link to="/tenant/bookings">
            My Bookings
            <FaArrowRight />
          </Link>
        </section>
      ) : (
        <section className="tenant-dashboard-notice">
          <FaBuilding />

          <div>
            <strong>
              Find your next home
            </strong>

            <p>
              Browse available properties
              and submit a rental request.
            </p>
          </div>

          <Link to="/properties">
            Explore
            <FaArrowRight />
          </Link>
        </section>
      )}
    </div>
  );
};

export default TenantDashboard;
