import {
  API_BASE_URLS,
} from "../config/api";

import {
  apiRequest,
} from "./apiClient";

const NEGOTIATION_API =
  `${API_BASE_URLS.booking}/negotiations`;

export const getAllNegotiations = async () => apiRequest(`${NEGOTIATION_API}/admin`);

export const createNegotiation =
  async (negotiationData) =>
    apiRequest(
      NEGOTIATION_API,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          negotiationData
        ),
      }
    );

export const getNegotiationById =
  async (negotiationId) =>
    apiRequest(
      `${NEGOTIATION_API}/${encodeURIComponent(
        negotiationId
      )}`
    );

export const getTenantNegotiations =
  async (tenantId) =>
    apiRequest(
      `${NEGOTIATION_API}/tenant/${encodeURIComponent(
        tenantId
      )}`
    );

export const getLandlordNegotiations =
  async (landlordId) =>
    apiRequest(
      `${NEGOTIATION_API}/landlord/${encodeURIComponent(
        landlordId
      )}`
    );

export const acceptNegotiation =
  async (
    negotiationId,
    landlordMessage = ""
  ) =>
    apiRequest(
      `${NEGOTIATION_API}/${encodeURIComponent(
        negotiationId
      )}/accept`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          landlordMessage,
        }),
      }
    );

export const counterNegotiation =
  async (
    negotiationId,
    counterRent,
    landlordMessage = ""
  ) =>
    apiRequest(
      `${NEGOTIATION_API}/${encodeURIComponent(
        negotiationId
      )}/counter`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          counterRent:
            Number(counterRent),

          landlordMessage,
        }),
      }
    );

export const rejectNegotiation =
  async (
    negotiationId,
    landlordMessage = ""
  ) =>
    apiRequest(
      `${NEGOTIATION_API}/${encodeURIComponent(
        negotiationId
      )}/reject`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          landlordMessage,
        }),
      }
    );

export const acceptCounterOffer =
  async (negotiationId) =>
    apiRequest(
      `${NEGOTIATION_API}/${encodeURIComponent(
        negotiationId
      )}/accept-counter`,
      {
        method: "PATCH",
      }
    );

export const cancelNegotiation =
  async (negotiationId) =>
    apiRequest(
      `${NEGOTIATION_API}/${encodeURIComponent(
        negotiationId
      )}/cancel`,
      {
        method: "PATCH",
      }
    );
