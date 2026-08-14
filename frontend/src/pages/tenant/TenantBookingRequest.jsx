import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  createBooking,
} from "../../services/bookingApi";

import {
  getPropertyById,
} from "../../services/propertyApi";

import {
  getTenantUser,
} from "../../utils/sessionUser";

const formatCurrency = (
  amount
) =>
  `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

const TenantBookingRequest =
  () => {

    const {
      propertyId,
    } =
      useParams();

    const location =
      useLocation();

    const navigate =
      useNavigate();

    const negotiationData =
      location.state ||
      {};

    const [
      property,
      setProperty,
    ] =
      useState(null);

    const [
      loading,
      setLoading,
    ] =
      useState(true);

    const [
      submitting,
      setSubmitting,
    ] =
      useState(false);

    const [
      formData,
      setFormData,
    ] =
      useState({
        requestedMonthlyRent:
          "",

        requestedMoveInDate:
          "",

        durationMonths:
          12,

        numberOfOccupants:
          1,

        numberOfBeds:
          1,

        tenantMessage:
          "",
      });

    /* =======================================================
       PROPERTY TYPE
    ======================================================= */

    const isPG =
      useMemo(
        () => {
          if (!property) {
            return false;
          }

          const category =
            String(
              property.category ||
                ""
            )
              .trim()
              .toUpperCase();

          const pricingType =
            String(
              property.pricingType ||
                ""
            )
              .trim()
              .toUpperCase();

          return (
            category ===
              "PG" ||
            pricingType ===
              "PER_BED_MONTHLY"
          );
        },
        [
          property,
        ]
      );

    const isVilla =
      useMemo(() => {
        if (!property) {
          return false;
        }

        const category = String(property.category || "")
          .trim()
          .toUpperCase();
        const pricingType = String(property.pricingType || "")
          .trim()
          .toUpperCase();

        return category === "VILLA" || pricingType === "DAILY";
      }, [property]);

    /* =======================================================
       LOAD PROPERTY
    ======================================================= */

    useEffect(() => {

      const loadProperty =
        async () => {

          if (
            !propertyId ||
            propertyId ===
              "undefined"
          ) {
            toast.error(
              "Property ID is missing."
            );

            setLoading(
              false
            );

            return;
          }

          try {

            setLoading(
              true
            );

            const data =
              await getPropertyById(
                propertyId
              );

            console.log(
              "BOOKING PROPERTY:",
              data
            );

            setProperty(
              data
            );

            const category =
              String(
                data.category ||
                  ""
              )
                .trim()
                .toUpperCase();

            const pricingType =
              String(
                data.pricingType ||
                  ""
              )
                .trim()
                .toUpperCase();

            const pg =
              category ===
                "PG" ||
              pricingType ===
                "PER_BED_MONTHLY";

            let rent;

            /*
             * Negotiated rent has
             * highest priority.
             */
            if (
              negotiationData
                .agreedRent
            ) {

              rent =
                Number(
                  negotiationData
                    .agreedRent
                );

            } else if (pg) {

              rent =
                Number(
                  data.rentPerBed ||
                    0
                );

            } else {

              rent =
                Number(
                  data.monthlyRent || data.dailyRent ||
                    0
                );
            }

            setFormData(
              (
                current
              ) => ({
                ...current,

                requestedMonthlyRent:
                  rent,

                numberOfBeds:
                  1,
              })
            );

          } catch (
            error
          ) {

            console.error(
              "PROPERTY LOAD ERROR:",
              error
            );

            toast.error(
              error.message
            );

          } finally {

            setLoading(
              false
            );
          }
        };

      loadProperty();

    }, [
      propertyId,
      negotiationData
        .agreedRent,
    ]);

    /* =======================================================
       INPUT CHANGE
    ======================================================= */

    const handleChange =
      (
        event
      ) => {

        const {
          name,
          value,
        } =
          event.target;

        /*
         * PG rent recalculates automatically
         * when number of beds changes.
         */
        if (
          name ===
            "numberOfBeds" &&
          isPG
        ) {

          const beds =
            Math.max(
              1,
              Number(
                value ||
                1
              )
            );

          const perBedRent =
            Number(
              property
                ?.rentPerBed ||
              0
            );

          setFormData(
            (
              current
            ) => ({
              ...current,

              numberOfBeds:
                beds,

              requestedMonthlyRent:
                perBedRent *
                beds,
            })
          );

          return;
        }

        setFormData(
          (
            current
          ) => ({
            ...current,

            [name]:
              value,
          })
        );
      };

    /* =======================================================
       SUBMIT
    ======================================================= */

    const handleSubmit =
      async (
        event
      ) => {

        event.preventDefault();

        try {

          if (!property) {
            throw new Error(
              "Property is not available."
            );
          }

          if (
            isPG &&
            Number(
              property.availableBeds ||
              0
            ) < 1
          ) {
            throw new Error(
              "No PG beds are currently available."
            );
          }

          if (
            isPG &&
            Number(
              formData
                .numberOfBeds
            ) >
            Number(
              property
                .availableBeds ||
              0
            )
          ) {
            throw new Error(
              `Only ${
                property
                  .availableBeds
              } bed(s) are available.`
            );
          }

          setSubmitting(
            true
          );

          const tenant =
            getTenantUser();

          if (!tenant) {
            throw new Error(
              "Tenant session not found. Please login again."
            );
          }

          const payload = {

            propertyId:
              Number(
                propertyId
              ),

            tenantId:
              String(
                tenant.id ||
                tenant.userId ||
                tenant.email
              ),

            tenantName:
              tenant.name ||
              tenant.fullName ||
              "Tenant",

            tenantEmail:
              tenant.email ||
              "",

            tenantPhone:
              tenant.phone ||
              "",

            tenantOccupation:
              tenant.occupation ||
              "",

            requestedMonthlyRent:
              Number(
                formData
                  .requestedMonthlyRent
              ),

            requestedMoveInDate:
              formData
                .requestedMoveInDate,

            durationMonths:
              Number(
                formData
                  .durationMonths
              ),

            numberOfOccupants:
              Number(
                formData
                  .numberOfOccupants
              ),

            numberOfBeds:
              isPG
                ? Number(
                    formData
                      .numberOfBeds
                  )
                : null,

            tenantMessage:
              formData
                .tenantMessage,

            negotiationId:
              negotiationData
                .negotiationId ||
              null,
          };

          console.log(
            "CREATE BOOKING PAYLOAD:",
            payload
          );

          await createBooking(
            payload
          );

          toast.success(
            "Booking request submitted successfully."
          );

          navigate(
            "/tenant/bookings"
          );

        } catch (
          error
        ) {

          console.error(
            "BOOKING ERROR:",
            error
          );

          toast.error(
            error.message ||
            "Unable to submit booking."
          );

        } finally {

          setSubmitting(
            false
          );
        }
      };

    /* =======================================================
       LOADING
    ======================================================= */

    if (loading) {

      return (
        <div className="container py-5 text-center">

          <div className="spinner-border text-primary" />

          <p className="mt-3">
            Loading property...
          </p>

        </div>
      );
    }

    if (!property) {

      return (
        <div className="container py-5">

          <div className="alert alert-danger">
            Property could not
            be loaded.
          </div>

        </div>
      );
    }

    const availableBeds =
      Number(
        property.availableBeds ||
        0
      );

    const rentPerBed =
      Number(
        property.rentPerBed ||
        0
      );

    return (
      <div className="container-fluid py-4">

        <div className="card border-0 shadow-sm rounded-4 p-4">

          <h2 className="fw-bold">
            Request Booking
          </h2>

          <h4>
            {
              property.title
            }
          </h4>

          <p className="text-muted">
            {property.area},{" "}
            {property.city}
          </p>

          {/* ===============================================
              PG INFORMATION
          =============================================== */}

          {isPG && (

            <div className="alert alert-info">

              <div className="row text-center">

                <div className="col-md-4">

                  <strong className="fs-4">
                    {property.totalBeds ||
                      0}
                  </strong>

                  <div>
                    Total Beds
                  </div>

                </div>

                <div className="col-md-4">

                  <strong className="fs-4 text-success">
                    {availableBeds}
                  </strong>

                  <div>
                    Available Beds
                  </div>

                </div>

                <div className="col-md-4">

                  <strong className="fs-4">
                    {formatCurrency(
                      rentPerBed
                    )}
                  </strong>

                  <div>
                    Per Bed / Month
                  </div>

                </div>

              </div>

            </div>

          )}

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* =============================================
                PG BED COUNT
            ============================================= */}

            {isPG && (

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Number of Beds *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="numberOfBeds"
                  value={
                    formData
                      .numberOfBeds
                  }
                  min={
                    isVilla
                      ? Number(property?.minimumStayDays || 1)
                      : 1
                  }
                  max={
                    availableBeds
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <small className="text-muted">
                  {availableBeds} bed(s)
                  currently available.
                </small>

              </div>

            )}

            {/* =============================================
                RENT
            ============================================= */}

            <div className="mb-3">

              <label className="form-label fw-semibold">

                {isPG
                  ? "Total Monthly Rent"
                  : isVilla
                    ? "Requested Daily Rent"
                    : "Requested Monthly Rent"}

              </label>

              <input
                type="number"
                className="form-control"
                name="requestedMonthlyRent"
                value={
                  formData
                    .requestedMonthlyRent
                }
                onChange={
                  handleChange
                }
                readOnly={
                  isPG ||
                  Boolean(
                    negotiationData
                      .agreedRent
                  )
                }
                required
              />

              {isPG && (

                <small className="text-muted">

                  {formatCurrency(
                    rentPerBed
                  )}

                  {" × "}

                  {
                    formData
                      .numberOfBeds
                  }

                  {" bed(s) = "}

                  <strong>

                    {formatCurrency(
                      formData
                        .requestedMonthlyRent
                    )}

                    /month

                  </strong>

                </small>

              )}

            </div>

            {/* =============================================
                MOVE-IN
            ============================================= */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Move-in Date *
              </label>

              <input
                type="date"
                className="form-control"
                name="requestedMoveInDate"
                value={
                  formData
                    .requestedMoveInDate
                }
                onChange={
                  handleChange
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                required
              />

            </div>

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  {isVilla
                    ? "Duration in Days *"
                    : "Duration in Months *"}
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="durationMonths"
                  value={
                    formData
                      .durationMonths
                  }
                  onChange={
                    handleChange
                  }
                  min="1"
                  max={
                    isVilla
                      ? Number(property?.maximumStayDays || 365)
                      : 60
                  }
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Number of Occupants *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="numberOfOccupants"
                  value={
                    formData
                      .numberOfOccupants
                  }
                  onChange={
                    handleChange
                  }
                  min="1"
                  max="20"
                  required
                />

              </div>

            </div>

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Message
              </label>

              <textarea
                className="form-control"
                rows="4"
                name="tenantMessage"
                value={
                  formData
                    .tenantMessage
                }
                onChange={
                  handleChange
                }
                placeholder="Any message for the landlord..."
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                submitting ||
                (
                  isPG &&
                  availableBeds < 1
                )
              }
            >

              {submitting
                ? "Submitting..."
                : isPG &&
                  availableBeds < 1
                ? "No Beds Available"
                : "Submit Booking Request"}

            </button>

          </form>

        </div>

      </div>
    );
  };

export default TenantBookingRequest;
