import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaBuilding,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaEye,
  FaFileContract,
  FaFlag,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaTimes,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

import { getAllBookings } from "../../services/bookingApi";
import { resolvePropertyImage } from "../../config/api";
import { getAllPropertiesForAdmin } from "../../services/propertyApi";
import "../../assets/css/adminBookings.css";

const statusTabs = [
  { value: "ALL", label: "All Bookings" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "FLAGGED", label: "Flagged" },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [bookingType, setBookingType] = useState("ALL");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    Promise.allSettled([getAllBookings(), getAllPropertiesForAdmin()]).then(([bookingResult, propertyResult]) => {
      if (bookingResult.status === "rejected") {
        throw bookingResult.reason;
      }

      const rows = bookingResult.value;
      const propertyRows = propertyResult.status === "fulfilled" ? propertyResult.value : [];
      const propertiesById = new Map(
        (Array.isArray(propertyRows) ? propertyRows : []).map((property) => [String(property.id), property])
      );

      setBookings((Array.isArray(rows) ? rows : []).map((b) => {
        const liveProperty = propertiesById.get(String(b.propertyId));

        return ({
      ...b,
      bookingType: b.propertyCategory === "PG" ? "PG" : "PROPERTY",
      status: b.status === "PAID" || b.status === "ACTIVE" || b.status === "LEASE_ACTIVE" ? "CONFIRMED" : b.status,
      createdOn: b.createdAt,
      moveInDate: b.approvedMoveInDate || b.requestedMoveInDate,
      monthlyRent: Number(b.approvedMonthlyRent || b.requestedMonthlyRent || 0),
      flagged: false,
      property: { id: b.propertyId, title: b.propertyTitle || liveProperty?.title || "Property", type: b.propertyCategory || liveProperty?.category || "Property", city: b.propertyCity || liveProperty?.city || "", area: b.propertyArea || liveProperty?.area || "", image: liveProperty?.image || resolvePropertyImage(b.propertyImage || "") },
      tenant: { id: b.tenantId, name: b.tenantName || "Tenant", email: b.tenantEmail || "", phone: b.tenantPhone || "" },
      landlord: { id: b.landlordId, name: b.landlordName || "Landlord", email: b.landlordEmail || "", phone: "" },
      payment: { status: b.paymentStatus || (b.paymentId ? "PAID" : "PENDING"), transactionId: b.paymentId, amount: Number(b.totalPayable || 0), paidOn: b.paymentDate },
      lease: { status: b.status, startDate: b.leaseStartDate, endDate: b.leaseEndDate },
    });
      }));
    }).catch((error) => toast.error(error.message));
  }, []);

  const selectedBooking = useMemo(
    () =>
      bookings.find(
        (booking) => booking.id === selectedBookingId
      ) || null,
    [bookings, selectedBookingId]
  );

  const summary = useMemo(
    () => ({
      total: bookings.length,

      pending: bookings.filter(
        (booking) => booking.status === "PENDING"
      ).length,

      confirmed: bookings.filter(
        (booking) => booking.status === "CONFIRMED"
      ).length,

      completed: bookings.filter(
        (booking) => booking.status === "COMPLETED"
      ).length,

      cancelled: bookings.filter(
        (booking) => booking.status === "CANCELLED"
      ).length,

      flagged: bookings.filter((booking) => booking.flagged)
        .length,
    }),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesTab =
        activeTab === "ALL" ||
        (activeTab === "FLAGGED"
          ? booking.flagged
          : booking.status === activeTab);

      const matchesType =
        bookingType === "ALL" ||
        booking.bookingType === bookingType;

      const searchableText = [
        booking.id,
        booking.property.title,
        booking.property.city,
        booking.property.area,
        booking.tenant.name,
        booking.tenant.email,
        booking.landlord.name,
        booking.landlord.email,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesTab && matchesType && matchesSearch;
    });
  }, [activeTab, bookingType, bookings, search]);

  const toggleBookingFlag = (bookingId) => {
    let nextFlagValue = false;

    setBookings((currentBookings) =>
      currentBookings.map((booking) => {
        if (booking.id !== bookingId) {
          return booking;
        }

        nextFlagValue = !booking.flagged;

        return {
          ...booking,
          flagged: nextFlagValue,
        };
      })
    );

    toast.success(
      nextFlagValue
        ? "Booking flagged for review."
        : "Booking flag removed."
    );
  };

  const resetFilters = () => {
    setSearch("");
    setBookingType("ALL");
    setActiveTab("ALL");
  };

  return (
    <div className="admin-bookings-page">
      <motion.section
        className="admin-bookings-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="admin-bookings-eyebrow">
            Booking monitoring
          </span>

          <h1>Manage rental bookings</h1>

          <p>
            Monitor property and PG bookings, payment status,
            lease information, tenants and landlords.
          </p>
        </div>

        <div className="admin-bookings-header-icon">
          <FaCalendarCheck />
        </div>
      </motion.section>

      <section className="booking-summary-grid">
        <article className="booking-summary-card">
          <div className="booking-summary-top">
            <span>Total Bookings</span>

            <div className="booking-summary-icon total">
              <FaCalendarCheck />
            </div>
          </div>

          <strong>{summary.total}</strong>
          <small>All property and PG bookings</small>
        </article>

        <article className="booking-summary-card">
          <div className="booking-summary-top">
            <span>Pending</span>

            <div className="booking-summary-icon pending">
              <FaClock />
            </div>
          </div>

          <strong>{summary.pending}</strong>
          <small>Waiting for required actions</small>
        </article>

        <article className="booking-summary-card">
          <div className="booking-summary-top">
            <span>Confirmed</span>

            <div className="booking-summary-icon confirmed">
              <FaCheckCircle />
            </div>
          </div>

          <strong>{summary.confirmed}</strong>
          <small>Approved and currently valid</small>
        </article>

        <article className="booking-summary-card">
          <div className="booking-summary-top">
            <span>Cancelled</span>

            <div className="booking-summary-icon cancelled">
              <FaTimesCircle />
            </div>
          </div>

          <strong>{summary.cancelled}</strong>
          <small>Cancelled booking requests</small>
        </article>
      </section>

      <section className="booking-content-card">
        <div className="booking-toolbar">
          <div className="booking-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={
                  activeTab === tab.value ? "active" : ""
                }
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="booking-toolbar-controls">
            <div className="booking-search">
              <FaSearch />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search booking, tenant or property"
              />
            </div>

            <select
              value={bookingType}
              onChange={(event) =>
                setBookingType(event.target.value)
              }
              aria-label="Filter booking type"
            >
              <option value="ALL">All booking types</option>
              <option value="PROPERTY">
                Property booking
              </option>
              <option value="PG">PG booking</option>
            </select>

            <button
              type="button"
              className="booking-reset-button"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="booking-results-heading">
          <div>
            <span>Booking records</span>
            <h2>
              {activeTab === "ALL"
                ? "All bookings"
                : `${activeTab.toLowerCase()} bookings`}
            </h2>
          </div>

          <p>
            {filteredBookings.length} result
            {filteredBookings.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="booking-card-grid">
          {filteredBookings.map((booking, index) => (
            <motion.article
              key={booking.id}
              className={`booking-card ${
                booking.flagged ? "flagged" : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="booking-image-wrapper">
                <img
                  src={booking.property.image}
                  alt={booking.property.title}
                />

                <span
                  className={`booking-status ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>

                <span className="booking-type">
                  {booking.bookingType}
                </span>

                {booking.flagged && (
                  <span className="booking-flagged-label">
                    <FaFlag />
                    Flagged
                  </span>
                )}
              </div>

              <div className="booking-card-body">
                <span className="booking-reference">
                  {booking.id}
                </span>

                <h3>{booking.property.title}</h3>

                <p className="booking-location">
                  <FaMapMarkerAlt />
                  {booking.property.area},{" "}
                  {booking.property.city}
                </p>

                <div className="booking-rent">
                  ₹
                  {booking.monthlyRent.toLocaleString(
                    "en-IN"
                  )}
                  <span>/month</span>
                </div>

                <div className="booking-date-grid">
                  <div>
                    <span>Booked on</span>
                    <strong>{booking.createdOn}</strong>
                  </div>

                  <div>
                    <span>Move-in</span>
                    <strong>{booking.moveInDate}</strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>
                      {booking.durationMonths} {String(booking.propertyCategory || booking.pricingType || "").toUpperCase() === "VILLA" || String(booking.pricingType || "").toUpperCase() === "DAILY" ? "days" : "months"}
                    </strong>
                  </div>
                </div>

                <div className="booking-parties">
                  <div>
                    <span>Tenant</span>
                    <strong>{booking.tenant.name}</strong>
                  </div>

                  <div>
                    <span>Landlord</span>
                    <strong>{booking.landlord.name}</strong>
                  </div>
                </div>

                <div className="booking-card-footer">
                  <div>
                    <span
                      className={`booking-payment-status ${booking.payment.status.toLowerCase()}`}
                    >
                      Payment: {booking.payment.status}
                    </span>

                    <span
                      className={`booking-lease-status ${booking.lease.status.toLowerCase()}`}
                    >
                      Lease:{" "}
                      {booking.lease.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedBookingId(booking.id)
                    }
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>
            </motion.article>
          ))}

          {filteredBookings.length === 0 && (
            <div className="booking-empty-state">
              <FaCalendarCheck />

              <h3>No bookings found</h3>

              <p>
                Try changing the search value or selected
                filters.
              </p>

              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedBooking && (
        <div
          className="booking-modal-backdrop"
          onMouseDown={() => setSelectedBookingId(null)}
        >
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="booking-modal-close"
              onClick={() => setSelectedBookingId(null)}
              aria-label="Close booking details"
            >
              <FaTimes />
            </button>

            <div className="booking-modal-property">
              <img
                src={selectedBooking.property.image}
                alt={selectedBooking.property.title}
              />

              <div>
                <div className="booking-modal-reference">
                  <span>{selectedBooking.id}</span>

                  {selectedBooking.flagged && (
                    <span className="booking-flagged-label">
                      <FaFlag />
                      Flagged
                    </span>
                  )}
                </div>

                <h2 id="booking-modal-title">
                  {selectedBooking.property.title}
                </h2>

                <p>
                  <FaMapMarkerAlt />
                  {selectedBooking.property.area},{" "}
                  {selectedBooking.property.city}
                </p>
              </div>

              <span
                className={`booking-status ${selectedBooking.status.toLowerCase()}`}
              >
                {selectedBooking.status}
              </span>
            </div>

            <div className="booking-modal-body">
              <section className="booking-modal-grid">
                <div className="booking-person-card">
                  <div className="booking-person-icon tenant">
                    <FaUser />
                  </div>

                  <div>
                    <span>Tenant details</span>
                    <h3>{selectedBooking.tenant.name}</h3>

                    <p>
                      <FaEnvelope />
                      {selectedBooking.tenant.email}
                    </p>

                    <p>
                      <FaPhoneAlt />
                      {selectedBooking.tenant.phone}
                    </p>
                  </div>
                </div>

                <div className="booking-person-card">
                  <div className="booking-person-icon landlord">
                    <FaBuilding />
                  </div>

                  <div>
                    <span>Landlord details</span>
                    <h3>
                      {selectedBooking.landlord.name}
                    </h3>

                    <p>
                      <FaEnvelope />
                      {selectedBooking.landlord.email}
                    </p>

                    <p>
                      <FaPhoneAlt />
                      {selectedBooking.landlord.phone}
                    </p>
                  </div>
                </div>
              </section>

              <section className="booking-detail-section">
                <div className="booking-section-heading">
                  <FaCalendarCheck />
                  <h3>Booking information</h3>
                </div>

                <div className="booking-information-grid">
                  <div>
                    <span>Booking type</span>
                    <strong>
                      {selectedBooking.bookingType}
                    </strong>
                  </div>

                  <div>
                    <span>Created on</span>
                    <strong>
                      {selectedBooking.createdOn}
                    </strong>
                  </div>

                  <div>
                    <span>Move-in date</span>
                    <strong>
                      {selectedBooking.moveInDate}
                    </strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>
                      {selectedBooking.durationMonths} {String(selectedBooking.propertyCategory || selectedBooking.pricingType || "").toUpperCase() === "VILLA" || String(selectedBooking.pricingType || "").toUpperCase() === "DAILY" ? "days" : "months"}
                    </strong>
                  </div>

                  <div>
                    <span>Monthly rent</span>
                    <strong>
                      ₹
                      {selectedBooking.monthlyRent.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Security deposit</span>
                    <strong>
                      ₹
                      {selectedBooking.securityDeposit.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="booking-detail-section">
                <div className="booking-section-heading">
                  <FaCreditCard />
                  <h3>Payment information</h3>
                </div>

                <div className="booking-information-grid">
                  <div>
                    <span>Payment status</span>
                    <strong>
                      {selectedBooking.payment.status}
                    </strong>
                  </div>

                  <div>
                    <span>Paid amount</span>
                    <strong>
                      ₹
                      {selectedBooking.payment.amount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Transaction ID</span>
                    <strong>
                      {selectedBooking.payment.transactionId ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment date</span>
                    <strong>
                      {selectedBooking.payment.paidOn ||
                        "Not paid"}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="booking-detail-section">
                <div className="booking-section-heading">
                  <FaFileContract />
                  <h3>Lease information</h3>
                </div>

                <div className="booking-information-grid">
                  <div>
                    <span>Lease status</span>
                    <strong>
                      {selectedBooking.lease.status.replaceAll(
                        "_",
                        " "
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Lease start</span>
                    <strong>
                      {selectedBooking.lease.startDate ||
                        "Not created"}
                    </strong>
                  </div>

                  <div>
                    <span>Lease end</span>
                    <strong>
                      {selectedBooking.lease.endDate ||
                        "Not created"}
                    </strong>
                  </div>
                </div>
              </section>

              {selectedBooking.cancellationReason && (
                <section className="booking-cancellation-box">
                  <FaTimesCircle />

                  <div>
                    <strong>Cancellation reason</strong>
                    <p>
                      {selectedBooking.cancellationReason}
                    </p>
                  </div>
                </section>
              )}

              <div className="booking-modal-actions">
                <button
                  type="button"
                  className={
                    selectedBooking.flagged
                      ? "booking-remove-flag"
                      : "booking-add-flag"
                  }
                  onClick={() =>
                    toggleBookingFlag(selectedBooking.id)
                  }
                >
                  <FaFlag />

                  {selectedBooking.flagged
                    ? "Remove Flag"
                    : "Flag Booking"}
                </button>

                <button
                  type="button"
                  className="booking-close-details"
                  onClick={() => setSelectedBookingId(null)}
                >
                  <FaTimes />
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

export default AdminBookings;
