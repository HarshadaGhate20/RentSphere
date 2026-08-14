import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  FaCalendarAlt,
  FaHome,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUsers,
} from "react-icons/fa";

import {
  cancelBooking,
  getTenantBookings,
} from "../../services/bookingApi";

import {
  getTenantUser,
} from "../../utils/sessionUser";

const isVillaBooking = (booking) =>
  String(booking?.propertyCategory || "").trim().toUpperCase() === "VILLA" ||
  String(booking?.pricingType || "").trim().toUpperCase() === "DAILY";

const TenantBookings = () => {
  const navigate = useNavigate();

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

  const loadBookings =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const tenant =
          getTenantUser();

        console.log(
          "CURRENT TENANT:",
          tenant
        );

        console.log(
          "TENANT ID SENT TO BOOKING API:",
          tenant.id
        );

        const data =
          await getTenantBookings(
            tenant.id
          );

        console.log(
          "TENANT BOOKINGS RESPONSE:",
          data
        );

        setBookings(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (loadError) {
        console.error(
          "Unable to load tenant bookings:",
          loadError
        );

        setError(
          loadError.message ||
            "Unable to load bookings."
        );

        toast.error(
          loadError.message ||
            "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel =
    async (bookingId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this booking?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await cancelBooking(
          bookingId
        );

        toast.success(
          "Booking cancelled successfully."
        );

        await loadBookings();
      } catch (cancelError) {
        toast.error(
          cancelError.message ||
            "Unable to cancel booking."
        );
      }
    };

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-warning text-dark";

      case "APPROVED":
      case "WAITING_PAYMENT":
        return "bg-info text-dark";

      case "ACTIVE":
      case "LEASE_ACTIVE":
        return "bg-success";

      case "COMPLETED":
        return "bg-primary";

      case "REJECTED":
      case "CANCELLED":
      case "PAYMENT_FAILED":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <h4>
          Loading your bookings...
        </h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={loadBookings}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <small className="text-primary fw-bold">
          RENTAL MANAGEMENT
        </small>

        <h2 className="fw-bold mt-1">
          My Bookings
        </h2>

        <p className="text-muted">
          Track your property booking
          requests, approvals and
          payments.
        </p>
      </div>

      {/* Booking cards */}
      <div className="row g-4">
        {bookings.map(
          (booking) => (
            <div
              className="col-xl-6"
              key={booking.id}
            >
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                {/* Image */}
                {booking.propertyImage && (
                  <img
                    src={
                      booking.propertyImage.startsWith(
                        "http"
                      )
                        ? booking.propertyImage
                        : `http://localhost:8081${booking.propertyImage}`
                    }
                    alt={
                      booking.propertyTitle
                    }
                    style={{
                      width: "100%",
                      height: "230px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body p-4">
                  {/* Status */}
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-primary fw-bold">
                        {booking.id}
                      </small>

                      <h4 className="mt-2 mb-1">
                        {booking.propertyTitle ||
                          "Property Booking"}
                      </h4>
                    </div>

                    <span
                      className={`badge ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-muted mt-2">
                    <FaMapMarkerAlt />{" "}
                    {booking.propertyArea ||
                      ""}
                    {booking.propertyArea &&
                    booking.propertyCity
                      ? ", "
                      : ""}
                    {booking.propertyCity ||
                      ""}
                  </p>

                  <hr />

                  {/* Booking details */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted">
                        {isVillaBooking(booking)
                          ? "Requested Daily Rent"
                          : "Requested Rent"}
                      </small>

                      <div className="fw-bold">
                        <FaRupeeSign />{" "}
                        {Number(
                          booking.requestedMonthlyRent ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <small className="text-muted">
                        Move-in Date
                      </small>

                      <div className="fw-bold">
                        <FaCalendarAlt />{" "}
                        {booking.requestedMoveInDate ||
                          "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <small className="text-muted">
                        Duration
                      </small>

                      <div className="fw-bold">
                        <FaHome />{" "}
                        {booking.durationMonths ||
                          0}{" "}
                        {isVillaBooking(booking)
                          ? "days"
                          : "months"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <small className="text-muted">
                        Occupants
                      </small>

                      <div className="fw-bold">
                        <FaUsers />{" "}
                        {booking.numberOfOccupants ||
                          0}
                      </div>
                    </div>
                  </div>

                  {/* Approved rent */}
                  {booking.approvedMonthlyRent && (
                    <div className="alert alert-success mt-4 mb-0">
                      <small>
                        {isVillaBooking(booking)
                          ? "Approved Daily Rent"
                          : "Approved Monthly Rent"}
                      </small>

                      <h5 className="mb-0 mt-1">
                        ₹
                        {Number(
                          booking.approvedMonthlyRent
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </h5>
                    </div>
                  )}

                  {/* Rejection */}
                  {booking.rejectionReason && (
                    <div className="alert alert-danger mt-4 mb-0">
                      <strong>
                        Rejection Reason
                      </strong>

                      <div>
                        {
                          booking.rejectionReason
                        }
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="d-flex flex-wrap gap-2 mt-4">
                    {booking.status ===
                      "WAITING_PAYMENT" && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() =>
                          navigate(
                            `/tenant/payments/${booking.id}`
                          )
                        }
                      >
                        Pay Now
                      </button>
                    )}

                    {booking.status ===
                      "PENDING" && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleCancel(
                            booking.id
                          )
                        }
                      >
                        Cancel Booking
                      </button>
                    )}

                    {[
                      "ACTIVE",
                      "LEASE_ACTIVE",
                      "COMPLETED",
                    ].includes(
                      booking.status
                    ) && (
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() =>
                          navigate(
                            `/tenant/payment-receipt/${booking.id}`
                          )
                        }
                      >
                        View Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Empty state */}
      {bookings.length === 0 && (
        <div className="text-center py-5">
          <h4>
            No bookings found.
          </h4>

          <p className="text-muted">
            Explore available properties
            and submit your first booking
            request.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate(
                "/properties"
              )
            }
          >
            Explore Properties
          </button>
        </div>
      )}
    </div>
  );
};

export default TenantBookings;
