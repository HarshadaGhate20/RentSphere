package com.rentsphere.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PropertyServiceResponse {

    private Long id;

    private String title;
    private String category;

    private BigDecimal monthlyRent;
    private BigDecimal dailyRent;
    private BigDecimal rentPerBed;
    private String pricingType;
    private BigDecimal securityDeposit;
    private BigDecimal maintenanceCharge;

    private String area;
    private String city;

    private String landlordId;
    private String landlordName;

    private String approvalStatus;
    private String rentalStatus;

    private LocalDate availableFrom;

    private List<PropertyPhotoResponse> photos =
            new ArrayList<>();

    public PropertyServiceResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(
            String title
    ) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(
            String category
    ) {
        this.category = category;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(
            BigDecimal monthlyRent
    ) {
        this.monthlyRent =
                monthlyRent;
    }

    public BigDecimal getDailyRent() { return dailyRent; }
    public void setDailyRent(BigDecimal dailyRent) { this.dailyRent = dailyRent; }
    public BigDecimal getRentPerBed() { return rentPerBed; }
    public void setRentPerBed(BigDecimal rentPerBed) { this.rentPerBed = rentPerBed; }
    public String getPricingType() { return pricingType; }
    public void setPricingType(String pricingType) { this.pricingType = pricingType; }

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

    public String getArea() {
        return area;
    }

    public void setArea(
            String area
    ) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(
            String city
    ) {
        this.city = city;
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

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(
            String approvalStatus
    ) {
        this.approvalStatus =
                approvalStatus;
    }

    public String getRentalStatus() {
        return rentalStatus;
    }

    public void setRentalStatus(
            String rentalStatus
    ) {
        this.rentalStatus =
                rentalStatus;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(
            LocalDate availableFrom
    ) {
        this.availableFrom =
                availableFrom;
    }

    public List<PropertyPhotoResponse> getPhotos() {
        return photos;
    }

    public void setPhotos(
            List<PropertyPhotoResponse> photos
    ) {
        this.photos =
                photos == null
                        ? new ArrayList<>()
                        : photos;
    }
}
