package com.rentsphere.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.rentsphere.booking.model.BookingStatus;

public class BookingResponse {

    private String id;

    /* =========================================================
       PROPERTY
    ========================================================= */

    private Long propertyId;

    private String propertyTitle;

    private String propertyCategory;

    private String propertyImage;

    private String propertyArea;

    private String propertyCity;

    /* =========================================================
       TENANT
    ========================================================= */

    private String tenantId;

    private String tenantName;

    private String tenantEmail;

    private String tenantPhone;

    private String tenantOccupation;

    /* =========================================================
       LANDLORD
    ========================================================= */

    private String landlordId;

    private String landlordName;

    /* =========================================================
       PRICING TYPE
    ========================================================= */

    private String pricingType;

    /* =========================================================
       MONTHLY RENTAL
    ========================================================= */

    private BigDecimal requestedMonthlyRent;

    private BigDecimal approvedMonthlyRent;

    private LocalDate requestedMoveInDate;

    private LocalDate approvedMoveInDate;

    private Integer durationMonths;

    private Integer numberOfOccupants;

    /* =========================================================
       VILLA
    ========================================================= */

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Integer durationDays;

    private BigDecimal dailyRent;

    private BigDecimal rentalAmount;

    private Integer numberOfGuests;

    /* =========================================================
       PG
    ========================================================= */

    private Integer numberOfBeds;

    private BigDecimal rentPerBed;

    private BigDecimal depositPerBed;

    private BigDecimal pgMonthlyAmount;

    private Boolean pgBedsAllocated;

    /* =========================================================
       CHARGES
    ========================================================= */

    private BigDecimal securityDeposit;

    private BigDecimal maintenanceCharge;

    private BigDecimal totalPayable;

    /* =========================================================
       MESSAGE
    ========================================================= */

    private String tenantMessage;

    private String landlordMessage;

    private String rejectionReason;

    /* =========================================================
       STATUS
    ========================================================= */

    private BookingStatus status;

    /* =========================================================
       PAYMENT
    ========================================================= */

    private String paymentId;

    private String paymentOrderId;

    private LocalDateTime paymentDate;

    /* =========================================================
       LEASE
    ========================================================= */

    private LocalDate leaseStartDate;

    private LocalDate leaseEndDate;

    /* =========================================================
       TIMESTAMPS
    ========================================================= */

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public BookingResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(
            String id
    ) {
        this.id = id;
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

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(
            String propertyTitle
    ) {
        this.propertyTitle =
                propertyTitle;
    }

    public String getPropertyCategory() {
        return propertyCategory;
    }

    public void setPropertyCategory(
            String propertyCategory
    ) {
        this.propertyCategory =
                propertyCategory;
    }

    public String getPropertyImage() {
        return propertyImage;
    }

    public void setPropertyImage(
            String propertyImage
    ) {
        this.propertyImage =
                propertyImage;
    }

    public String getPropertyArea() {
        return propertyArea;
    }

    public void setPropertyArea(
            String propertyArea
    ) {
        this.propertyArea =
                propertyArea;
    }

    public String getPropertyCity() {
        return propertyCity;
    }

    public void setPropertyCity(
            String propertyCity
    ) {
        this.propertyCity =
                propertyCity;
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

    public String getLandlordId() {
        return landlordId;
    }

    public void setLandlordId(
            String landlordId
    ) {
        this.landlordId =
                landlordId;
    }

    public String getLandlordName() {
        return landlordName;
    }

    public void setLandlordName(
            String landlordName
    ) {
        this.landlordName =
                landlordName;
    }

    public String getPricingType() {
        return pricingType;
    }

    public void setPricingType(
            String pricingType
    ) {
        this.pricingType =
                pricingType;
    }

    public BigDecimal
    getRequestedMonthlyRent() {
        return requestedMonthlyRent;
    }

    public void setRequestedMonthlyRent(
            BigDecimal requestedMonthlyRent
    ) {
        this.requestedMonthlyRent =
                requestedMonthlyRent;
    }

    public BigDecimal
    getApprovedMonthlyRent() {
        return approvedMonthlyRent;
    }

    public void setApprovedMonthlyRent(
            BigDecimal approvedMonthlyRent
    ) {
        this.approvedMonthlyRent =
                approvedMonthlyRent;
    }

    public LocalDate
    getRequestedMoveInDate() {
        return requestedMoveInDate;
    }

    public void setRequestedMoveInDate(
            LocalDate requestedMoveInDate
    ) {
        this.requestedMoveInDate =
                requestedMoveInDate;
    }

    public LocalDate
    getApprovedMoveInDate() {
        return approvedMoveInDate;
    }

    public void setApprovedMoveInDate(
            LocalDate approvedMoveInDate
    ) {
        this.approvedMoveInDate =
                approvedMoveInDate;
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

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(
            LocalDate checkInDate
    ) {
        this.checkInDate =
                checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(
            LocalDate checkOutDate
    ) {
        this.checkOutDate =
                checkOutDate;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(
            Integer durationDays
    ) {
        this.durationDays =
                durationDays;
    }

    public BigDecimal getDailyRent() {
        return dailyRent;
    }

    public void setDailyRent(
            BigDecimal dailyRent
    ) {
        this.dailyRent =
                dailyRent;
    }

    public BigDecimal getRentalAmount() {
        return rentalAmount;
    }

    public void setRentalAmount(
            BigDecimal rentalAmount
    ) {
        this.rentalAmount =
                rentalAmount;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(
            Integer numberOfGuests
    ) {
        this.numberOfGuests =
                numberOfGuests;
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

    public BigDecimal getRentPerBed() {
        return rentPerBed;
    }

    public void setRentPerBed(
            BigDecimal rentPerBed
    ) {
        this.rentPerBed =
                rentPerBed;
    }

    public BigDecimal getDepositPerBed() {
        return depositPerBed;
    }

    public void setDepositPerBed(
            BigDecimal depositPerBed
    ) {
        this.depositPerBed =
                depositPerBed;
    }

    public BigDecimal getPgMonthlyAmount() {
        return pgMonthlyAmount;
    }

    public void setPgMonthlyAmount(
            BigDecimal pgMonthlyAmount
    ) {
        this.pgMonthlyAmount =
                pgMonthlyAmount;
    }

    public Boolean getPgBedsAllocated() {
        return pgBedsAllocated;
    }

    public void setPgBedsAllocated(
            Boolean pgBedsAllocated
    ) {
        this.pgBedsAllocated =
                pgBedsAllocated;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(
            BigDecimal securityDeposit
    ) {
        this.securityDeposit =
                securityDeposit;
    }

    public BigDecimal getMaintenanceCharge() {
        return maintenanceCharge;
    }

    public void setMaintenanceCharge(
            BigDecimal maintenanceCharge
    ) {
        this.maintenanceCharge =
                maintenanceCharge;
    }

    public BigDecimal getTotalPayable() {
        return totalPayable;
    }

    public void setTotalPayable(
            BigDecimal totalPayable
    ) {
        this.totalPayable =
                totalPayable;
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

    public String getLandlordMessage() {
        return landlordMessage;
    }

    public void setLandlordMessage(
            String landlordMessage
    ) {
        this.landlordMessage =
                landlordMessage;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(
            BookingStatus status
    ) {
        this.status =
                status;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(
            String paymentId
    ) {
        this.paymentId =
                paymentId;
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

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(
            LocalDateTime paymentDate
    ) {
        this.paymentDate =
                paymentDate;
    }

    public LocalDate getLeaseStartDate() {
        return leaseStartDate;
    }

    public void setLeaseStartDate(
            LocalDate leaseStartDate
    ) {
        this.leaseStartDate =
                leaseStartDate;
    }

    public LocalDate getLeaseEndDate() {
        return leaseEndDate;
    }

    public void setLeaseEndDate(
            LocalDate leaseEndDate
    ) {
        this.leaseEndDate =
                leaseEndDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt =
                createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt =
                updatedAt;
    }
}