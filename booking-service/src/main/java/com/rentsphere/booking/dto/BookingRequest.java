package com.rentsphere.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull
    private Long propertyId;

    @NotBlank
    private String tenantId;

    @NotBlank
    private String tenantName;

    private String tenantEmail;

    private String tenantPhone;

    private String tenantOccupation;

    /*
     * Apartment:
     * monthly rent
     *
     * PG:
     * rentPerBed × numberOfBeds
     */
    @NotNull
    @DecimalMin("1.00")
    private BigDecimal requestedMonthlyRent;

    @NotNull
    @FutureOrPresent
    private LocalDate requestedMoveInDate;

    /*
     * Existing monthly booking duration.
     *
     * For PG, this is number of months.
     */
    @NotNull
    @Min(1)
    private Integer durationMonths;

    @NotNull
    @Min(1)
    private Integer numberOfOccupants;

    /*
     * PG only.
     *
     * Null for regular property.
     */
    @Min(1)
    private Integer numberOfBeds;

    private String tenantMessage;

    /*
     * Negotiated booking support.
     */
    private Long negotiationId;

    public BookingRequest() {
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(
            Long propertyId
    ) {
        this.propertyId =
                propertyId;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(
            String tenantId
    ) {
        this.tenantId =
                tenantId;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(
            String tenantName
    ) {
        this.tenantName =
                tenantName;
    }

    public String getTenantEmail() {
        return tenantEmail;
    }

    public void setTenantEmail(
            String tenantEmail
    ) {
        this.tenantEmail =
                tenantEmail;
    }

    public String getTenantPhone() {
        return tenantPhone;
    }

    public void setTenantPhone(
            String tenantPhone
    ) {
        this.tenantPhone =
                tenantPhone;
    }

    public String getTenantOccupation() {
        return tenantOccupation;
    }

    public void setTenantOccupation(
            String tenantOccupation
    ) {
        this.tenantOccupation =
                tenantOccupation;
    }

    public BigDecimal getRequestedMonthlyRent() {
        return requestedMonthlyRent;
    }

    public void setRequestedMonthlyRent(
            BigDecimal requestedMonthlyRent
    ) {
        this.requestedMonthlyRent =
                requestedMonthlyRent;
    }

    public LocalDate getRequestedMoveInDate() {
        return requestedMoveInDate;
    }

    public void setRequestedMoveInDate(
            LocalDate requestedMoveInDate
    ) {
        this.requestedMoveInDate =
                requestedMoveInDate;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(
            Integer durationMonths
    ) {
        this.durationMonths =
                durationMonths;
    }

    public Integer getNumberOfOccupants() {
        return numberOfOccupants;
    }

    public void setNumberOfOccupants(
            Integer numberOfOccupants
    ) {
        this.numberOfOccupants =
                numberOfOccupants;
    }

    public Integer getNumberOfBeds() {
        return numberOfBeds;
    }

    public void setNumberOfBeds(
            Integer numberOfBeds
    ) {
        this.numberOfBeds =
                numberOfBeds;
    }

    public String getTenantMessage() {
        return tenantMessage;
    }

    public void setTenantMessage(
            String tenantMessage
    ) {
        this.tenantMessage =
                tenantMessage;
    }

    public Long getNegotiationId() {
        return negotiationId;
    }

    public void setNegotiationId(
            Long negotiationId
    ) {
        this.negotiationId =
                negotiationId;
    }
}