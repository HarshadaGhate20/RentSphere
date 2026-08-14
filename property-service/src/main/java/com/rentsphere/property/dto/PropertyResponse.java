package com.rentsphere.property.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.rentsphere.property.enums.PricingType;
import com.rentsphere.property.enums.PropertyApprovalStatus;
import com.rentsphere.property.enums.PropertyRentalStatus;

public class PropertyResponse {

    /* =========================================================
       BASIC DETAILS
       ========================================================= */

    private Long id;

    private String title;

    private String category;

    private String description;


    /* =========================================================
       PRICING
       ========================================================= */

    private PricingType pricingType;

    /*
     * Apartment / House monthly pricing
     */
    private BigDecimal monthlyRent;

    /*
     * Villa pricing
     */
    private BigDecimal dailyRent;

    /*
     * PG pricing
     */
    private BigDecimal rentPerBed;

    private BigDecimal securityDeposit;

    private BigDecimal maintenanceCharge;


    /* =========================================================
       NORMAL PROPERTY DETAILS
       ========================================================= */

    private Integer bedrooms;

    private Integer bathrooms;

    private Integer balconies;

    private Integer areaSqft;

    private String furnishingStatus;

    private Integer floorNumber;

    private Integer totalFloors;

    private Boolean parkingAvailable;


    /* =========================================================
       LOCATION
       ========================================================= */

    private String addressLine1;

    private String addressLine2;

    private String area;

    private String city;

    private String state;

    private String pincode;


    /* =========================================================
       AVAILABILITY
       ========================================================= */

    private String availabilityType;

    private LocalDate availableFrom;


    /* =========================================================
       AMENITIES
       ========================================================= */

    private List<String> amenities =
            new ArrayList<>();


    /* =========================================================
       PG DETAILS
       ========================================================= */

    private Integer totalRooms;

    private Integer totalBeds;

    private Integer availableBeds;

    private String sharingType;

    private String genderPreference;

    private String roomType;

    private BigDecimal depositPerBed;

    private Boolean foodIncluded;

    private Boolean wifiAvailable;

    private Boolean laundryAvailable;

    private Boolean housekeepingAvailable;

    private Boolean attachedBathroom;


    /* =========================================================
       VILLA DETAILS
       ========================================================= */

    private Integer minimumStayDays;

    private Integer maximumStayDays;

    private Integer maximumGuests;

    private String checkInTime;

    private String checkOutTime;


    /* =========================================================
       STATUS
       ========================================================= */

    private PropertyApprovalStatus approvalStatus;

    private PropertyRentalStatus rentalStatus;

    private String rejectionReason;


    /* =========================================================
       LANDLORD
       ========================================================= */

    private String landlordId;

    private String landlordName;


    /* =========================================================
       IMAGE INFORMATION

       image/imageUrl = main cover image

       photos = all images
       ========================================================= */

    private String image;

    private String imageUrl;

    private List<PropertyPhotoResponse> photos =
            new ArrayList<>();


    /* =========================================================
       AUDIT
       ========================================================= */

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    /* =========================================================
       CONSTRUCTOR
       ========================================================= */

    public PropertyResponse() {
    }


    /* =========================================================
       ID
       ========================================================= */

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }


    /* =========================================================
       TITLE
       ========================================================= */

    public String getTitle() {
        return title;
    }

    public void setTitle(
            String title
    ) {
        this.title = title;
    }


    /* =========================================================
       CATEGORY
       ========================================================= */

    public String getCategory() {
        return category;
    }

    public void setCategory(
            String category
    ) {
        this.category = category;
    }


    /* =========================================================
       DESCRIPTION
       ========================================================= */

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description
    ) {
        this.description = description;
    }


    /* =========================================================
       PRICING TYPE
       ========================================================= */

    public PricingType getPricingType() {
        return pricingType;
    }

    public void setPricingType(
            PricingType pricingType
    ) {
        this.pricingType = pricingType;
    }


    /* =========================================================
       MONTHLY RENT
       ========================================================= */

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(
            BigDecimal monthlyRent
    ) {
        this.monthlyRent = monthlyRent;
    }


    /* =========================================================
       DAILY RENT
       ========================================================= */

    public BigDecimal getDailyRent() {
        return dailyRent;
    }

    public void setDailyRent(
            BigDecimal dailyRent
    ) {
        this.dailyRent = dailyRent;
    }


    /* =========================================================
       RENT PER BED
       ========================================================= */

    public BigDecimal getRentPerBed() {
        return rentPerBed;
    }

    public void setRentPerBed(
            BigDecimal rentPerBed
    ) {
        this.rentPerBed = rentPerBed;
    }


    /* =========================================================
       SECURITY DEPOSIT
       ========================================================= */

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(
            BigDecimal securityDeposit
    ) {
        this.securityDeposit =
                securityDeposit;
    }


    /* =========================================================
       MAINTENANCE
       ========================================================= */

    public BigDecimal getMaintenanceCharge() {
        return maintenanceCharge;
    }

    public void setMaintenanceCharge(
            BigDecimal maintenanceCharge
    ) {
        this.maintenanceCharge =
                maintenanceCharge;
    }


    /* =========================================================
       BEDROOMS
       ========================================================= */

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(
            Integer bedrooms
    ) {
        this.bedrooms = bedrooms;
    }


    /* =========================================================
       BATHROOMS
       ========================================================= */

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(
            Integer bathrooms
    ) {
        this.bathrooms = bathrooms;
    }


    /* =========================================================
       BALCONIES
       ========================================================= */

    public Integer getBalconies() {
        return balconies;
    }

    public void setBalconies(
            Integer balconies
    ) {
        this.balconies = balconies;
    }


    /* =========================================================
       AREA SQFT
       ========================================================= */

    public Integer getAreaSqft() {
        return areaSqft;
    }

    public void setAreaSqft(
            Integer areaSqft
    ) {
        this.areaSqft = areaSqft;
    }


    /* =========================================================
       FURNISHING
       ========================================================= */

    public String getFurnishingStatus() {
        return furnishingStatus;
    }

    public void setFurnishingStatus(
            String furnishingStatus
    ) {
        this.furnishingStatus =
                furnishingStatus;
    }


    /* =========================================================
       FLOOR
       ========================================================= */

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(
            Integer floorNumber
    ) {
        this.floorNumber = floorNumber;
    }


    public Integer getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(
            Integer totalFloors
    ) {
        this.totalFloors = totalFloors;
    }


    /* =========================================================
       PARKING
       ========================================================= */

    public Boolean getParkingAvailable() {
        return parkingAvailable;
    }

    public void setParkingAvailable(
            Boolean parkingAvailable
    ) {
        this.parkingAvailable =
                parkingAvailable;
    }


    /* =========================================================
       ADDRESS
       ========================================================= */

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(
            String addressLine1
    ) {
        this.addressLine1 = addressLine1;
    }


    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(
            String addressLine2
    ) {
        this.addressLine2 = addressLine2;
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
        this.pincode = pincode;
    }


    /* =========================================================
       AVAILABILITY
       ========================================================= */

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
        this.availableFrom = availableFrom;
    }


    /* =========================================================
       AMENITIES
       ========================================================= */

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


    /* =========================================================
       PG - TOTAL ROOMS
       ========================================================= */

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(
            Integer totalRooms
    ) {
        this.totalRooms = totalRooms;
    }


    /* =========================================================
       PG - TOTAL BEDS
       ========================================================= */

    public Integer getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(
            Integer totalBeds
    ) {
        this.totalBeds = totalBeds;
    }


    /* =========================================================
       PG - AVAILABLE BEDS
       ========================================================= */

    public Integer getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(
            Integer availableBeds
    ) {
        this.availableBeds =
                availableBeds;
    }


    /* =========================================================
       PG - SHARING
       ========================================================= */

    public String getSharingType() {
        return sharingType;
    }

    public void setSharingType(
            String sharingType
    ) {
        this.sharingType =
                sharingType;
    }


    /* =========================================================
       PG - GENDER
       ========================================================= */

    public String getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(
            String genderPreference
    ) {
        this.genderPreference =
                genderPreference;
    }


    /* =========================================================
       PG - ROOM TYPE
       ========================================================= */

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(
            String roomType
    ) {
        this.roomType = roomType;
    }


    /* =========================================================
       PG - DEPOSIT PER BED
       ========================================================= */

    public BigDecimal getDepositPerBed() {
        return depositPerBed;
    }

    public void setDepositPerBed(
            BigDecimal depositPerBed
    ) {
        this.depositPerBed =
                depositPerBed;
    }


    /* =========================================================
       PG FACILITIES
       ========================================================= */

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


    /* =========================================================
       VILLA - MINIMUM STAY
       ========================================================= */

    public Integer getMinimumStayDays() {
        return minimumStayDays;
    }

    public void setMinimumStayDays(
            Integer minimumStayDays
    ) {
        this.minimumStayDays =
                minimumStayDays;
    }


    /* =========================================================
       VILLA - MAXIMUM STAY
       ========================================================= */

    public Integer getMaximumStayDays() {
        return maximumStayDays;
    }

    public void setMaximumStayDays(
            Integer maximumStayDays
    ) {
        this.maximumStayDays =
                maximumStayDays;
    }


    /* =========================================================
       VILLA - GUESTS
       ========================================================= */

    public Integer getMaximumGuests() {
        return maximumGuests;
    }

    public void setMaximumGuests(
            Integer maximumGuests
    ) {
        this.maximumGuests =
                maximumGuests;
    }


    /* =========================================================
       VILLA - CHECK-IN
       ========================================================= */

    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(
            String checkInTime
    ) {
        this.checkInTime =
                checkInTime;
    }


    /* =========================================================
       VILLA - CHECK-OUT
       ========================================================= */

    public String getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(
            String checkOutTime
    ) {
        this.checkOutTime =
                checkOutTime;
    }


    /* =========================================================
       APPROVAL STATUS
       ========================================================= */

    public PropertyApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(
            PropertyApprovalStatus approvalStatus
    ) {
        this.approvalStatus =
                approvalStatus;
    }


    /* =========================================================
       RENTAL STATUS
       ========================================================= */

    public PropertyRentalStatus getRentalStatus() {
        return rentalStatus;
    }

    public void setRentalStatus(
            PropertyRentalStatus rentalStatus
    ) {
        this.rentalStatus =
                rentalStatus;
    }


    /* =========================================================
       REJECTION
       ========================================================= */

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(
            String rejectionReason
    ) {
        this.rejectionReason =
                rejectionReason;
    }


    /* =========================================================
       LANDLORD
       ========================================================= */

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


    /* =========================================================
       MAIN IMAGE
       ========================================================= */

    public String getImage() {
        return image;
    }

    public void setImage(
            String image
    ) {
        this.image = image;
    }


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(
            String imageUrl
    ) {
        this.imageUrl = imageUrl;
    }


    /* =========================================================
       ALL PHOTOS
       ========================================================= */

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


    /* =========================================================
       CREATED AT
       ========================================================= */

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    /* =========================================================
       UPDATED AT
       ========================================================= */

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}