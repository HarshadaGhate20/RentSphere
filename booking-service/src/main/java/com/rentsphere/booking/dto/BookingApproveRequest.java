package com.rentsphere.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingApproveRequest {

    private BigDecimal approvedMonthlyRent;

    private LocalDate approvedMoveInDate;

    private String landlordMessage;

    public BookingApproveRequest() {
    }

    public BigDecimal getApprovedMonthlyRent() {
        return approvedMonthlyRent;
    }

    public void setApprovedMonthlyRent(
            BigDecimal approvedMonthlyRent
    ) {
        this.approvedMonthlyRent =
                approvedMonthlyRent;
    }

    public LocalDate getApprovedMoveInDate() {
        return approvedMoveInDate;
    }

    public void setApprovedMoveInDate(
            LocalDate approvedMoveInDate
    ) {
        this.approvedMoveInDate =
                approvedMoveInDate;
    }

    public String getLandlordMessage() {
        return landlordMessage;
    }

    public void setLandlordMessage(
            String landlordMessage
    ) {
        this.landlordMessage =
                landlordMessage;
    }
}