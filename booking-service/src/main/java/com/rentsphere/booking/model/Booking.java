package com.rentsphere.booking.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @Column(
        nullable = false,
        length = 50
    )
    private String id;

    @Column(nullable = false)
    private Long propertyId;

    @Column(
        nullable = false,
        length = 150
    )
    private String propertyTitle;

    @Column(length = 80)
    private String propertyCategory;

    @Column(length = 500)
    private String propertyImage;

    @Column(
        nullable = false,
        length = 100
    )
    private String propertyArea;

    @Column(
        nullable = false,
        length = 100
    )
    private String propertyCity;

    @Column(
        nullable = false,
        length = 100
    )
    private String tenantId;

    @Column(
        nullable = false,
        length = 150
    )
    private String tenantName;

    @Column(length = 150)
    private String tenantEmail;

    @Column(length = 20)
    private String tenantPhone;

    @Column(length = 150)
    private String tenantOccupation;

    @Column(
        nullable = false,
        length = 100
    )
    private String landlordId;

    @Column(
        nullable = false,
        length = 150
    )
    private String landlordName;

    @Column(
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal requestedMonthlyRent;

    @Column(
        precision = 12,
        scale = 2
    )
    private BigDecimal approvedMonthlyRent;

    @Column(
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal securityDeposit;

    @Column(
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal maintenanceCharge;

    @Column(
        precision = 12,
        scale = 2
    )
    private BigDecimal totalPayable;

    @Column(nullable = false)
    private LocalDate requestedMoveInDate;

    private LocalDate approvedMoveInDate;

    @Column(nullable = false)
    private Integer durationMonths;

    @Column(nullable = false)
    private Integer numberOfOccupants;

    /*
     * PG ONLY.
     */
    private Integer numberOfBeds;

    /*
     * Prevent duplicate Razorpay callbacks
     * from reducing beds repeatedly.
     */
    @Column(nullable = false)
    private Boolean pgBedsAllocated = false;

    @Column(length = 1000)
    private String tenantMessage;

    @Column(length = 500)
    private String landlordMessage;

    @Column(length = 500)
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 40
    )
    private BookingStatus status;

    @Column(length = 100)
    private String paymentId;

    @Column(length = 100)
    private String paymentOrderId;

    private LocalDateTime paymentDate;

    private LocalDate leaseStartDate;

    private LocalDate leaseEndDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Booking() {
    }

    @PrePersist
    public void beforeCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status =
                    BookingStatus.PENDING;
        }

        if (pgBedsAllocated == null) {
            pgBedsAllocated =
                    false;
        }
    }

    @PreUpdate
    public void beforeUpdate() {

        updatedAt =
                LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public Integer getNumberOfBeds() {
        return numberOfBeds;
    }

    public void setNumberOfBeds(
            Integer numberOfBeds
    ) {
        this.numberOfBeds =
                numberOfBeds;
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
        this.status = status;
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