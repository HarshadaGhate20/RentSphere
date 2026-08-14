package com.rentsphere.booking.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingPaymentSuccessRequest {

    @NotBlank(
        message = "Payment ID is required"
    )
    private String paymentId;

    @NotBlank(
        message = "Payment order ID is required"
    )
    private String paymentOrderId;

    public BookingPaymentSuccessRequest() {
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(
        String paymentId
    ) {
        this.paymentId = paymentId;
    }

    public String getPaymentOrderId() {
        return paymentOrderId;
    }

    public void setPaymentOrderId(
        String paymentOrderId
    ) {
        this.paymentOrderId =
            paymentOrderId;
    }
}