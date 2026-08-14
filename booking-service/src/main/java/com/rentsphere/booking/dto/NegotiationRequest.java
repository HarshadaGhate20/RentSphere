package com.rentsphere.booking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public class NegotiationRequest {

    @NotNull
    private Long propertyId;

    @NotBlank
    private String tenantId;

    private String tenantName;

    private String tenantEmail;

    @NotNull
    @Positive
    private BigDecimal proposedRent;

    @NotNull
    @Positive
    @JsonProperty("listedRent")
    @JsonAlias("listed_rent")
    private BigDecimal listedRent;

    private String tenantMessage;

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(
        Long propertyId
    ) {
        this.propertyId = propertyId;
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

    public BigDecimal getProposedRent() {
        return proposedRent;
    }

    public BigDecimal getListedRent() { return listedRent; }
    public void setListedRent(BigDecimal listedRent) { this.listedRent = listedRent; }

    public void setProposedRent(
        BigDecimal proposedRent
    ) {
        this.proposedRent = proposedRent;
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
}
