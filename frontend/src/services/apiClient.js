import { addNotification } from "../utils/notifications";

export const apiRequest = async (
  url,
  options = {}
) => {
  if (!url) {
    throw new Error(
      "API URL is missing."
    );
  }

  const token =
    localStorage.getItem(
      "token"
    );

  const isFormData =
    options.body instanceof
    FormData;

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  /*
   * Browser must generate the multipart boundary.
   */
  if (isFormData) {
    delete headers[
      "Content-Type"
    ];
  }

  console.log(
    "API REQUEST:",
    {
      url,
      method:
        options.method ||
        "GET",
      body:
        options.body,
    }
  );

  let response;

  try {
    response =
      await fetch(
        url,
        {
          ...options,
          headers,
        }
      );
  } catch (networkError) {
    console.error(
      "NETWORK ERROR:",
      networkError
    );

    throw new Error(
      "Unable to connect to the backend service."
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data = null;

  try {
    if (
      contentType.includes(
        "application/json"
      )
    ) {
      data =
        await response.json();
    } else {
      data =
        await response.text();
    }
  } catch (parseError) {
    console.error(
      "RESPONSE PARSE ERROR:",
      parseError
    );
  }

  console.log(
    "API RESPONSE:",
    {
      url,
      status:
        response.status,
      data,
    }
  );

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}.`;

    if (
      typeof data ===
        "string" &&
      data.trim()
    ) {
      message =
        data.trim();
    }

    if (
      data &&
      typeof data ===
        "object"
    ) {
      message =
        data.message ||
        data.error ||
        data.detail ||
        message;
    }

    console.error(
      "API ERROR:",
      {
        url,
        status:
          response.status,
        data,
      }
    );

    throw new Error(
      message
    );
  }

  const method = String(options.method || "GET").toUpperCase();
  if (token && method !== "GET") {
    const notification = url.includes("payment")
      ? ["Payment successful", "Your payment information has been updated."]
      : url.includes("negotiation")
        ? ["Negotiation updated", "The rent negotiation has been updated."]
        : url.includes("booking")
          ? ["Booking updated", "The booking status has been updated."]
          : url.includes("propert")
            ? ["Property updated", "The property information has been saved."]
            : ["Account updated", "Your changes have been saved."];
    addNotification(notification[0], notification[1], "SUCCESS");
  }

  return data;
};
