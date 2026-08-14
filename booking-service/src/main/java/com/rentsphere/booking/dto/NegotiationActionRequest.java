package com.rentsphere.booking.dto;

import java.math.BigDecimal;

public class NegotiationActionRequest {

    private BigDecimal counterRent;

    private String landlordMessage;

    public BigDecimal getCounterRent() {
        return counterRent;
    }

    public void setCounterRent(
        BigDecimal counterRent
    ) {
        this.counterRent = counterRent;
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