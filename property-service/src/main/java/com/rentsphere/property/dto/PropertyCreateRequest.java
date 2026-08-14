package com.rentsphere.property.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class PropertyCreateRequest {

    /* =========================================================
       BASIC DETAILS
    ========================================================= */

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    private String category;

    @NotBlank
    @Size(
        min = 30,
        max = 1000
    )
    private String description;

    /*
     * MONTHLY
     * DAILY
     * PER_BED_MONTHLY
     */
    private String pricingType;

    /* =========================================================
       NORMAL MONTHLY PROPERTY
    ========================================================= */

    /*
     * IMPORTANT:
     *
     * Do NOT use @NotNull here anymore.
     * Villa and PG may have monthlyRent = null.
     */
    @DecimalMin("1.00")
    private BigDecimal monthlyRent;

    /* =========================================================
       COMMON CHARGES
    ========================================================= */

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal securityDeposit;

    @DecimalMin("0.00")
    private BigDecimal maintenanceCharge;

    /* =========================================================
       VILLA
    ========================================================= */

    @DecimalMin("1.00")
    private BigDecimal dailyRent;

    @Min(1)
    private Integer minimumStayDays;

    @Min(1)
    private Integer maximumStayDays;

    @Min(1)
    private Integer maximumGuests;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;

    /* =========================================================
       PG
    ========================================================= */

    @Min(1)
    private Integer totalRooms;

    @Min(1)
    private Integer totalBeds;

    @Min(0)
    private Integer availableBeds;

    private String sharingType;

    private String genderPreference;

    private String roomType;

    @DecimalMin("1.00")
    private BigDecimal rentPerBed;

    @DecimalMin("0.00")
    private BigDecimal depositPerBed;

    private Boolean foodIncluded;

    private Boolean wifiAvailable;

    private Boolean laundryAvailable;

    private Boolean housekeepingAvailable;

    private Boolean attachedBathroom;

    /* =========================================================
       PROPERTY FEATURES
    ========================================================= */

    @Min(0)
    private Integer bedrooms;

    @Min(0)
    private Integer bathrooms;

    @Min(0)
    private Integer balconies;

    @NotNull
    @Min(1)
    private Integer areaSqft;

    @NotBlank
    private String furnishingStatus;

    @Min(0)
    private Integer floorNumber;

    @Min(1)
    private Integer totalFloors;

    private Boolean parkingAvailable;

    /* =========================================================
       ADDRESS
    ========================================================= */

    @NotBlank
    private String addressLine1;

    private String addressLine2;

    @NotBlank
    private String area;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    @Pattern(
        regexp = "^[1-9][0-9]{5}$"
    )
    private String pincode;

    /* =========================================================
       AVAILABILITY
    ========================================================= */

    @NotBlank
    private String availabilityType;

    @FutureOrPresent
    private LocalDate availableFrom;

    /* =========================================================
       AMENITIES
    ========================================================= */

    private List<String> amenities =
        new ArrayList<>();

    public PropertyCreateRequest() {
    }

    /* =========================================================
       GETTERS AND SETTERS
    ========================================================= */

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

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description
    ) {
        this.description = description;
    }

    public String getPricingType() {
        return pricingType;
    }

    public void setPricingType(
            String pricingType
    ) {
        this.pricingType = pricingType;
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

    public BigDecimal getDailyRent() {
        return dailyRent;
    }

    public void setDailyRent(
            BigDecimal dailyRent
    ) {
        this.dailyRent = dailyRent;
    }

    public Integer getMinimumStayDays() {
        return minimumStayDays;
    }

    public void setMinimumStayDays(
            Integer minimumStayDays
    ) {
        this.minimumStayDays =
            minimumStayDays;
    }

    public Integer getMaximumStayDays() {
        return maximumStayDays;
    }

    public void setMaximumStayDays(
            Integer maximumStayDays
    ) {
        this.maximumStayDays =
            maximumStayDays;
    }

    public Integer getMaximumGuests() {
        return maximumGuests;
    }

    public void setMaximumGuests(
            Integer maximumGuests
    ) {
        this.maximumGuests =
            maximumGuests;
    }

    public LocalTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(
            LocalTime checkInTime
    ) {
        this.checkInTime =
            checkInTime;
    }

    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(
            LocalTime checkOutTime
    ) {
        this.checkOutTime =
            checkOutTime;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(
            Integer totalRooms
    ) {
        this.totalRooms =
            totalRooms;
    }

    public Integer getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(
            Integer totalBeds
    ) {
        this.totalBeds =
            totalBeds;
    }

    public Integer getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(
            Integer availableBeds
    ) {
        this.availableBeds =
            availableBeds;
    }

    public String getSharingType() {
        return sharingType;
    }

    public void setSharingType(
            String sharingType
    ) {
        this.sharingType =
            sharingType;
    }

    public String getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(
            String genderPreference
    ) {
        this.genderPreference =
            genderPreference;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(
            String roomType
    ) {
        this.roomType =
            roomType;
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

    public Boolean getFoodIncluded() {
        return foodIncluded;
    }

    public void setFoodIncluded(
            Boolean foodIncluded
    ) {
        this.foodIncluded =
            foodIncluded;
    }

    public Boolean getWifiAvailable() {
        return wifiAvailable;
    }

    public void setWifiAvailable(
            Boolean wifiAvailable
    ) {
        this.wifiAvailable =
            wifiAvailable;
    }

    public Boolean getLaundryAvailable() {
        return laundryAvailable;
    }

    public void setLaundryAvailable(
            Boolean laundryAvailable
    ) {
        this.laundryAvailable =
            laundryAvailable;
    }

    public Boolean getHousekeepingAvailable() {
        return housekeepingAvailable;
    }

    public void setHousekeepingAvailable(
            Boolean housekeepingAvailable
    ) {
        this.housekeepingAvailable =
            housekeepingAvailable;
    }

    public Boolean getAttachedBathroom() {
        return attachedBathroom;
    }

    public void setAttachedBathroom(
            Boolean attachedBathroom
    ) {
        this.attachedBathroom =
            attachedBathroom;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(
            Integer bedrooms
    ) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(
            Integer bathrooms
    ) {
        this.bathrooms = bathrooms;
    }

    public Integer getBalconies() {
        return balconies;
    }

    public void setBalconies(
            Integer balconies
    ) {
        this.balconies = balconies;
    }

    public Integer getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(
            Integer areaSqft
    ) {
        this.areaSqft =
            areaSqft;
    }

    public String getFurnishingStatus() {
        return furnishingStatus;
    }

    public void setFurnishingStatus(
            String furnishingStatus
    ) {
        this.furnishingStatus =
            furnishingStatus;
    }

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(
            Integer floorNumber
    ) {
        this.floorNumber =
            floorNumber;
    }

    public Integer getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(
            Integer totalFloors
    ) {
        this.totalFloors =
            totalFloors;
    }

    public Boolean getParkingAvailable() {
        return parkingAvailable;
    }

    public void setParkingAvailable(
            Boolean parkingAvailable
    ) {
        this.parkingAvailable =
            parkingAvailable;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(
            String addressLine1
    ) {
        this.addressLine1 =
            addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(
            String addressLine2
    ) {
        this.addressLine2 =
            addressLine2;
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

    public String getState() {
        return state;
    }

    public void setState(
            String state
    ) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(
            String pincode
    ) {
        this.pincode =
            pincode;
    }

    public String getAvailabilityType() {
        return availabilityType;
    }

    public void setAvailabilityType(
            String availabilityType
    ) {
        this.availabilityType =
            availabilityType;
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

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(
            List<String> amenities
    ) {
        this.amenities =
            amenities == null
                ? new ArrayList<>()
                : amenities;
    }
}