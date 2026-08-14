package com.rentsphere.payment.dto;

import com.rentsphere.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;

    private String receiptNumber;

    private String bookingId;

    private Long propertyId;
    private String propertyTitle;
    private String propertyImage;
    private String propertyArea;
    private String propertyCity;

    private String tenantId;
    private String tenantName;

    private String landlordId;
    private String landlordName;

    private BigDecimal approvedMonthlyRent;
    private BigDecimal securityDeposit;
    private BigDecimal maintenanceCharge;
    private BigDecimal totalAmount;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    private String currency;

    private PaymentStatus status;

    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(String propertyTitle) {
        this.propertyTitle = propertyTitle;
    }

    public String getPropertyImage() {
        return propertyImage;
    }

    public void setPropertyImage(String propertyImage) {
        this.propertyImage = propertyImage;
    }

    public String getPropertyArea() {
        return propertyArea;
    }

    public void setPropertyArea(String propertyArea) {
        this.propertyArea = propertyArea;
    }

    public String getPropertyCity() {
        return propertyCity;
    }

    public void setPropertyCity(String propertyCity) {
        this.propertyCity = propertyCity;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public String getLandlordId() {
        return landlordId;
    }

    public void setLandlordId(String landlordId) {
        this.landlordId = landlordId;
    }

    public String getLandlordName() {
        return landlordName;
    }

    public void setLandlordName(String landlordName) {
        this.landlordName = landlordName;
    }

    public BigDecimal getApprovedMonthlyRent() {
        return approvedMonthlyRent;
    }

    public void setApprovedMonthlyRent(
        BigDecimal approvedMonthlyRent
    ) {
        this.approvedMonthlyRent = approvedMonthlyRent;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(
        BigDecimal securityDeposit
    ) {
        this.securityDeposit = securityDeposit;
    }

    public BigDecimal getMaintenanceCharge() {
        return maintenanceCharge;
    }

    public void setMaintenanceCharge(
        BigDecimal maintenanceCharge
    ) {
        this.maintenanceCharge = maintenanceCharge;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(
        BigDecimal totalAmount
    ) {
        this.totalAmount = totalAmount;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(
        String razorpayOrderId
    ) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(
        String razorpayPaymentId
    ) {
        this.razorpayPaymentId = razorpayPaymentId;
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
        this.paymentDate = paymentDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
        LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
        LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}