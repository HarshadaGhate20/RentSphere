import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "react-toastify";

import {
  approveBooking,
  getLandlordBookings,
  rejectBooking,
} from "../../services/bookingApi";

import {
  getLandlordUser,
} from "../../utils/sessionUser";

const isVillaBooking = (booking) =>
  String(booking?.propertyCategory || "").trim().toUpperCase() === "VILLA" ||
  String(booking?.pricingType || "").trim().toUpperCase() === "DAILY";

const LandlordBookings = () => {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadBookings =
    useCallback(async () => {
      try {
        setLoading(true);

        const landlord =
          getLandlordUser();

        const data =
          await getLandlordBookings(
            landlord.id
          );

        setBookings(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleApprove = async (
    booking
  ) => {
    try {
      await approveBooking(
        booking.id,
        Number(booking.requestedMonthlyRent),
        "Booking approved. Please complete payment."
      );

      toast.success(
        "Booking approved."
      );

      await loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (
    bookingId
  ) => {
    const reason =
      window.prompt(
        "Enter rejection reason:"
      );

    if (!reason?.trim()) {
      return;
    }

    try {
      await rejectBooking(
        bookingId,
        reason.trim()
      );

      toast.success(
        "Booking rejected."
      );

      await loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        Loading booking requests...
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2>Tenant Booking Requests</h2>

      <div className="row g-4 mt-2">
        {bookings.map((booking) => (
          <div
            className="col-lg-6"
            key={booking.id}
          >
            <div className="card border-0 shadow-sm h-100">
              {booking.propertyImage && (
                <img
                  src={
                    booking.propertyImage
                      .startsWith("http")
                      ? booking.propertyImage
                      : `http://localhost:8081${booking.propertyImage}`
                  }
                  alt={
                    booking.propertyTitle
                  }
                  style={{
                    height: "220px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div className="card-body">
                <span className="badge bg-primary">
                  {booking.status}
                </span>

                <h4 className="mt-2">
                  {booking.propertyTitle}
                </h4>

                <p>
                  Tenant:{" "}
                  {booking.tenantName}
                </p>

                <p>
                  Email:{" "}
                  {booking.tenantEmail}
                </p>

                <p>
                  Requested rent: ₹
                  {Number(
                    booking
                      .requestedMonthlyRent
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  Move-in:{" "}
                  {
                    booking
                      .requestedMoveInDate
                  }
                </p>

                <p>
                  Duration:{" "}
                  {booking.durationMonths}{" "}
                  {isVillaBooking(booking) ? "days" : "months"}
                </p>

                <p>
                  Occupants:{" "}
                  {
                    booking
                      .numberOfOccupants
                  }
                </p>

                {booking.status ===
                  "PENDING" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success me-2"
                      onClick={() =>
                        handleApprove(
                          booking
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        handleReject(
                          booking.id
                        )
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!bookings.length && (
        <div className="text-center py-5">
          <h4>
            No booking requests found.
          </h4>
        </div>
      )}
    </div>
  );
};

export default LandlordBookings;
