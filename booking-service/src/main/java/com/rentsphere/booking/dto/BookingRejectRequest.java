package com.rentsphere.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BookingRejectRequest {

    @NotBlank(
        message = "Rejection reason is required"
    )
    @Size(
        max = 500,
        message =
            "Rejection reason cannot exceed 500 characters"
    )
    private String rejectionReason;

    public BookingRejectRequest() {
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(
        String rejectionReason
    ) {
        this.rejectionReason =
            rejectionReason;
    }
}