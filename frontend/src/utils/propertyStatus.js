const PROPERTY_STATUS_KEY =
  "rentsphere_property_status";

const TENANT_BOOKINGS_KEY =
  "rentsphere_tenant_bookings";

export const PROPERTY_STATUS = {
  AVAILABLE: "AVAILABLE",
  BOOKING_REQUEST_RECEIVED:
    "BOOKING_REQUEST_RECEIVED",
  WAITING_PAYMENT: "WAITING_PAYMENT",
  BOOKED: "BOOKED",
  LEASE_ACTIVE: "LEASE_ACTIVE",
  LEASE_COMPLETED: "LEASE_COMPLETED",
};

const readStoredPropertyStatuses = () => {
  try {
    const stored = localStorage.getItem(
      PROPERTY_STATUS_KEY
    );

    const parsed = stored
      ? JSON.parse(stored)
      : {};

    return parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    console.error(
      "Unable to read property statuses:",
      error
    );

    return {};
  }
};

const readTenantBookings = () => {
  try {
    const stored = localStorage.getItem(
      TENANT_BOOKINGS_KEY
    );

    const parsed = stored
      ? JSON.parse(stored)
      : [];

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Unable to read tenant bookings:",
      error
    );

    return [];
  }
};

const saveTenantBookings = (
  bookings
) => {
  localStorage.setItem(
    TENANT_BOOKINGS_KEY,
    JSON.stringify(
      Array.isArray(bookings)
        ? bookings
        : []
    )
  );
};

const parseLocalDate = (
  dateValue
) => {
  if (!dateValue) {
    return null;
  }

  const value = String(
    dateValue
  );

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    const date = new Date(
      `${value}T00:00:00`
    );

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  const fallbackDate =
    new Date(value);

  return Number.isNaN(
    fallbackDate.getTime()
  )
    ? null
    : fallbackDate;
};

const getToday = () => {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return today;
};

export const calculateLeaseEndDate = (
  moveInDate,
  durationMonths
) => {
  const startDate =
    parseLocalDate(
      moveInDate
    );

  const duration = Number(
    durationMonths
  );

  if (
    !startDate ||
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    return null;
  }

  const endDate = new Date(
    startDate
  );

  endDate.setMonth(
    endDate.getMonth() +
      duration
  );

  endDate.setDate(
    endDate.getDate() - 1
  );

  endDate.setHours(
    0,
    0,
    0,
    0
  );

  return endDate;
};

const determinePaidBookingStatus = (
  booking,
  today
) => {
  const moveInDate =
    parseLocalDate(
      booking.moveInDate
    );

  const leaseEndDate =
    calculateLeaseEndDate(
      booking.moveInDate,
      booking.durationMonths
    );

  if (
    !moveInDate ||
    !leaseEndDate
  ) {
    return PROPERTY_STATUS.BOOKED;
  }

  moveInDate.setHours(
    0,
    0,
    0,
    0
  );

  if (today < moveInDate) {
    return PROPERTY_STATUS.BOOKED;
  }

  if (
    today >= moveInDate &&
    today <= leaseEndDate
  ) {
    return PROPERTY_STATUS.LEASE_ACTIVE;
  }

  return PROPERTY_STATUS.LEASE_COMPLETED;
};

const getBookingPriority = (
  booking
) => {
  if (
    booking.paymentStatus ===
      "PAID" &&
    [
      "APPROVED",
      "ACTIVE",
      "COMPLETED",
    ].includes(booking.status)
  ) {
    return 3;
  }

  if (
    booking.status ===
      "APPROVED" &&
    [
      "AVAILABLE",
      "ORDER_CREATED",
    ].includes(
      booking.paymentStatus
    )
  ) {
    return 2;
  }

  if (
    booking.status ===
    "PENDING"
  ) {
    return 1;
  }

  return 0;
};

/*
  Synchronize one final status per property.

  Historical bookings with propertyRelisted=true
  are completely ignored.
*/
export const synchronizePropertyStatuses =
  () => {
    const storedStatuses =
      readStoredPropertyStatuses();

    const bookings =
      readTenantBookings();

    const today = getToday();

    const updatedStatuses = {
      ...storedStatuses,
    };

    const bookingsByProperty =
      {};

    bookings.forEach((booking) => {
      if (
        booking.propertyId ===
          undefined ||
        booking.propertyId ===
          null
      ) {
        return;
      }

      const propertyKey =
        String(
          booking.propertyId
        );

      if (
        !bookingsByProperty[
          propertyKey
        ]
      ) {
        bookingsByProperty[
          propertyKey
        ] = [];
      }

      bookingsByProperty[
        propertyKey
      ].push(booking);
    });

    let bookingsChanged =
      false;

    const updatedBookings =
      bookings.map(
        (booking) => {
          if (
            booking.propertyRelisted ===
            true
          ) {
            return booking;
          }

          if (
            booking.paymentStatus !==
              "PAID"
          ) {
            return booking;
          }

          const lifecycleStatus =
            determinePaidBookingStatus(
              booking,
              today
            );

          if (
            lifecycleStatus ===
              PROPERTY_STATUS.LEASE_ACTIVE &&
            booking.status !==
              "ACTIVE"
          ) {
            bookingsChanged =
              true;

            return {
              ...booking,
              status: "ACTIVE",
              leaseActivatedOn:
                booking.leaseActivatedOn ||
                new Date().toLocaleString(
                  "en-IN"
                ),
              updatedOn:
                new Date().toLocaleString(
                  "en-IN"
                ),
            };
          }

          if (
            lifecycleStatus ===
              PROPERTY_STATUS.LEASE_COMPLETED &&
            booking.status !==
              "COMPLETED"
          ) {
            bookingsChanged =
              true;

            return {
              ...booking,
              status: "COMPLETED",
              leaseCompletedOn:
                booking.leaseCompletedOn ||
                new Date().toLocaleString(
                  "en-IN"
                ),
              updatedOn:
                new Date().toLocaleString(
                  "en-IN"
                ),
            };
          }

          return booking;
        }
      );

    /*
      Recreate groups using the updated booking
      records so lifecycle status is accurate.
    */
    const updatedGroups = {};

    updatedBookings.forEach(
      (booking) => {
        if (
          booking.propertyId ===
            undefined ||
          booking.propertyId ===
            null
        ) {
          return;
        }

        const propertyKey =
          String(
            booking.propertyId
          );

        if (
          !updatedGroups[
            propertyKey
          ]
        ) {
          updatedGroups[
            propertyKey
          ] = [];
        }

        updatedGroups[
          propertyKey
        ].push(booking);
      }
    );

    Object.entries(
      updatedGroups
    ).forEach(
      ([
        propertyKey,
        propertyBookings,
      ]) => {
        const currentBookings =
          propertyBookings.filter(
            (booking) =>
              booking.propertyRelisted !==
              true
          );

        /*
          All previous bookings are historical.
          Therefore the property stays available.
        */
        if (
          currentBookings.length ===
          0
        ) {
          updatedStatuses[
            propertyKey
          ] =
            PROPERTY_STATUS.AVAILABLE;

          return;
        }

        const controllingBooking =
          [...currentBookings].sort(
            (
              firstBooking,
              secondBooking
            ) =>
              getBookingPriority(
                secondBooking
              ) -
              getBookingPriority(
                firstBooking
              )
          )[0];

        if (
          controllingBooking.paymentStatus ===
            "PAID" &&
          [
            "APPROVED",
            "ACTIVE",
            "COMPLETED",
          ].includes(
            controllingBooking.status
          )
        ) {
          updatedStatuses[
            propertyKey
          ] =
            determinePaidBookingStatus(
              controllingBooking,
              today
            );

          return;
        }

        if (
          controllingBooking.status ===
            "APPROVED" &&
          [
            "AVAILABLE",
            "ORDER_CREATED",
          ].includes(
            controllingBooking.paymentStatus
          )
        ) {
          updatedStatuses[
            propertyKey
          ] =
            PROPERTY_STATUS.WAITING_PAYMENT;

          return;
        }

        if (
          controllingBooking.status ===
          "PENDING"
        ) {
          updatedStatuses[
            propertyKey
          ] =
            PROPERTY_STATUS.BOOKING_REQUEST_RECEIVED;
        }
      }
    );

    localStorage.setItem(
      PROPERTY_STATUS_KEY,
      JSON.stringify(
        updatedStatuses
      )
    );

    if (bookingsChanged) {
      saveTenantBookings(
        updatedBookings
      );
    }

    return updatedStatuses;
  };

export const getPropertyStatuses =
  () => {
    return synchronizePropertyStatuses();
  };

export const savePropertyStatuses = (
  statuses
) => {
  localStorage.setItem(
    PROPERTY_STATUS_KEY,
    JSON.stringify(
      statuses || {}
    )
  );
};

export const getPropertyStatus = (
  propertyId
) => {
  if (
    propertyId === undefined ||
    propertyId === null
  ) {
    return PROPERTY_STATUS.AVAILABLE;
  }

  const statuses =
    synchronizePropertyStatuses();

  return (
    statuses[
      String(propertyId)
    ] ||
    PROPERTY_STATUS.AVAILABLE
  );
};

export const updatePropertyStatus = (
  propertyId,
  status
) => {
  if (
    propertyId === undefined ||
    propertyId === null
  ) {
    return readStoredPropertyStatuses();
  }

  if (
    !Object.values(
      PROPERTY_STATUS
    ).includes(status)
  ) {
    console.error(
      `Invalid property status: ${status}`
    );

    return readStoredPropertyStatuses();
  }

  const statuses =
    readStoredPropertyStatuses();

  const updatedStatuses = {
    ...statuses,
    [String(propertyId)]:
      status,
  };

  savePropertyStatuses(
    updatedStatuses
  );

  return updatedStatuses;
};

export const isPropertyBooked = (
  propertyId
) => {
  return [
    PROPERTY_STATUS.BOOKED,
    PROPERTY_STATUS.LEASE_ACTIVE,
  ].includes(
    getPropertyStatus(
      propertyId
    )
  );
};

export const isPropertyUnavailable = (
  propertyId
) => {
  return [
    PROPERTY_STATUS.BOOKING_REQUEST_RECEIVED,
    PROPERTY_STATUS.WAITING_PAYMENT,
    PROPERTY_STATUS.BOOKED,
    PROPERTY_STATUS.LEASE_ACTIVE,
  ].includes(
    getPropertyStatus(
      propertyId
    )
  );
};

export const canAcceptNewBooking = (
  propertyId
) => {
  return (
    getPropertyStatus(
      propertyId
    ) ===
    PROPERTY_STATUS.AVAILABLE
  );
};

export const canLandlordRelistProperty = (
  propertyId
) => {
  return (
    getPropertyStatus(
      propertyId
    ) ===
    PROPERTY_STATUS.LEASE_COMPLETED
  );
};

export const relistProperty = (
  propertyId
) => {
  if (
    propertyId === undefined ||
    propertyId === null
  ) {
    return {
      success: false,
      message:
        "Property ID is required.",
    };
  }

  const propertyKey =
    String(propertyId);

  const currentStatus =
    getPropertyStatus(
      propertyKey
    );

  if (
    currentStatus !==
    PROPERTY_STATUS.LEASE_COMPLETED
  ) {
    return {
      success: false,
      message:
        "Only a property with a completed lease can be relisted.",
    };
  }

  const bookings =
    readTenantBookings();

  const relistedOn =
    new Date().toLocaleString(
      "en-IN"
    );

  /*
    Mark every old booking for this property
    as historical. This is the important fix.
  */
  const updatedBookings =
    bookings.map((booking) => {
      if (
        String(
          booking.propertyId
        ) !== propertyKey
      ) {
        return booking;
      }

      return {
        ...booking,
        propertyRelisted: true,
        propertyRelistedOn:
          relistedOn,
        updatedOn:
          relistedOn,
      };
    });

  saveTenantBookings(
    updatedBookings
  );

  const statuses =
    readStoredPropertyStatuses();

  const updatedStatuses = {
    ...statuses,
    [propertyKey]:
      PROPERTY_STATUS.AVAILABLE,
  };

  savePropertyStatuses(
    updatedStatuses
  );

  return {
    success: true,
    statuses:
      updatedStatuses,
    bookings:
      updatedBookings,
    message:
      "Property relisted and available for new bookings.",
  };
};