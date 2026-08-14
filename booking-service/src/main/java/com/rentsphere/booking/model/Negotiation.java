package com.rentsphere.booking.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

@Entity
@Table(name = "negotiations")
public class Negotiation {

    @Id
    @GeneratedValue(
        strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
        name = "property_id",
        nullable = false
    )
    private Long propertyId;

    @Column(
        name = "property_title",
        nullable = false,
        length = 200
    )
    private String propertyTitle;

    @Column(
        name = "tenant_id",
        nullable = false,
        length = 150
    )
    private String tenantId;

    @Column(
        name = "tenant_name",
        length = 150
    )
    private String tenantName;

    @Column(
        name = "tenant_email",
        length = 180
    )
    private String tenantEmail;

    @Column(
        name = "landlord_id",
        nullable = false,
        length = 150
    )
    private String landlordId;

    @Column(
        name = "landlord_name",
        length = 150
    )
    private String landlordName;

    @Column(
        name = "listed_rent",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal listedRent;

    @Column(
        name = "tenant_proposed_rent",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal tenantProposedRent;

    @Column(
        name = "landlord_counter_rent",
        precision = 12,
        scale = 2
    )
    private BigDecimal landlordCounterRent;

    @Column(
        name = "agreed_rent",
        precision = 12,
        scale = 2
    )
    private BigDecimal agreedRent;

    @Column(
        name = "tenant_message",
        length = 1000
    )
    private String tenantMessage;

    @Column(
        name = "landlord_message",
        length = 1000
    )
    private String landlordMessage;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false
    )
    private NegotiationStatus status;

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {

        LocalDateTime now =
            LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status =
                NegotiationStatus.PENDING;
        }
    }

    @PreUpdate
    public void preUpdate() {
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