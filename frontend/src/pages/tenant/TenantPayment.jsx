import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  getBookingById,
} from "../../services/bookingApi";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentApi";

/* =========================================================
   RAZORPAY SCRIPT
========================================================= */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    /*
     * Already loaded
     */
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    /*
     * Avoid adding script twice.
     */
    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true)
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false)
      );

      return;
    }

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async =
      true;

    script.onload =
      () => {
        console.log(
          "Razorpay checkout script loaded."
        );

        resolve(true);
      };

    script.onerror =
      () => {
        console.error(
          "Unable to load Razorpay checkout script."
        );

        resolve(false);
      };

    document.body.appendChild(
      script
    );
  });
};

/* =========================================================
   CURRENCY
========================================================= */

const formatCurrency = (
  amount
) =>
  `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

/* =========================================================
   COMPONENT
========================================================= */

const TenantPayment = () => {
  const {
    bookingId,
  } =
    useParams();

  const navigate =
    useNavigate();

  const [
    booking,
    setBooking,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    paying,
    setPaying,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  /* =========================================================
     LOAD BOOKING
  ========================================================= */

  useEffect(() => {
    const loadBooking =
      async () => {
        if (
          !bookingId ||
          bookingId ===
            "undefined" ||
          bookingId ===
            "null"
        ) {
          setError(
            "Booking ID is missing."
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

          setError(
            ""
          );

          console.log(
            "PAYMENT PAGE BOOKING ID:",
            bookingId
          );

          const data =
            await getBookingById(
              bookingId
            );

          console.log(
            "PAYMENT BOOKING RESPONSE:",
            data
          );

          setBooking(
            data
          );
        } catch (
          loadError
        ) {
          console.error(
            "BOOKING LOAD ERROR:",
            loadError
          );

          const message =
            loadError.message ||
            "Unable to load booking.";

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
      };

    loadBooking();
  }, [bookingId]);

  /* =========================================================
     START PAYMENT
  ========================================================= */

  const handlePayment =
    async () => {
      try {
        if (!bookingId) {
          throw new Error(
            "Booking ID is missing."
          );
        }

        if (!booking) {
          throw new Error(
            "Booking information is unavailable."
          );
        }

        setPaying(
          true
        );

        /* ===============================================
           STEP 1: LOAD RAZORPAY SCRIPT
        =============================================== */

        const scriptLoaded =
          await loadRazorpayScript();

        if (!scriptLoaded) {
          throw new Error(
            "Unable to load Razorpay checkout. Check your internet connection."
          );
        }

        if (
          !window.Razorpay
        ) {
          throw new Error(
            "Razorpay checkout is unavailable."
          );
        }

        /* ===============================================
           STEP 2: CREATE ORDER
        =============================================== */

        console.log(
          "CREATING PAYMENT ORDER:",
          bookingId
        );

        const order =
          await createPaymentOrder(
            bookingId
          );

        console.log(
          "PAYMENT ORDER:",
          order
        );

        if (!order) {
          throw new Error(
            "Payment order response is empty."
          );
        }

        /*
         * Your backend response:
         *
         * paymentRecordId
         * bookingId
         * razorpayOrderId
         * razorpayKeyId
         * amountInPaise
         */

        const razorpayOrderId =
          order.razorpayOrderId;

        const razorpayKeyId =
          order.razorpayKeyId;

        const amountInPaise =
          Number(
            order.amountInPaise
          );

        const currency =
          order.currency ||
          "INR";

        /* ===============================================
           VALIDATE ORDER
        =============================================== */

        if (
          !razorpayOrderId
        ) {
          console.error(
            "ORDER RESPONSE:",
            order
          );

          throw new Error(
            "Razorpay order ID is missing."
          );
        }

        if (
          !razorpayKeyId
        ) {
          console.error(
            "ORDER RESPONSE:",
            order
          );

          throw new Error(
            "Razorpay Key ID is missing."
          );
        }

        if (
          !amountInPaise ||
          amountInPaise <= 0
        ) {
          throw new Error(
            "Invalid Razorpay payment amount."
          );
        }

        console.log(
          "OPENING RAZORPAY:",
          {
            razorpayOrderId,
            razorpayKeyId,
            amountInPaise,
            currency,
          }
        );

        /* ===============================================
           STEP 3: CHECKOUT OPTIONS
        =============================================== */

        const options = {
          key:
            razorpayKeyId,

          amount:
            amountInPaise,

          currency,

          name:
            "RentSphere",

          description:
            `Rental payment for ${
              booking.propertyTitle ||
              "property"
            }`,

          order_id:
            razorpayOrderId,

          method: {
            netbanking: true,
            card: false,
            upi: false,
            wallet: false,
            emi: false,
            paylater: false,
          },

          config: {
            display: {
              blocks: {
                banks: {
                  name: "Pay using Netbanking",
                  instruments: [{ method: "netbanking" }],
                },
              },
              sequence: ["block.banks"],
              preferences: { show_default_blocks: false },
            },
          },

          /* =============================================
             SUCCESS HANDLER
          ============================================= */

          handler:
            async (
              razorpayResponse
            ) => {
              console.log(
                "RAZORPAY SUCCESS RESPONSE:",
                razorpayResponse
              );

              try {
                /*
                 * Razorpay normally returns:
                 *
                 * razorpay_payment_id
                 * razorpay_order_id
                 * razorpay_signature
                 */

                const verificationData =
                  {
                    bookingId:
                      bookingId,

                    razorpayOrderId:
                      razorpayResponse
                        .razorpay_order_id,

                    razorpayPaymentId:
                      razorpayResponse
                        .razorpay_payment_id,

                    razorpaySignature:
                      razorpayResponse
                        .razorpay_signature,
                  };

                console.log(
                  "VERIFY PAYMENT PAYLOAD:",
                  verificationData
                );

                const verificationResponse =
                  await verifyPayment(
                    verificationData
                  );

                console.log(
                  "PAYMENT VERIFICATION RESPONSE:",
                  verificationResponse
                );

                toast.success(
                  "Payment completed successfully."
                );

                /* =======================================
                   REDIRECT ONLY AFTER VERIFICATION
                ======================================= */

                navigate(
                  `/tenant/payment-success/${bookingId}`,
                  {
                    replace:
                      true,

                    state: {
                      bookingId,

                      payment:
                        verificationResponse,

                      razorpayPaymentId:
                        razorpayResponse
                          .razorpay_payment_id,

                      razorpayOrderId:
                        razorpayResponse
                          .razorpay_order_id,
                    },
                  }
                );
              } catch (
                verificationError
              ) {
                console.error(
                  "PAYMENT VERIFICATION ERROR:",
                  verificationError
                );

                toast.error(
                  verificationError.message ||
                  "Payment was received but verification failed."
                );
              }
            },

          /* =============================================
             CUSTOMER DETAILS
          ============================================= */

          prefill: {
            name:
              booking.tenantName ||
              "",

            email:
              booking.tenantEmail ||
              "",

            // Razorpay only honours hidden.contact when a valid contact
            // value is supplied. This test-mode value is never shown.
            contact:
              process.env.REACT_APP_RAZORPAY_CONTACT ||
              "+919000090000",
          },

          hidden: {
            contact: true,
          },

          readonly: {
            contact: true,
          },

          notes: {
            bookingId:
              bookingId,

            propertyId:
              String(
                booking.propertyId ||
                ""
              ),
          },

          theme: {
            color:
              "#2563eb",
          },

          modal: {
            ondismiss:
              () => {
                console.log(
                  "Razorpay checkout closed by user."
                );

                setPaying(
                  false
                );
              },
          },
        };

        /* ===============================================
           STEP 4: CREATE CHECKOUT
        =============================================== */

        const razorpay =
          new window.Razorpay(
            options
          );

        /* ===============================================
           FAILURE HANDLER
        =============================================== */

        razorpay.on(
          "payment.failed",
          (
            response
          ) => {
            console.error(
              "RAZORPAY PAYMENT FAILED:",
              response
            );

            const message =
              response.error
                ?.description ||
              response.error
                ?.reason ||
              "Payment failed.";

            toast.error(
              message
            );

            setPaying(
              false
            );
          }
        );

        /* ===============================================
           STEP 5: OPEN RAZORPAY
        =============================================== */

        razorpay.open();

        console.log(
          "Razorpay popup requested."
        );
      } catch (
        paymentError
      ) {
        console.error(
          "PAYMENT START ERROR:",
          paymentError
        );

        toast.error(
          paymentError.message ||
          "Unable to start payment."
        );

        setPaying(
          false
        );
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading payment...
        </p>

      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (
    error ||
    !booking
  ) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">

          {error ||
            "Booking could not be loaded."}

        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/tenant/bookings"
            )
          }
        >
          Back to My Bookings
        </button>

      </div>
    );
  }

  /* =========================================================
     PAYMENT VALUES
  ========================================================= */

  const rent =
    Number(
      booking.approvedMonthlyRent ||
      booking.requestedMonthlyRent ||
      booking.rentalAmount ||
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

  const calculatedTotal =
    rent +
    securityDeposit +
    maintenanceCharge;

  const totalPayable =
    Number(
      booking.totalPayable ||
      calculatedTotal
    );

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="container py-5">

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-4">

          <h2 className="fw-bold mb-2">
            Complete Payment
          </h2>

          <h4>
            {
              booking.propertyTitle
            }
          </h4>

          <p className="text-muted">
            Booking ID:{" "}
            <strong>
              {bookingId}
            </strong>
          </p>

          <hr />

          <div className="row g-3">

            <div className="col-md-4">

              <small className="text-muted">
                Approved Rent
              </small>

              <h5>
                {formatCurrency(
                  rent
                )}
              </h5>

            </div>

            <div className="col-md-4">

              <small className="text-muted">
                Security Deposit
              </small>

              <h5>
                {formatCurrency(
                  securityDeposit
                )}
              </h5>

            </div>

            <div className="col-md-4">

              <small className="text-muted">
                Maintenance
              </small>

              <h5>
                {formatCurrency(
                  maintenanceCharge
                )}
              </h5>

            </div>

          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center">

            <span className="fs-5 fw-bold">
              Total Payable
            </span>

            <span className="fs-3 fw-bold text-success">
              {formatCurrency(
                totalPayable
              )}
            </span>

          </div>

          <button
            type="button"
            className="btn btn-success w-100 mt-4 py-3"
            disabled={
              paying
            }
            onClick={
              handlePayment
            }
          >
            {paying
              ? "Opening Razorpay..."
              : `Pay ${formatCurrency(
                  totalPayable
                )} with Razorpay`}
          </button>

        </div>

      </div>

    </div>
  );
};

export default TenantPayment;
