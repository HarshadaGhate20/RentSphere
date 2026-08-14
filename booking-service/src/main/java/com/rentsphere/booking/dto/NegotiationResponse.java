package com.rentsphere.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.rentsphere.booking.model.NegotiationStatus;

public class NegotiationResponse {

    private Long id;

    private Long propertyId;

    private String propertyTitle;

    private String tenantId;

    private String tenantName;

    private String tenantEmail;

    private String landlordId;

    private String landlordName;

    private BigDecimal listedRent;

    private BigDecimal tenantProposedRent;

    private BigDecimal landlordCounterRent;

    private BigDecimal agreedRent;

    private String tenantMessage;

    private String landlordMessage;

    private NegotiationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(
        Long id
    ) {
        this.id = id;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(
        Long propertyId
    ) {
        this.propertyId = propertyId;
    }

    public String getPropertyTitle() {
        return propertyTitle;
    }

    public void setPropertyTitle(
        String propertyTitle
    ) {
        this.propertyTitle = propertyTitle;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(
        String tenantId
    ) {
        this.tenantId = tenantId;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(
        String tenantName
    ) {
        this.tenantName = tenantName;
    }

    public String getTenantEmail() {
        return tenantEmail;
    }

    public void setTenantEmail(
        String tenantEmail
    ) {
        this.tenantEmail = tenantEmail;
    }

    public String getLandlordId() {
        return landlordId;
    }

    public void setLandlordId(
        String landlordId
    ) {
        this.landlordId = landlordId;
    }

    public String getLandlordName() {
        return landlordName;
    }

    public void setLandlordName(
        String landlordName
    ) {
        this.landlordName = landlordName;
    }

    public BigDecimal getListedRent() {
        return listedRent;
    }

    public void setListedRent(
        BigDecimal listedRent
    ) {
        this.listedRent = listedRent;
    }

    public BigDecimal getTenantProposedRent() {
        return tenantProposedRent;
    }

    public void setTenantProposedRent(
        BigDecimal tenantProposedRent
    ) {
        this.tenantProposedRent =
            tenantProposedRent;
    }

    public BigDecimal getLandlordCounterRent() {
        return landlordCounterRent;
    }

    public void setLandlordCounterRent(
        BigDecimal landlordCounterRent
    ) {
        this.landlordCounterRent =
            landlordCounterRent;
    }

    public BigDecimal getAgreedRent() {
        return agreedRent;
    }

    public void setAgreedRent(
        BigDecimal agreedRent
    ) {
        this.agreedRent = agreedRent;
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

    public NegotiationStatus getStatus() {
        return status;
    }

    public void setStatus(
        NegotiationStatus status
    ) {
        this.status = status;
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