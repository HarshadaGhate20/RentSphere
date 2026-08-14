import {
  API_BASE_URLS,
} from "../config/api";

import {
  apiRequest,
} from "./apiClient";

const PAYMENT_API =
  `${API_BASE_URLS.payment}/payments`;

/* =========================================================
   VALIDATION
========================================================= */

const requireBookingId = (
  bookingId
) => {
  if (
    bookingId ===
      undefined ||
    bookingId ===
      null ||
    String(
      bookingId
    ).trim() === "" ||
    String(
      bookingId
    ) ===
      "undefined" ||
    String(
      bookingId
    ) ===
      "null"
  ) {
    throw new Error(
      "Booking ID is required."
    );
  }

  return String(
    bookingId
  );
};

/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */

export const createPaymentOrder =
  async (
    bookingId
  ) => {
    const validBookingId =
      requireBookingId(
        bookingId
      );

    console.log(
      "CREATING PAYMENT ORDER:",
      validBookingId
    );

    return apiRequest(
      `${PAYMENT_API}/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            bookingId:
              validBookingId,
          }),
      }
    );
  };

/* =========================================================
   VERIFY RAZORPAY PAYMENT
========================================================= */

export const verifyPayment =
  async ({
    bookingId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) => {
    const validBookingId =
      requireBookingId(
        bookingId
      );

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      throw new Error(
        "Payment verification details are incomplete."
      );
    }

    return apiRequest(
      `${PAYMENT_API}/verify`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            bookingId:
              validBookingId,

            razorpayOrderId,

            razorpayPaymentId,

            razorpaySignature,
          }),
      }
    );
  };

/* =========================================================
   GET PAYMENT BY BOOKING
========================================================= */

export const getPaymentByBookingId =
  async (
    bookingId
  ) => {
    const validBookingId =
      requireBookingId(
        bookingId
      );

    return apiRequest(
      `${PAYMENT_API}/booking/${encodeURIComponent(
        validBookingId
      )}`
    );
  };

/* =========================================================
   LANDLORD PAYMENTS
========================================================= */

export const getLandlordPayments =
  async (
    landlordId
  ) => {
    if (
      landlordId ===
        undefined ||
      landlordId === null ||
      String(
        landlordId
      ).trim() === "" ||
      String(
        landlordId
      ) === "undefined"
    ) {
      throw new Error(
        "Landlord ID is required."
      );
    }

    return apiRequest(
      `${PAYMENT_API}/landlord/${encodeURIComponent(
        landlordId
      )}`
    );
  };

/* =========================================================
   TENANT PAYMENTS
========================================================= */

export const getTenantPayments =
  async (
    tenantId
  ) => {
    if (
      tenantId ===
        undefined ||
      tenantId === null ||
      String(
        tenantId
      ).trim() === ""
    ) {
      throw new Error(
        "Tenant ID is required."
      );
    }

    return apiRequest(
      `${PAYMENT_API}/tenant/${encodeURIComponent(
        tenantId
      )}`
    );
  };

/* =========================================================
   ADMIN
========================================================= */

export const getAllPayments =
  async () =>
    apiRequest(
      `${PAYMENT_API}/admin`
    );