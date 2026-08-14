import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaDownload,
  FaFileContract,
  FaMapMarkerAlt,
  FaPrint,
  FaShieldAlt,
} from "react-icons/fa";

import {
  getBookingById,
} from "../../services/bookingApi";

import { getTenantVisiblePropertyById } from "../../services/propertyApi";

import "../../assets/css/tenantLeaseDocument.css";

/*
 * =====================================================
 * HELPERS
 * =====================================================
 */

const formatCurrency = (amount) =>
  `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

const parseDate = (
  dateValue
) => {
  if (!dateValue) {
    return null;
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
};

const formatDate = (
  dateValue
) => {
  if (!dateValue) {
    return "Not available";
  }

  const date =
    dateValue instanceof Date
      ? dateValue
      : parseDate(
          dateValue
        );

  if (!date) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const calculateLeaseEndDate = (
  startDateValue,
  duration,
  useDays = false
) => {
  const startDate =
    parseDate(
      startDateValue
    );

  if (
    !startDate ||
    !duration
  ) {
    return null;
  }

  const endDate =
    new Date(
      startDate
    );

  if (useDays) {
    endDate.setDate(endDate.getDate() + Number(duration));
  } else {
    endDate.setMonth(endDate.getMonth() + Number(duration));
  }

  /*
   * Example:
   *
   * Start:
   * 08 Aug 2026
   *
   * Duration:
   * 3 months
   *
   * End:
   * 07 Nov 2026
   */
  endDate.setDate(
    endDate.getDate() -
      1
  );

  return endDate;
};

const formatStatus = (
  status
) =>
  String(
    status || "UNKNOWN"
  ).replaceAll(
    "_",
    " "
  );

/*
 * =====================================================
 * COMPONENT
 * =====================================================
 */

const TenantLeaseDocument =
  () => {

  const {
    bookingId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    booking,
    setBooking,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * =====================================================
   * LOAD BOOKING FROM SPRING BOOT
   * =====================================================
   */
  useEffect(() => {
    const loadBooking =
      async () => {
        try {
          setLoading(true);
          setError("");

          console.log(
            "LEASE DOCUMENT BOOKING ID:",
            bookingId
          );

          /*
           * Directly call:
           *
           * GET
           * localhost:8082/api/bookings/{bookingId}
           */
          const data =
            await getBookingById(
              bookingId
            );

          console.log(
            "LEASE BOOKING RESPONSE:",
            data
          );

          let property = null;
          try {
            property = await getTenantVisiblePropertyById(data.propertyId);
          } catch (propertyError) {
            console.warn("Unable to load lease property image:", propertyError);
          }

          setBooking({
            ...data,
            propertyImage: property?.image || property?.images?.[0] || data.propertyImage,
          });
        } catch (
          loadError
        ) {
          console.error(
            "LEASE DOCUMENT ERROR:",
            loadError
          );

          setBooking(
            null
          );

          setError(
            loadError.message ||
              "Unable to load lease document."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */
  if (loading) {
    return (
      <div className="lease-document-not-found">

        <FaFileContract />

        <h2>
          Loading lease document...
        </h2>

        <p>
          Loading your active
          rental information.
        </p>

      </div>
    );
  }

  /*
   * =====================================================
   * BOOKING NOT FOUND
   * =====================================================
   */
  if (!booking) {
    return (
      <div className="lease-document-not-found">

        <FaFileContract />

        <h2>
          Lease record not found
        </h2>

        <p>
          {error ||
            "The selected rental booking is unavailable."}
        </p>

        <Link
          to="/tenant/lease"
        >
          Back to My Rental
        </Link>

      </div>
    );
  }

  /*
   * =====================================================
   * STATUS VALIDATION
   * =====================================================
   */

  const bookingStatus =
    String(
      booking.status ||
        ""
    ).toUpperCase();

  const paymentStatus =
    String(
      booking.paymentStatus ||
        ""
    ).toUpperCase();

  console.log(
    "LEASE BOOKING STATUS:",
    bookingStatus
  );

  console.log(
    "LEASE PAYMENT STATUS:",
    paymentStatus
  );

  /*
   * Allow document when the
   * rental is effectively active.
   *
   * Your backend may use:
   *
   * ACTIVE
   * LEASE_ACTIVE
   * COMPLETED
   *
   * or may have a paymentId.
   */
  const leaseAllowed =
    bookingStatus ===
      "ACTIVE" ||
    bookingStatus ===
      "LEASE_ACTIVE" ||
    bookingStatus ===
      "COMPLETED" ||
    paymentStatus ===
      "PAID" ||
    Boolean(
      booking.paymentId
    );

  if (!leaseAllowed) {
    return (
      <div className="lease-document-not-found">

        <FaShieldAlt />

        <h2>
          Lease document unavailable
        </h2>

        <p>
          The lease document is
          available only after
          successful payment and
          rental activation.
        </p>

        <Link
          to="/tenant/bookings"
        >
          View My Bookings
        </Link>

      </div>
    );
  }

  /*
   * =====================================================
   * NORMALIZE BOOKING DATA
   * =====================================================
   */

  const leaseStartDate =
    booking.leaseStartDate ||
    booking.approvedMoveInDate ||
    booking.requestedMoveInDate ||
    booking.moveInDate;

  const isVilla =
    String(booking.propertyCategory || "").trim().toUpperCase() === "VILLA" ||
    String(booking.pricingType || "").trim().toUpperCase() === "DAILY";

  const rentalDuration =
    isVilla
      ? booking.durationDays || booking.durationMonths
      : booking.durationMonths;

  const calculatedEndDate =
    calculateLeaseEndDate(
      leaseStartDate,
      rentalDuration,
      isVilla
    );

  const leaseEndDate =
    isVilla
      ? calculatedEndDate
      : booking.leaseEndDate || calculatedEndDate;

  const agreementNumber =
    `LEASE-${String(
      booking.id
    ).replace(
      "BOOK-",
      ""
    )}`;

  const landlordName =
    booking.landlordName ||
    "RentSphere Landlord";

  const tenantName =
    booking.tenantName ||
    "RentSphere Tenant";

  const propertyTitle =
    booking.propertyTitle ||
    "Rental Property";

  const propertyCategory =
    booking.propertyCategory ||
    "Property";

  const propertyArea =
    booking.propertyArea ||
    booking.locality ||
    booking.area ||
    "";

  const propertyCity =
    booking.propertyCity ||
    booking.city ||
    "";

  const occupants =
    booking.numberOfOccupants ||
    booking.occupantCount ||
    0;

  const approvedMonthlyRent =
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

  const maintenanceCharge =
    Number(
      booking.maintenanceCharge ||
      0
    );

  const totalPaid =
    Number(
      booking.totalPayable ||
      booking.paymentAmount ||
      approvedMonthlyRent +
        securityDeposit +
        maintenanceCharge
    );

  /*
   * =====================================================
   * IMAGE URL
   * =====================================================
   */

  const getPropertyImage =
    () => {

    const image =
      booking.propertyImage ||
      booking.image ||
      booking.imageUrl;

    if (!image) {
      return "https://placehold.co/900x600?text=RentSphere+Property";
    }

    if (
      String(
        image
      ).startsWith(
        "http"
      )
    ) {
      return image;
    }

    return `http://localhost:8081${image}`;
  };

  /*
   * =====================================================
   * PRINT / PDF
   * =====================================================
   */

  const handlePrint =
    () => {
      window.print();
    };

  return (
    <div className="tenant-lease-document-page">

      {/* =============================
          TOOLBAR
      ============================== */}

      <section className="lease-document-toolbar">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/tenant/lease"
            )
          }
        >
          <FaArrowLeft />

          Back to My Rental
        </button>

        <div>

          <button
            type="button"
            onClick={
              handlePrint
            }
          >
            <FaPrint />

            Print
          </button>

          <button
            type="button"
            onClick={
              handlePrint
            }
          >
            <FaDownload />

            Save as PDF
          </button>

        </div>

      </section>

      {/* =============================
          LEASE DOCUMENT
      ============================== */}

      <article className="tenant-lease-document">

        {/* HEADER */}

        <header className="lease-document-header">

          <div className="lease-document-brand">

            <div>
              <FaBuilding />
            </div>

            <span>

              <strong>
                RentSphere
              </strong>

              <small>
                Property Rental
                Management
              </small>

            </span>

          </div>

          <div className="lease-document-title">

            <span>
              Rental agreement
            </span>

            <h1>
              LEASE AGREEMENT
            </h1>

          </div>

        </header>

        {/* =============================
            REFERENCE DETAILS
        ============================== */}

        <section className="lease-document-reference">

          <div>

            <span>
              Agreement number
            </span>

            <strong>
              {
                agreementNumber
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
              Agreement status
            </span>

            <strong>
              ACTIVE
            </strong>

          </div>

          <div>

            <span>
              Payment status
            </span>

            <strong>
              {paymentStatus ||
                (booking.paymentId
                  ? "PAID"
                  : "UNKNOWN")}
            </strong>

          </div>

        </section>

        {/* =============================
            INTRODUCTION
        ============================== */}

        <section className="lease-document-introduction">

          <p>
            This rental agreement
            records the rental
            arrangement between the
            landlord and tenant for
            the property described
            below.
          </p>

        </section>

        {/* =============================
            LANDLORD / TENANT
        ============================== */}

        <section className="lease-document-parties">

          <article>

            <span>
              Landlord
            </span>

            <h2>
              {landlordName}
            </h2>

            <p>
              Verified RentSphere
              landlord
            </p>

          </article>

          <article>

            <span>
              Tenant
            </span>

            <h2>
              {tenantName}
            </h2>

            <p>
              Occupation:{" "}
              {booking.tenantOccupation ||
                booking.occupation ||
                "Not provided"}
            </p>

          </article>

        </section>

        {/* =============================
            PROPERTY
        ============================== */}

        <section className="lease-document-property">

          <img
            src={
              getPropertyImage()
            }
            alt={
              propertyTitle
            }
            onError={(
              event
            ) => {
              event.currentTarget.src =
                "https://placehold.co/900x600?text=RentSphere+Property";
            }}
          />

          <div>

            <span>
              {
                propertyCategory
              }
            </span>

            <h2>
              {propertyTitle}
            </h2>

            <p>
              <FaMapMarkerAlt />

              {propertyArea}

              {propertyArea &&
              propertyCity
                ? ", "
                : ""}

              {propertyCity}
            </p>

            <strong>
              Property ID:{" "}
              {
                booking.propertyId
              }
            </strong>

          </div>

        </section>

        {/* =============================
            LEASE DETAILS
        ============================== */}

        <section className="lease-document-details-grid">

          <div>

            <span>
              Lease start date
            </span>

            <strong>
              {formatDate(
                leaseStartDate
              )}
            </strong>

          </div>

          <div>

            <span>
              Lease end date
            </span>

            <strong>
              {formatDate(
                leaseEndDate
              )}
            </strong>

          </div>

          <div>

            <span>
              Rental duration
            </span>

            <strong>
              {
                rentalDuration ||
                "Not available"
              }{" "}
              {rentalDuration
                ? isVilla ? "days" : "months"
                : ""}
            </strong>

          </div>

          <div>

            <span>
              Number of occupants
            </span>

            <strong>
              {occupants}
            </strong>

          </div>

        </section>

        {/* =============================
            FINANCIAL TERMS
        ============================== */}

        <section className="lease-document-financials">

          <h2>
            Financial terms
          </h2>

          <div>

            <span>
              {isVilla ? "Approved daily rent" : "Approved monthly rent"}
            </span>

            <strong>
              {formatCurrency(
                approvedMonthlyRent
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
              Maintenance charge
            </span>

            <strong>
              {formatCurrency(
                maintenanceCharge
              )}
            </strong>

          </div>

          <div>

            <span>
              Initial amount paid
            </span>

            <strong>
              {formatCurrency(
                totalPaid
              )}
            </strong>

          </div>

        </section>

        {/* =============================
            PAYMENT REFERENCE
        ============================== */}

        <section className="lease-document-reference">

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
              Payment Order ID
            </span>

            <strong>
              {booking.paymentOrderId ||
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

          <div>

            <span>
              Payment date
            </span>

            <strong>
              {booking.paymentDate
                ? formatDate(
                    String(
                      booking.paymentDate
                    ).split(
                      "T"
                    )[0]
                  )
                : "Not available"}
            </strong>

          </div>

        </section>

        {/* =============================
            TERMS
        ============================== */}

        <section className="lease-document-terms">

          <h2>
            Terms and conditions
          </h2>

          <ol>

            <li>
              The tenant shall pay
              the agreed {isVilla ? "daily" : "monthly"} rent
              according to the rental
              payment schedule.
            </li>

            <li>
              The security deposit
              will be handled according
              to the final property
              inspection and applicable
              agreement conditions.
            </li>

            <li>
              The tenant shall use
              the property only for
              lawful residential
              purposes.
            </li>

            <li>
              Damage beyond normal
              wear and tear may be
              deducted from the
              security deposit.
            </li>

            <li>
              Early termination and
              notice-period
              requirements will follow
              the final legally
              verified agreement.
            </li>

          </ol>

        </section>

        {/* =============================
            SIGNATURES
        ============================== */}

        <section className="lease-document-signatures">

          <div>

            <span>
              Landlord signature
            </span>

            <div />

            <strong>
              {landlordName}
            </strong>

          </div>

          <div>

            <span>
              Tenant signature
            </span>

            <div />

            <strong>
              {tenantName}
            </strong>

          </div>

        </section>

        {/* =============================
            NOTICE
        ============================== */}

        <section className="lease-document-notice">

          <FaShieldAlt />

          <p>
            This document is generated
            from the RentSphere booking
            and payment records for
            project demonstration.
            Production rental
            agreements should be
            legally reviewed and
            verified.
          </p>

        </section>

        {/* =============================
            FOOTER
        ============================== */}

        <footer className="lease-document-footer">

          <span>
            RentSphere Rental
            Management
          </span>

          <span>
            Computer-generated lease
            record
          </span>

        </footer>

      </article>

    </div>
  );
};

export default TenantLeaseDocument;
