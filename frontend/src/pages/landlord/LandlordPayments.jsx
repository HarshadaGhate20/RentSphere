import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBuilding,
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaRedoAlt,
  FaSearch,
  FaUser,
} from "react-icons/fa";

import {
  toast,
} from "react-toastify";

import {
  getLandlordPayments,
} from "../../services/paymentApi";

import {
  getLandlordUser,
} from "../../utils/sessionUser";

/* =========================================================
   FORMAT MONEY
========================================================= */

const formatCurrency = (
  value
) =>
  `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
  value
) => {
  if (!value) {
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  );
};

/* =========================================================
   STATUS CLASS
========================================================= */

const getStatusClass = (
  status
) => {
  const value =
    String(
      status || ""
    ).toUpperCase();

  switch (value) {
    case "PAID":
    case "SUCCESS":
    case "COMPLETED":
    case "VERIFIED":
      return "bg-success";

    case "FAILED":
    case "REJECTED":
      return "bg-danger";

    case "PENDING":
      return "bg-warning text-dark";

    default:
      return "bg-secondary";
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const LandlordPayments = () => {
  const [
    payments,
    setPayments,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  /* =========================================================
     RESOLVE LANDLORD
  ========================================================= */

  const landlord =
    useMemo(
      () =>
        getLandlordUser(),
      []
    );

  /*
   * IMPORTANT:
   *
   * Use the SAME identifier that was stored in:
   *
   * property.landlordId
   * booking.landlordId
   * payment.landlordId
   *
   * If your project stores landlord email as landlordId,
   * this fallback supports that too.
   */
  const landlordId =
    useMemo(
      () =>
        landlord?.id ||
        landlord?.userId ||
        landlord?.email ||
        "",
      [
        landlord,
      ]
    );

  /* =========================================================
     LOAD PAYMENTS
  ========================================================= */

  const loadPayments =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          console.log(
            "LANDLORD SESSION:",
            landlord
          );

          console.log(
            "LANDLORD ID USED FOR PAYMENTS:",
            landlordId
          );

          if (
            !landlordId
          ) {
            throw new Error(
              "Landlord session is missing. Please log in again."
            );
          }

          const data =
            await getLandlordPayments(
              landlordId
            );

          console.log(
            "LANDLORD PAYMENTS RESPONSE:",
            data
          );

          setPayments(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          loadError
        ) {
          console.error(
            "LANDLORD PAYMENT LOAD ERROR:",
            loadError
          );

          const message =
            loadError.message ||
            "Unable to load payments.";

          setError(
            message
          );

          toast.error(
            message
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        landlord,
        landlordId,
      ]
    );

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredPayments =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        if (!term) {
          return payments;
        }

        return payments.filter(
          (
            payment
          ) => {
            const values = [
              payment.id,
              payment.paymentId,
              payment.bookingId,

              payment.propertyTitle,
              payment.propertyArea,
              payment.propertyCity,

              payment.tenantName,
              payment.tenantEmail,

              payment.status,
              payment.paymentStatus,

              payment.razorpayPaymentId,
              payment.razorpayOrderId,
            ];

            return values
              .filter(
                Boolean
              )
              .some(
                (
                  value
                ) =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      term
                    )
              );
          }
        );
      },
      [
        payments,
        search,
      ]
    );

  /* =========================================================
     TOTALS
  ========================================================= */

  const statistics =
    useMemo(
      () => {
        let totalAmount =
          0;

        let successful =
          0;

        let pending =
          0;

        payments.forEach(
          (
            payment
          ) => {
            const status =
              String(
                payment.status ||
                payment.paymentStatus ||
                ""
              ).toUpperCase();

            if (
              [
                "PAID",
                "SUCCESS",
                "COMPLETED",
                "VERIFIED",
              ].includes(
                status
              )
            ) {
              successful +=
                1;

              totalAmount +=
                Number(
                  payment.amount ||
                  payment.paymentAmount ||
                  payment.totalAmount ||
                  payment.totalPayable ||
                  0
                );
            }

            if (
              status ===
              "PENDING"
            ) {
              pending +=
                1;
            }
          }
        );

        return {
          total:
            payments.length,

          successful,

          pending,

          totalAmount,
        };
      },
      [
        payments,
      ]
    );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading payments...
        </p>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="container-fluid py-4 px-lg-4">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="d-flex justify-content-between align-items-start mb-4">

        <div>

          <small className="text-primary fw-bold">
            PAYMENT MANAGEMENT
          </small>

          <h1 className="fw-bold mt-2">
            Landlord Payments
          </h1>

          <p className="text-muted mb-0">
            Track tenant payments,
            booking payments and
            received revenue.
          </p>

        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={
            loadPayments
          }
        >
          <FaRedoAlt className="me-2" />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SESSION INFORMATION
      ===================================================== */}

      <div className="alert alert-light border mb-4">

        <strong>
          Logged-in Landlord:
        </strong>{" "}

        {landlord?.name ||
          "Landlord"}

        <span className="text-muted ms-2">
          (
          {landlordId}
          )
        </span>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="alert alert-danger">

          <strong>
            Unable to load payments.
          </strong>

          <div className="mt-1">
            {error}
          </div>

          <button
            type="button"
            className="btn btn-danger mt-3"
            onClick={
              loadPayments
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="row g-3 mb-4">

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

            <FaCreditCard
              className="text-primary mb-3"
              size={28}
            />

            <small className="text-muted">
              Total Payments
            </small>

            <h2 className="fw-bold mb-0">
              {
                statistics.total
              }
            </h2>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

            <FaCheckCircle
              className="text-success mb-3"
              size={28}
            />

            <small className="text-muted">
              Successful
            </small>

            <h2 className="fw-bold mb-0">
              {
                statistics.successful
              }
            </h2>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

            <FaMoneyBillWave
              className="text-warning mb-3"
              size={28}
            />

            <small className="text-muted">
              Pending
            </small>

            <h2 className="fw-bold mb-0">
              {
                statistics.pending
              }
            </h2>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

            <FaMoneyBillWave
              className="text-success mb-3"
              size={28}
            />

            <small className="text-muted">
              Total Received
            </small>

            <h3 className="fw-bold mb-0 text-success">
              {formatCurrency(
                statistics
                  .totalAmount
              )}
            </h3>

          </div>

        </div>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">

        <div className="input-group">

          <span className="input-group-text bg-white border-end-0">
            <FaSearch />
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search booking, tenant, property or payment..."
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
          />

        </div>

      </div>

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!error &&
      filteredPayments.length ===
        0 ? (

        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">

          <FaCreditCard
            size={50}
            className="text-primary mx-auto mb-3"
          />

          <h3>
            No payments found
          </h3>

          <p className="text-muted mb-0">
            Tenant payments for your
            properties will appear here.
          </p>

        </div>

      ) : (

        /* ===================================================
           PAYMENT CARDS
        =================================================== */

        <div className="row g-4">

          {filteredPayments.map(
            (
              payment,
              index
            ) => {

              const paymentStatus =
                payment.status ||
                payment.paymentStatus ||
                "PENDING";

              const amount =
                payment.amount ||
                payment.paymentAmount ||
                payment.totalAmount ||
                payment.totalPayable ||
                0;

              return (
                <div
                  className="col-xl-6"
                  key={
                    payment.id ||
                    payment.paymentId ||
                    payment.bookingId ||
                    index
                  }
                >

                  <div className="card border-0 shadow-sm rounded-4 h-100">

                    <div className="card-body p-4">

                      {/* HEADER */}

                      <div className="d-flex justify-content-between align-items-start mb-3">

                        <div>

                          <small className="text-primary fw-bold">
                            PAYMENT #
                            {payment.id ||
                              payment.paymentId ||
                              index +
                                1}
                          </small>

                          <h4 className="fw-bold mt-2 mb-1">

                            {payment.propertyTitle ||
                              "Rental Property"}

                          </h4>

                        </div>

                        <span
                          className={`badge ${getStatusClass(
                            paymentStatus
                          )}`}
                        >
                          {
                            paymentStatus
                          }
                        </span>

                      </div>

                      {/* PROPERTY */}

                      <div className="bg-light rounded-3 p-3 mb-3">

                        <div className="d-flex align-items-center">

                          <FaBuilding className="text-primary me-3" />

                          <div>

                            <small className="text-muted d-block">
                              Booking
                            </small>

                            <strong>
                              {payment.bookingId ||
                                "Not available"}
                            </strong>

                          </div>

                        </div>

                      </div>

                      {/* TENANT */}

                      <div className="d-flex align-items-center mb-3">

                        <FaUser className="me-3" />

                        <div>

                          <small className="text-muted d-block">
                            Tenant
                          </small>

                          <strong>
                            {payment.tenantName ||
                              "Tenant"}
                          </strong>

                          {payment.tenantEmail && (
                            <div className="small text-muted">
                              {
                                payment.tenantEmail
                              }
                            </div>
                          )}

                        </div>

                      </div>

                      <hr />

                      {/* AMOUNT */}

                      <div className="d-flex justify-content-between mb-3">

                        <span className="text-muted">
                          Amount Received
                        </span>

                        <strong className="fs-5 text-success">
                          {formatCurrency(
                            amount
                          )}
                        </strong>

                      </div>

                      {/* PAYMENT ID */}

                      {payment.razorpayPaymentId && (

                        <div className="mb-2">

                          <small className="text-muted">
                            Razorpay Payment ID
                          </small>

                          <div>
                            {
                              payment.razorpayPaymentId
                            }
                          </div>

                        </div>

                      )}

                      {/* ORDER ID */}

                      {payment.razorpayOrderId && (

                        <div className="mb-2">

                          <small className="text-muted">
                            Razorpay Order ID
                          </small>

                          <div>
                            {
                              payment.razorpayOrderId
                            }
                          </div>

                        </div>

                      )}

                      {/* DATE */}

                      <div>

                        <small className="text-muted">
                          Payment Date
                        </small>

                        <div>
                          {formatDate(
                            payment.paymentDate ||
                            payment.paidAt ||
                            payment.createdAt
                          )}
                        </div>

                      </div>

                    </div>

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

export default LandlordPayments;