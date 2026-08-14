package com.rentsphere.booking.model;

public enum BookingStatus {
	WAITING_PAYMENT,

    /*
     * Tenant submitted booking.
     */
    PENDING,

    /*
     * Landlord approved booking.
     */
    APPROVED,

    /*
     * Landlord rejected booking.
     */
    REJECTED,

    /*
     * Tenant/authorized user cancelled it.
     */
    CANCELLED,

    /*
     * Payment completed.
     */
    PAID,
    /*
     * Successful payment.
     * Rental/booking is active.
     */
    ACTIVE,

    /*
     * Rental/lease/stay is active.
     */
    LEASE_ACTIVE,

    /*
     * Rental/lease/stay completed.
     */
    COMPLETED
}