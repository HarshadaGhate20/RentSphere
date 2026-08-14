package com.rentsphere.payment.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateOrderRequest {

    @NotBlank(
        message = "Booking ID is required"
    )
    private String bookingId;

    public CreateOrderRequest() {
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(
        String bookingId
    ) {
        this.bookingId = bookingId;
    }
}