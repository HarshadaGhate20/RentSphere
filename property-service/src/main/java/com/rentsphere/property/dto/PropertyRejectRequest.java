package com.rentsphere.property.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PropertyRejectRequest {

    @NotBlank(
        message = "Rejection reason is required"
    )
    @Size(
        max = 500,
        message =
            "Rejection reason cannot exceed 500 characters"
    )
    private String rejectionReason;

    public PropertyRejectRequest() {
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