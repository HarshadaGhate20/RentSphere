import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaTools,
} from "react-icons/fa";

import {
  getTenantBookings,
} from "../../services/bookingApi";

import {
  getTenantUser,
} from "../../utils/sessionUser";

const TenantMaintenance = () => {
  const [searchParams] =
    useSearchParams();

  const bookingIdFromUrl =
    searchParams.get(
      "bookingId"
    );

  const [bookings, setBookings] =
    useState([]);

  const [
    selectedBookingId,
    setSelectedBookingId,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState({
      category: "",
      priority: "MEDIUM",
      title: "",
      description: "",
    });

  useEffect(() => {
    const loadBookings =
      async () => {
        try {
          setLoading(true);
          setError("");

          const tenant =
            getTenantUser();

          const tenantId =
            tenant.email ||
            tenant.id;

          const data =
            await getTenantBookings(
              tenantId
            );

          setBookings(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (loadError) {
          setError(
            loadError.message ||
              "Unable to load active rentals."
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
          (booking) => {
            const status =
              String(
                booking.status ||
                  ""
              ).toUpperCase();

            return (
              status === "ACTIVE" ||
              status ===
                "LEASE_ACTIVE" ||
              Boolean(
                booking.paymentId
              )
            );
          }
        ),
      [bookings]
    );

  useEffect(() => {
    if (
      bookingIdFromUrl &&
      activeRentals.some(
        (booking) =>
          String(
            booking.id
          ) ===
          String(
            bookingIdFromUrl
          )
      )
    ) {
      setSelectedBookingId(
        bookingIdFromUrl
      );
    }
  }, [
    bookingIdFromUrl,
    activeRentals,
  ]);

  const selectedBooking =
    activeRentals.find(
      (booking) =>
        String(
          booking.id
        ) ===
        String(
          selectedBookingId
        )
    );

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedBooking) {
      setError(
        "Please select an active rental."
      );

      return;
    }

    if (!formData.category) {
      setError(
        "Please select an issue category."
      );

      return;
    }

    if (!formData.title.trim()) {
      setError(
        "Please enter an issue title."
      );

      return;
    }

    if (
      !formData.description.trim()
    ) {
      setError(
        "Please describe the maintenance issue."
      );

      return;
    }

    const maintenanceRequest = {
      bookingId:
        selectedBooking.id,

      propertyId:
        selectedBooking.propertyId,

      propertyTitle:
        selectedBooking.propertyTitle,

      landlordId:
        selectedBooking.landlordId,

      landlordName:
        selectedBooking.landlordName,

      tenantId:
        selectedBooking.tenantId,

      tenantName:
        selectedBooking.tenantName,

      tenantEmail:
        selectedBooking.tenantEmail,

      category:
        formData.category,

      priority:
        formData.priority,

      title:
        formData.title,

      description:
        formData.description,

      status:
        "OPEN",
    };

    console.log(
      "MAINTENANCE REQUEST:",
      maintenanceRequest
    );

    setSuccess(
      "Maintenance request is ready for backend integration."
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        Loading active rental...
      </div>
    );
  }

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h2>
          <FaTools /> Maintenance
        </h2>

        <p className="text-muted">
          Raise maintenance issues
          for your active rental.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <FaExclamationTriangle />{" "}
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <FaCheckCircle />{" "}
          {success}
        </div>
      )}

      {!activeRentals.length ? (
        <div className="alert alert-info">
          No active rental found.
        </div>
      ) : (
        <form
          className="card p-4"
          onSubmit={
            handleSubmit
          }
        >

          <div className="mb-3">
            <label className="form-label fw-bold">
              Rental Property
            </label>

            <select
              className="form-select"
              value={
                selectedBookingId
              }
              onChange={(
                event
              ) =>
                setSelectedBookingId(
                  event.target.value
                )
              }
            >
              <option value="">
                Select rental
              </option>

              {activeRentals.map(
                (booking) => (
                  <option
                    key={
                      booking.id
                    }
                    value={
                      booking.id
                    }
                  >
                    {
                      booking.propertyTitle
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {selectedBooking && (
            <div className="alert alert-light border">

              <strong>
                {
                  selectedBooking.propertyTitle
                }
              </strong>

              <div>
                <FaMapMarkerAlt />{" "}
                {selectedBooking.propertyArea}
                {selectedBooking.propertyArea &&
                selectedBooking.propertyCity
                  ? ", "
                  : ""}
                {
                  selectedBooking.propertyCity
                }
              </div>

              <small>
                Booking ID:{" "}
                {
                  selectedBooking.id
                }
              </small>

            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold">
              Category
            </label>

            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
              className="form-select"
            >
              <option value="">
                Select issue
              </option>

              <option value="PLUMBING">
                Plumbing
              </option>

              <option value="ELECTRICAL">
                Electrical
              </option>

              <option value="WATER">
                Water Supply
              </option>

              <option value="APPLIANCE">
                Appliance
              </option>

              <option value="FURNITURE">
                Furniture
              </option>

              <option value="SECURITY">
                Security
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Priority
            </label>

            <select
              name="priority"
              value={
                formData.priority
              }
              onChange={
                handleChange
              }
              className="form-select"
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="URGENT">
                Urgent
              </option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Issue Title
            </label>

            <input
              type="text"
              name="title"
              className="form-control"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              placeholder="Example: Water leakage in kitchen"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              className="form-control"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Describe the issue..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Submit Request
          </button>

        </form>
      )}

    </div>
  );
};

export default TenantMaintenance;