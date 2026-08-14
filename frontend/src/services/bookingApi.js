import {
  API_BASE_URLS,
} from "../config/api";

import {
  apiRequest,
} from "./apiClient";

const BOOKING_API =
  `${API_BASE_URLS.booking}/bookings`;

export const getAllBookings = async () => apiRequest(`${BOOKING_API}/admin`);

/*
 * =====================================================
 * CREATE BOOKING
 * =====================================================
 */
export const createBooking = async (
  bookingData
) =>
  apiRequest(
    BOOKING_API,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        bookingData
      ),
    }
  );

/*
 * =====================================================
 * GET BOOKING BY ID
 * =====================================================
 *
 * Example:
 *
 * GET
 * /api/bookings/BOOK-1786090976708
 */
export const getBookingById =
  async (bookingId) =>
    apiRequest(
      `${BOOKING_API}/${encodeURIComponent(
        bookingId
      )}`
    );

/*
 * =====================================================
 * GET TENANT BOOKINGS
 * =====================================================
 */
export const getTenantBookings =
  async (tenantId) =>
    apiRequest(
      `${BOOKING_API}/tenant/${encodeURIComponent(
        tenantId
      )}`
    );

/*
 * =====================================================
 * GET LANDLORD BOOKINGS
 * =====================================================
 */
export const getLandlordBookings =
  async (landlordId) =>
    apiRequest(
      `${BOOKING_API}/landlord/${encodeURIComponent(
        landlordId
      )}`
    );

/*
 * =====================================================
 * APPROVE BOOKING
 * =====================================================
 */
export const approveBooking =
  async (
    bookingId,
    approvedMonthlyRent,
    landlordMessage
  ) =>
    apiRequest(
      `${BOOKING_API}/${encodeURIComponent(
        bookingId
      )}/approve`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          approvedMonthlyRent,
          landlordMessage,
        }),
      }
    );

/*
 * =====================================================
 * REJECT BOOKING
 * =====================================================
 */
export const rejectBooking =
  async (
    bookingId,
    rejectionReason
  ) =>
    apiRequest(
      `${BOOKING_API}/${encodeURIComponent(
        bookingId
      )}/reject`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          rejectionReason,
        }),
      }
    );

/*
 * =====================================================
 * CANCEL BOOKING
 * =====================================================
 */
export const cancelBooking =
  async (bookingId) =>
    apiRequest(
      `${BOOKING_API}/${encodeURIComponent(
        bookingId
      )}/cancel`,
      {
        method: "PATCH",
      }
    );

/*
 * =====================================================
 * ACTIVATE LEASE
 * =====================================================
 */
export const activateLease =
  async (bookingId) =>
    apiRequest(
      `${BOOKING_API}/${encodeURIComponent(
        bookingId
      )}/lease-active`,
      {
        method: "PATCH",
      }
    );

/*
 * =====================================================
 * COMPLETE LEASE
 * =====================================================
 */
export const completeLease =
  async (bookingId) =>
    apiRequest(
      `${BOOKING_API}/${encodeURIComponent(
        bookingId
      )}/complete`,
      {
        method: "PATCH",
      }
    );
