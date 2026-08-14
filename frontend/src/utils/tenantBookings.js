const BOOKING_STORAGE_KEY =
  "rentsphere_tenant_bookings";

export const getTenantBookings = () => {
  try {
    const stored = localStorage.getItem(
      BOOKING_STORAGE_KEY
    );

    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(
      "Unable to read tenant bookings:",
      error
    );

    return [];
  }
};

export const saveTenantBookings = (
  bookings
) => {
  localStorage.setItem(
    BOOKING_STORAGE_KEY,
    JSON.stringify(bookings)
  );
};

export const addTenantBooking = (
  booking
) => {
  const currentBookings =
    getTenantBookings();

  const updatedBookings = [
    booking,
    ...currentBookings,
  ];

  saveTenantBookings(updatedBookings);

  return updatedBookings;
};

export const cancelTenantBooking = (
  bookingId
) => {
  const updatedBookings =
    getTenantBookings().map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            status: "CANCELLED",
            updatedOn:
              new Date().toLocaleString(
                "en-IN"
              ),
          }
        : booking
    );

  saveTenantBookings(updatedBookings);

  return updatedBookings;
};