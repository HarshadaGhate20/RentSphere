package com.rentsphere.payment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(
        strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
        unique = true,
        length = 60
    )
    private String receiptNumber;

    @Column(
        nullable = false,
        unique = true,
        length = 60
    )
    private String bookingId;

    @Column(nullable = false)
    private Long propertyId;

    @Column(
        nullable = false,
        length = 150
    )
    private String propertyTitle;

    @Column(length = 500)
    private String propertyImage;

    @Column(length = 100)
    private String propertyArea;

    @Column(length = 100)
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
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal totalAmount;

    @Column(
        nullable = false,
        unique = true,
        length = 120
    )
    private String razorpayOrderId;

    @Column(
        unique = true,
        length = 120
    )
    private String razorpayPaymentId;

    @Column(length = 300)
    private String razorpaySignature;

    @Column(
        nullable = false,
        length = 10
    )
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    private PaymentStatus status;

    private LocalDateTime paymentDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Payment() {
    }

    @PrePersist
    public void beforeCreate() {
        LocalDateTime now =
            LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status =
                PaymentStatus.ORDER_CREATED;
        }

        if (
            currency == null ||
            currency.isBlank()
        ) {
            currency = "INR";
        }

        if (maintenanceCharge == null) {
            maintenanceCharge =
                BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt =
            LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(
        Long id
    ) {
        this.id = id;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(
        String receiptNumber
    ) {
        this.receiptNumber =
            receiptNumber;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(
        String bookingId
    ) {
        this.bookingId =
            bookingId;
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

    public BigDecimal getApprovedMonthlyRent() {
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(
        BigDecimal totalAmount
    ) {
        this.totalAmount =
            totalAmount;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(
        String razorpayOrderId
    ) {
        this.razorpayOrderId =
            razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(
        String razorpayPaymentId
    ) {
        this.razorpayPaymentId =
            razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(
        String razorpaySignature
    ) {
        this.razorpaySignature =
            razorpaySignature;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(
        String currency
    ) {
        this.currency = currency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(
        PaymentStatus status
    ) {
        this.status = status;
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