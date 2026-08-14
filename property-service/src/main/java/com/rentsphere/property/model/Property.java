package com.rentsphere.property.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rentsphere.property.enums.PricingType;
import com.rentsphere.property.enums.PropertyApprovalStatus;
import com.rentsphere.property.enums.PropertyRentalStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "properties")
public class Property {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 150) private String title;
    @Column(nullable = false, length = 80) private String category;
    @Column(nullable = false, length = 1000) private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 40) private PricingType pricingType = PricingType.MONTHLY;
    @Column(precision = 12, scale = 2) private BigDecimal monthlyRent;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal securityDeposit = BigDecimal.ZERO;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal maintenanceCharge = BigDecimal.ZERO;
    @Column(precision = 12, scale = 2) private BigDecimal dailyRent;
    private Integer minimumStayDays;
    private Integer maximumStayDays;
    private Integer maximumGuests;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Integer totalRooms;
    private Integer totalBeds;
    private Integer availableBeds;
    private String sharingType;
    private String genderPreference;
    private String roomType;
    @Column(precision = 12, scale = 2) private BigDecimal rentPerBed;
    @Column(precision = 12, scale = 2) private BigDecimal depositPerBed;
    private Boolean foodIncluded = false;
    private Boolean wifiAvailable = false;
    private Boolean laundryAvailable = false;
    private Boolean housekeepingAvailable = false;
    private Boolean attachedBathroom = false;
    private Integer bedrooms = 0;
    private Integer bathrooms = 0;
    private Integer balconies = 0;
    @Column(nullable = false) private Integer areaSqft;
    @Column(nullable = false, length = 80) private String furnishingStatus;
    private Integer floorNumber;
    private Integer totalFloors;
    @Column(nullable = false) private Boolean parkingAvailable = false;
    @Column(nullable = false, length = 250) private String addressLine1;
    private String addressLine2;
    @Column(nullable = false, length = 100) private String area;
    @Column(nullable = false, length = 100) private String city;
    @Column(nullable = false, length = 100) private String state;
    @Column(nullable = false, length = 6) private String pincode;
    @Column(nullable = false, length = 50) private String availabilityType;
    private LocalDate availableFrom;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity") private List<String> amenities = new ArrayList<>();
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private PropertyApprovalStatus approvalStatus = PropertyApprovalStatus.PENDING;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 40) private PropertyRentalStatus rentalStatus = PropertyRentalStatus.AVAILABLE;
    private String rejectionReason;
    @Column(nullable = false, length = 100) private String landlordId;
    private String landlordName;
    @Column(nullable = false) private LocalDateTime createdAt;
    @Column(nullable = false) private LocalDateTime updatedAt;
    @JsonIgnore @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC") private List<PropertyPhoto> photos = new ArrayList<>();

    @PrePersist public void beforeCreate() { LocalDateTime now = LocalDateTime.now(); createdAt = now; updatedAt = now; applyDefaults(); }
    @PreUpdate public void beforeUpdate() { updatedAt = LocalDateTime.now(); applyDefaults(); }
    private void applyDefaults() {
        if (pricingType == null) pricingType = PricingType.MONTHLY;
        if (securityDeposit == null) securityDeposit = BigDecimal.ZERO;
        if (maintenanceCharge == null) maintenanceCharge = BigDecimal.ZERO;
        if (availableBeds == null) availableBeds = 0;
        if (amenities == null) amenities = new ArrayList<>();
    }

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getCategory(){return category;} public void setCategory(String v){category=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public PricingType getPricingType(){return pricingType;} public void setPricingType(PricingType v){pricingType=v;}
    public BigDecimal getMonthlyRent(){return monthlyRent;} public void setMonthlyRent(BigDecimal v){monthlyRent=v;}
    public BigDecimal getSecurityDeposit(){return securityDeposit;} public void setSecurityDeposit(BigDecimal v){securityDeposit=v;}
    public BigDecimal getMaintenanceCharge(){return maintenanceCharge;} public void setMaintenanceCharge(BigDecimal v){maintenanceCharge=v;}
    public BigDecimal getDailyRent(){return dailyRent;} public void setDailyRent(BigDecimal v){dailyRent=v;}
    public Integer getMinimumStayDays(){return minimumStayDays;} public void setMinimumStayDays(Integer v){minimumStayDays=v;}
    public Integer getMaximumStayDays(){return maximumStayDays;} public void setMaximumStayDays(Integer v){maximumStayDays=v;}
    public Integer getMaximumGuests(){return maximumGuests;} public void setMaximumGuests(Integer v){maximumGuests=v;}
    public LocalTime getCheckInTime(){return checkInTime;} public void setCheckInTime(LocalTime v){checkInTime=v;}
    public LocalTime getCheckOutTime(){return checkOutTime;} public void setCheckOutTime(LocalTime v){checkOutTime=v;}
    public Integer getTotalRooms(){return totalRooms;} public void setTotalRooms(Integer v){totalRooms=v;}
    public Integer getTotalBeds(){return totalBeds;} public void setTotalBeds(Integer v){totalBeds=v;}
    public Integer getAvailableBeds(){return availableBeds;} public void setAvailableBeds(Integer v){availableBeds=v;}
    public String getSharingType(){return sharingType;} public void setSharingType(String v){sharingType=v;}
    public String getGenderPreference(){return genderPreference;} public void setGenderPreference(String v){genderPreference=v;}
    public String getRoomType(){return roomType;} public void setRoomType(String v){roomType=v;}
    public BigDecimal getRentPerBed(){return rentPerBed;} public void setRentPerBed(BigDecimal v){rentPerBed=v;}
    public BigDecimal getDepositPerBed(){return depositPerBed;} public void setDepositPerBed(BigDecimal v){depositPerBed=v;}
    public Boolean getFoodIncluded(){return foodIncluded;} public void setFoodIncluded(Boolean v){foodIncluded=v;}
    public Boolean getWifiAvailable(){return wifiAvailable;} public void setWifiAvailable(Boolean v){wifiAvailable=v;}
    public Boolean getLaundryAvailable(){return laundryAvailable;} public void setLaundryAvailable(Boolean v){laundryAvailable=v;}
    public Boolean getHousekeepingAvailable(){return housekeepingAvailable;} public void setHousekeepingAvailable(Boolean v){housekeepingAvailable=v;}
    public Boolean getAttachedBathroom(){return attachedBathroom;} public void setAttachedBathroom(Boolean v){attachedBathroom=v;}
    public Integer getBedrooms(){return bedrooms;} public void setBedrooms(Integer v){bedrooms=v;}
    public Integer getBathrooms(){return bathrooms;} public void setBathrooms(Integer v){bathrooms=v;}
    public Integer getBalconies(){return balconies;} public void setBalconies(Integer v){balconies=v;}
    public Integer getAreaSqft(){return areaSqft;} public void setAreaSqft(Integer v){areaSqft=v;}
    public String getFurnishingStatus(){return furnishingStatus;} public void setFurnishingStatus(String v){furnishingStatus=v;}
    public Integer getFloorNumber(){return floorNumber;} public void setFloorNumber(Integer v){floorNumber=v;}
    public Integer getTotalFloors(){return totalFloors;} public void setTotalFloors(Integer v){totalFloors=v;}
    public Boolean getParkingAvailable(){return parkingAvailable;} public void setParkingAvailable(Boolean v){parkingAvailable=v;}
    public String getAddressLine1(){return addressLine1;} public void setAddressLine1(String v){addressLine1=v;}
    public String getAddressLine2(){return addressLine2;} public void setAddressLine2(String v){addressLine2=v;}
    public String getArea(){return area;} public void setArea(String v){area=v;}
    public String getCity(){return city;} public void setCity(String v){city=v;}
    public String getState(){return state;} public void setState(String v){state=v;}
    public String getPincode(){return pincode;} public void setPincode(String v){pincode=v;}
    public String getAvailabilityType(){return availabilityType;} public void setAvailabilityType(String v){availabilityType=v;}
    public LocalDate getAvailableFrom(){return availableFrom;} public void setAvailableFrom(LocalDate v){availableFrom=v;}
    public List<String> getAmenities(){return amenities;} public void setAmenities(List<String> v){amenities=v;}
    public PropertyApprovalStatus getApprovalStatus(){return approvalStatus;} public void setApprovalStatus(PropertyApprovalStatus v){approvalStatus=v;}
    public PropertyRentalStatus getRentalStatus(){return rentalStatus;} public void setRentalStatus(PropertyRentalStatus v){rentalStatus=v;}
    public String getRejectionReason(){return rejectionReason;} public void setRejectionReason(String v){rejectionReason=v;}
    public String getLandlordId(){return landlordId;} public void setLandlordId(String v){landlordId=v;}
    public String getLandlordName(){return landlordName;} public void setLandlordName(String v){landlordName=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
    public List<PropertyPhoto> getPhotos(){return photos;} public void setPhotos(List<PropertyPhoto> v){photos=v;}
}
