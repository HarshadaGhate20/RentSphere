import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaCheckCircle,
  FaClock,
  FaExchangeAlt,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getTenantNegotiations,
  acceptCounterOffer,
  cancelNegotiation,
} from "../../services/negotiationApi";

import {
  getTenantUser,
} from "../../utils/sessionUser";

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (amount) =>
  `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

/* =========================================================
   COMPONENT
========================================================= */

const TenantNegotiations = () => {
  const navigate =
    useNavigate();

  const [
    negotiations,
    setNegotiations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================================================
     LOAD TENANT NEGOTIATIONS
  ========================================================= */

  const loadNegotiations =
    async () => {
      try {
        setLoading(true);
        setError("");

        const tenant =
          getTenantUser();

        /*
         * In your current RentSphere
         * integration, email is being
         * used as tenant ID.
         */
        const tenantId =
          tenant.email ||
          tenant.id;

        console.log(
          "TENANT ID FOR NEGOTIATIONS:",
          tenantId
        );

        const data =
          await getTenantNegotiations(
            tenantId
          );

        console.log(
          "TENANT NEGOTIATIONS RESPONSE:",
          data
        );

        setNegotiations(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (
        loadError
      ) {
        console.error(
          "TENANT NEGOTIATIONS ERROR:",
          loadError
        );

        setError(
          loadError.message ||
            "Unable to load negotiations."
        );

        setNegotiations([]);
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     LOAD WHEN PAGE OPENS
  ========================================================= */

  useEffect(() => {
    loadNegotiations();
  }, []);

  /* =========================================================
     TENANT ACCEPTS COUNTER OFFER
  ========================================================= */

  const handleAcceptCounter =
    async (
      negotiationId
    ) => {
      try {
        setError("");

        const confirmed =
          window.confirm(
            "Do you want to accept the landlord's counter-offer?"
          );

        if (!confirmed) {
          return;
        }

        await acceptCounterOffer(
          negotiationId
        );

        await loadNegotiations();
      } catch (
        actionError
      ) {
        console.error(
          "ACCEPT COUNTER ERROR:",
          actionError
        );

        setError(
          actionError.message ||
            "Unable to accept counter offer."
        );
      }
    };

  /* =========================================================
     TENANT CANCELS NEGOTIATION
  ========================================================= */

  const handleCancel =
    async (
      negotiationId
    ) => {
      try {
        setError("");

        const confirmed =
          window.confirm(
            "Are you sure you want to cancel this negotiation?"
          );

        if (!confirmed) {
          return;
        }

        await cancelNegotiation(
          negotiationId
        );

        await loadNegotiations();
      } catch (
        actionError
      ) {
        console.error(
          "CANCEL NEGOTIATION ERROR:",
          actionError
        );

        setError(
          actionError.message ||
            "Unable to cancel negotiation."
        );
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="container py-5">

        <div className="text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h4 className="mt-3">
            Loading negotiations...
          </h4>

        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="container py-4">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-4">

        <small className="text-primary fw-bold">
          RENT NEGOTIATIONS
        </small>

        <h1 className="mt-2">
          My Negotiations
        </h1>

        <p className="text-muted">
          Track your offers,
          landlord responses and
          final agreed monthly rent.
        </p>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="alert alert-danger">

          {error}

          <div className="mt-2">

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={
                loadNegotiations
              }
            >
              Try Again
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {negotiations.length ===
      0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">

          <FaExchangeAlt
            size={45}
            className="text-primary mb-3"
          />

          <h3>
            No negotiations found
          </h3>

          <p className="text-muted">
            Your rent offers will
            appear here after you
            negotiate a property.
          </p>

          <div>

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

        </div>
      ) : (

        /* ===================================================
           NEGOTIATION LIST
        =================================================== */

        <div className="row g-4">

          {negotiations.map(
            (negotiation) => {

              /* =============================================
                 NORMALIZE STATUS
              ============================================= */

              const status =
                String(
                  negotiation.status ||
                    ""
                ).toUpperCase();

              /* =============================================
                 TENANT OFFER
              ============================================= */

              const tenantOffer =
                negotiation
                  .tenantProposedRent ??
                negotiation
                  .proposedRent ??
                negotiation
                  .offeredRent ??
                0;

              /* =============================================
                 LANDLORD COUNTER
              ============================================= */

              const counterOffer =
                negotiation
                  .landlordCounterRent ??
                negotiation
                  .counterOffer ??
                null;

              /* =============================================
                 FINAL AGREED RENT
              ============================================= */

              const agreedRent =
                negotiation
                  .agreedRent ??
                negotiation
                  .approvedRent ??
                null;

              return (
                <div
                  className="col-lg-6"
                  key={
                    negotiation.id
                  }
                >

                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

                    {/* =======================================
                        CARD HEADER
                    ======================================= */}

                    <div className="d-flex justify-content-between align-items-start gap-3">

                      <div>

                        <small className="text-primary fw-bold">
                          NEGOTIATION #
                          {
                            negotiation.id
                          }
                        </small>

                        <h3 className="mt-2">
                          {
                            negotiation.propertyTitle
                          }
                        </h3>

                        <small className="text-muted">
                          Property ID:{" "}
                          {
                            negotiation.propertyId
                          }
                        </small>

                      </div>

                      {/* STATUS BADGE */}

                      <span
                        className={`badge ${
                          status ===
                          "ACCEPTED"
                            ? "bg-success"

                            : status ===
                              "COUNTERED"
                            ? "bg-primary"

                            : status ===
                              "REJECTED"
                            ? "bg-danger"

                            : status ===
                              "CANCELLED"
                            ? "bg-secondary"

                            : "bg-warning text-dark"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    <hr />

                    {/* =======================================
                        RENT DETAILS
                    ======================================= */}

                    <div className="row g-3">

                      {/* LISTED RENT */}

                      <div className="col-md-6">

                        <small className="text-muted">
                          Listed Rent
                        </small>

                        <h5>
                          {formatCurrency(
                            negotiation.listedRent
                          )}
                        </h5>

                      </div>

                      {/* TENANT OFFER */}

                      <div className="col-md-6">

                        <small className="text-muted">
                          Your Offer
                        </small>

                        <h5>
                          {formatCurrency(
                            tenantOffer
                          )}
                        </h5>

                      </div>

                      {/* COUNTER OFFER */}

                      {counterOffer && (
                        <div className="col-md-6">

                          <small className="text-muted">
                            Landlord Counter
                          </small>

                          <h5 className="text-primary">
                            {formatCurrency(
                              counterOffer
                            )}
                          </h5>

                        </div>
                      )}

                      {/* AGREED RENT */}

                      {agreedRent && (
                        <div className="col-md-6">

                          <small className="text-muted">
                            Final Agreed Rent
                          </small>

                          <h5 className="text-success">
                            {formatCurrency(
                              agreedRent
                            )}
                          </h5>

                        </div>
                      )}

                    </div>

                    {/* =======================================
                        TENANT MESSAGE
                    ======================================= */}

                    {negotiation
                      .tenantMessage && (
                      <div className="mt-4">

                        <small className="text-muted">
                          Your Message
                        </small>

                        <p className="mb-0 mt-1">
                          {
                            negotiation.tenantMessage
                          }
                        </p>

                      </div>
                    )}

                    {/* =======================================
                        LANDLORD RESPONSE
                    ======================================= */}

                    {negotiation
                      .landlordMessage && (
                      <div className="alert alert-light border mt-4">

                        <strong>
                          Landlord Response
                        </strong>

                        <p className="mb-0 mt-2">
                          {
                            negotiation.landlordMessage
                          }
                        </p>

                      </div>
                    )}

                    {/* =======================================
                        ACCEPTED
                    ======================================= */}

                    {status ===
                      "ACCEPTED" && (
                      <div className="mt-3">

                        <div className="alert alert-success mb-3">

                          <FaCheckCircle className="me-2" />

                          Your rent offer
                          has been accepted
                          by the landlord.

                          <div className="mt-2">

                            <strong>
                              Agreed Rent:{" "}
                              {formatCurrency(
                                agreedRent ||
                                  tenantOffer
                              )}
                              /month
                            </strong>

                          </div>

                        </div>

                        {/* =================================
                            PROCEED TO BOOKING
                        ================================= */}

                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={() =>
                            navigate(
                              `/tenant/bookings/new/${negotiation.propertyId}`,
                              {
                                state: {
                                  negotiationId:
                                    negotiation.id,

                                  propertyId:
                                    negotiation.propertyId,

                                  agreedRent:
                                    agreedRent ||
                                    tenantOffer,

                                  negotiationStatus:
                                    status,

                                  propertyTitle:
                                    negotiation.propertyTitle,

                                  listedRent:
                                    negotiation.listedRent,
                                },
                              }
                            )
                          }
                        >
                          Proceed to Booking
                        </button>

                      </div>
                    )}

                    {/* =======================================
                        COUNTERED
                    ======================================= */}

                    {status ===
                      "COUNTERED" && (
                      <div className="mt-3">

                        <div className="alert alert-primary">

                          <FaExchangeAlt className="me-2" />

                          The landlord sent
                          you a counter
                          offer.

                          {counterOffer && (
                            <div className="mt-2">

                              <strong>
                                Counter Rent:{" "}
                                {formatCurrency(
                                  counterOffer
                                )}
                                /month
                              </strong>

                            </div>
                          )}

                        </div>

                        <div className="d-flex flex-wrap gap-2">

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                              handleAcceptCounter(
                                negotiation.id
                              )
                            }
                          >
                            <FaCheckCircle className="me-2" />

                            Accept Counter
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleCancel(
                                negotiation.id
                              )
                            }
                          >
                            <FaTimesCircle className="me-2" />

                            Reject / Cancel
                          </button>

                        </div>

                      </div>
                    )}

                    {/* =======================================
                        PENDING
                    ======================================= */}

                    {status ===
                      "PENDING" && (
                      <div className="mt-3">

                        <div className="alert alert-warning mb-3">

                          <FaClock className="me-2" />

                          Waiting for
                          landlord response.

                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleCancel(
                              negotiation.id
                            )
                          }
                        >
                          Cancel Negotiation
                        </button>

                      </div>
                    )}

                    {/* =======================================
                        REJECTED
                    ======================================= */}

                    {status ===
                      "REJECTED" && (
                      <div className="alert alert-danger mt-3 mb-0">

                        <FaTimesCircle className="me-2" />

                        The landlord
                        rejected this rent
                        proposal.

                      </div>
                    )}

                    {/* =======================================
                        CANCELLED
                    ======================================= */}

                    {status ===
                      "CANCELLED" && (
                      <div className="alert alert-secondary mt-3 mb-0">

                        <FaTimesCircle className="me-2" />

                        This negotiation
                        was cancelled.

                      </div>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default TenantNegotiations;