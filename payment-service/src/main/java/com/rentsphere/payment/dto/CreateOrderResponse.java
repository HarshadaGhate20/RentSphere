package com.rentsphere.payment.dto;

import java.math.BigDecimal;

public class CreateOrderResponse {

    private Long paymentRecordId;

    private String bookingId;
    private String razorpayOrderId;
    private String razorpayKeyId;

    private Long amountInPaise;
    private BigDecimal amountInRupees;

    private String currency;

    private String tenantName;
    private String propertyTitle;

    public CreateOrderResponse() {
    }

	public Long getPaymentRecordId() {
		return paymentRecordId;
	}

	public void setPaymentRecordId(Long paymentRecordId) {
		this.paymentRecordId = paymentRecordId;
	}

	public String getBookingId() {
		return bookingId;
	}

	public void setBookingId(String bookingId) {
		this.bookingId = bookingId;
	}

	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}

	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}

	public String getRazorpayKeyId() {
		return razorpayKeyId;
	}

	public void setRazorpayKeyId(String razorpayKeyId) {
		this.razorpayKeyId = razorpayKeyId;
	}

	public Long getAmountInPaise() {
		return amountInPaise;
	}

	public void setAmountInPaise(Long amountInPaise) {
		this.amountInPaise = amountInPaise;
	}

	public BigDecimal getAmountInRupees() {
		return amountInRupees;
	}

	public void setAmountInRupees(BigDecimal amountInRupees) {
		this.amountInRupees = amountInRupees;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public String getPropertyTitle() {
		return propertyTitle;
	}

	public void setPropertyTitle(String propertyTitle) {
		this.propertyTitle = propertyTitle;
	}

    // Generate all getters and setters.
    
}