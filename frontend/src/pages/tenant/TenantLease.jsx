import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaFileContract,
  FaHome,
  FaMapMarkerAlt,
  FaReceipt,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

import {
  getTenantBookings,
} from "../../services/bookingApi";

import { getTenantVisiblePropertyById } from "../../services/propertyApi";

import {
  getTenantUser,
} from "../../utils/sessionUser";

import "../../assets/css/tenantLease.css";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString(
    "en-IN"
  )}`;

const formatStatus = (status) =>
  String(status || "UNKNOWN").replaceAll(
    "_",
    " "
  );

const formatDisplayDate = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateValue;
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
  if (
    !moveInDate ||
    !durationMonths
  ) {
    return null;
  }

  const leaseEndDate =
    new Date(
      `${moveInDate}T00:00:00`
    );

  if (
    Number.isNaN(
      leaseEndDate.getTime()
    )
  ) {
    return null;
  }

  leaseEndDate.setMonth(
    leaseEndDate.getMonth() +
      Number(durationMonths)
  );

  leaseEndDate.setDate(
    leaseEndDate.getDate() - 1
  );

  return leaseEndDate;
};

const formatCalculatedDate = (
  date
) => {
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

const TenantLease = () => {
  const navigate =
    useNavigate();

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadBookings =
      async () => {
        try {
          setLoading(true);
          setError("");

          const tenant =
            getTenantUser();

          console.log(
            "TENANT FOR LEASE:",
            tenant
          );

          const data =
            await getTenantBookings(
              tenant.id
            );

          console.log(
            "LEASE BOOKINGS RESPONSE:",
            data
          );

          const bookingList = Array.isArray(data) ? data : [];
          const hydrated = await Promise.all(bookingList.map(async (booking) => {
            try {
              const property = await getTenantVisiblePropertyById(booking.propertyId);
              return {
                ...booking,
                propertyImage: property?.image || property?.images?.[0] || booking.propertyImage,
              };
            } catch (propertyError) {
              console.warn(`Unable to load image for property ${booking.propertyId}:`, propertyError);
              return booking;
            }
          }));

          setBookings(hydrated);
        } catch (loadError) {
          console.error(
            "Unable to load tenant lease:",
            loadError
          );

          setError(
            loadError.message ||
              "Unable to load rental."
          );
        } finally {
          setLoading(false);
        }
      };

    loadBookings();
  }, []);

  const activeRentals =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            [
              "ACTIVE",
              "LEASE_ACTIVE",
              "PAID",
            ].includes(
              booking.status
            ) ||
            booking.paymentStatus ===
              "PAID"
        ),
      [bookings]
    );

  const handleDownloadLease = (
    booking
  ) => {
    navigate(
      `/tenant/lease-document/${booking.id}`
    );
  };

  if (loading) {
    return (
      <div className="tenant-lease-page">
        <section className="tenant-lease-empty">
          <FaFileContract />

          <h2>
            Loading rental...
          </h2>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tenant-lease-page">
        <section className="tenant-lease-empty">
          <FaFileContract />

          <h2>
            Unable to load rental
          </h2>

          <p>
            {error}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="tenant-lease-page">
      <section className="tenant-lease-header">
        <div>
          <span>
            Active rental agreement
          </span>

          <h1>
            My rental
          </h1>

          <p>
            View your active property,
            lease period, payment details
            and rental agreement.
          </p>
        </div>

        <div className="tenant-lease-header-icon">
          <FaFileContract />
        </div>
      </section>

      {activeRentals.length > 0 ? (
        <section className="tenant-lease-list">
          {activeRentals.map(
            (booking) => {
              const moveInDate =
                booking.approvedMoveInDate ||
                booking.requestedMoveInDate ||
                booking.moveInDate;

              const leaseEndDate =
                booking.leaseEndDate
                  ? null
                  : calculateLeaseEndDate(
                      moveInDate,
                      booking.durationMonths
                    );

              const monthlyRent =
                Number(
                  booking.approvedMonthlyRent ||
                    booking.requestedMonthlyRent ||
                    0
                );

              const securityDeposit =
                Number(
                  booking.securityDeposit ||
                    0
                );

              const totalPaid =
                Number(
                  booking.totalPayable ||
                    booking.paymentAmount ||
                    monthlyRent +
                      securityDeposit
                );

              const occupants =
                booking.numberOfOccupants ||
                booking.occupantCount ||
                0;

              return (
                <article
                  key={booking.id}
                  className="tenant-lease-card"
                >
                  <div className="tenant-lease-property">
                    <div className="tenant-lease-property-image">
                      <img
                        src={
                          booking.propertyImage
                            ? booking.propertyImage.startsWith("http")
                              ? booking.propertyImage
                              : `http://localhost:8081${booking.propertyImage}`
                            : "https://placehold.co/900x600?text=RentSphere+Property"
                        }
                        alt={
                          booking.propertyTitle ||
                          "Rental property"
                        }
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://placehold.co/900x600?text=RentSphere+Property";
                        }}
                      />
                      <span className="tenant-lease-active-status">
                        <FaCheckCircle />
                        Active Rental
                      </span>
                    </div>

                    <div className="tenant-lease-property-body">
                      <span>
                        {
                          booking.propertyCategory
                        }
                      </span>

                      <h2>
                        {
                          booking.propertyTitle
                        }
                      </h2>

                      <p>
                        <FaMapMarkerAlt />

                        {booking.propertyArea ||
                          booking.locality ||
                          ""}

                        {(booking.propertyArea ||
                          booking.locality) &&
                        booking.propertyCity
                          ? ", "
                          : ""}

                        {booking.propertyCity ||
                          booking.city ||
                          ""}
                      </p>

                      <div className="tenant-lease-property-actions">
                        <Link
                          to={`/property/${booking.propertyId}`}
                        >
                          <FaHome />
                          View Property
                        </Link>

                        <Link
                          to={`/tenant/payment-receipt/${booking.id}`}
                        >
                          <FaReceipt />
                          View Receipt
                        </Link>
                      </div>
                    </div>
                  </div>

                  <section className="tenant-lease-status-banner">
                    <FaShieldAlt />

                    <div>
                      <strong>
                        Lease currently active
                      </strong>

                      <p>
                        Your payment has been
                        completed and the
                        property is reserved
                        under this rental
                        booking.
                      </p>
                    </div>
                  </section>

                  <div className="tenant-lease-details-grid">
                    <div>
                      <FaCalendarAlt />

                      <span>
                        Lease start date
                      </span>

                      <strong>
                        {formatDisplayDate(
                          booking.leaseStartDate ||
                            moveInDate
                        )}
                      </strong>
                    </div>

                    <div>
                      <FaCalendarAlt />

                      <span>
                        Lease end date
                      </span>

                      <strong>
                        {booking.leaseEndDate
                          ? formatDisplayDate(
                              booking.leaseEndDate
                            )
                          : formatCalculatedDate(
                              leaseEndDate
                            )}
                      </strong>
                    </div>

                    <div>
                      <FaFileContract />

                      <span>
                        Rental duration
                      </span>

                      <strong>
                        {
                          booking.durationMonths
                        }{" "}
                        months
                      </strong>
                    </div>

                    <div>
                      <FaBuilding />

                      <span>
                        Number of occupants
                      </span>

                      <strong>
                        {occupants}
                      </strong>
                    </div>
                  </div>

                  <section className="tenant-lease-financials">
                    <div className="tenant-lease-section-heading">
                      <div>
                        <FaReceipt />
                      </div>

                      <span>
                        <small>
                          Rental financials
                        </small>

                        <strong>
                          Payment summary
                        </strong>
                      </span>
                    </div>

                    <div className="tenant-lease-payment-grid">
                      <div>
                        <span>
                          Approved monthly rent
                        </span>

                        <strong>
                          {formatCurrency(
                            monthlyRent
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Security deposit
                        </span>

                        <strong>
                          {formatCurrency(
                            securityDeposit
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Total initial payment
                        </span>

                        <strong>
                          {formatCurrency(
                            totalPaid
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Payment status
                        </span>

                        <strong className="tenant-lease-paid-status">
                          {formatStatus(
                            booking.paymentStatus ||
                              (booking.status ===
                                "ACTIVE" ||
                              booking.status ===
                                "LEASE_ACTIVE"
                                ? "PAID"
                                : "UNKNOWN")
                          )}
                        </strong>
                      </div>
                    </div>
                  </section>

                  <section className="tenant-lease-landlord">
                    <div className="tenant-lease-section-heading">
                      <div>
                        <FaUserShield />
                      </div>

                      <span>
                        <small>
                          Property owner
                        </small>

                        <strong>
                          Landlord information
                        </strong>
                      </span>
                    </div>

                    <div className="tenant-lease-landlord-details">
                      <div>
                        <span>
                          Landlord name
                        </span>

                        <strong>
                          {
                            booking.landlordName
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          Booking ID
                        </span>

                        <strong>
                          {booking.id}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Payment ID
                        </span>

                        <strong>
                          {booking.paymentId ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Booking status
                        </span>

                        <strong>
                          {formatStatus(
                            booking.status
                          )}
                        </strong>
                      </div>
                    </div>
                  </section>

                  <section className="tenant-lease-terms">
                    <h3>
                      Important lease information
                    </h3>

                    <div>
                      <p>
                        <FaCheckCircle />
                        Monthly rent must be
                        paid according to the
                        agreed rental schedule.
                      </p>

                      <p>
                        <FaCheckCircle />
                        The security deposit is
                        refundable according
                        to the final lease
                        agreement and property
                        condition.
                      </p>

                      <p>
                        <FaCheckCircle />
                        The lease document is
                        linked to this active
                        booking.
                      </p>
                    </div>
                  </section>

                  <div className="tenant-lease-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadLease(
                          booking
                        )
                      }
                    >
                      <FaDownload />
                      Download Lease
                    </button>

                    <Link
                      to={`/tenant/payment-receipt/${booking.id}`}
                    >
                      <FaReceipt />
                      View Payment Receipt
                    </Link>

                  </div>
                </article>
              );
            }
          )}
        </section>
      ) : (
        <section className="tenant-lease-empty">
          <FaFileContract />

          <h2>
            No active rental found
          </h2>

          <p>
            Your active rental and lease
            information will appear here
            after booking approval and
            successful payment.
          </p>

          <div>
            <Link to="/tenant/bookings">
              View My Bookings
            </Link>

            <Link to="/properties">
              Explore Properties
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default TenantLease;
