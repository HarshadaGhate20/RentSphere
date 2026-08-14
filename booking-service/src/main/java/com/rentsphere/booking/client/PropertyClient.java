package com.rentsphere.booking.client;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PropertyClient {

    private final RestClient restClient;

    /*
     * =========================================================
     * CONSTRUCTOR
     * =========================================================
     *
     * IMPORTANT:
     *
     * We are NOT using:
     *
     * RestTemplate
     * RestTemplateBuilder
     *
     * So the previous:
     *
     * ClassNotFoundException:
     * RestTemplateBuilder
     *
     * problem is completely removed.
     * =========================================================
     */
    public PropertyClient(

            @Value(
                "${services.property.base-url:http://localhost:8081}"
            )
            String propertyServiceUrl
    ) {

        this.restClient =
                RestClient
                    .builder()
                    .baseUrl(
                            propertyServiceUrl
                    )
                    .build();
    }

    /* =========================================================
       GET PROPERTY BY ID

       Booking Service
            ↓
       Property Service

       GET:
       http://localhost:8081/api/properties/{id}
    ========================================================= */

    public PropertyServiceResponse
    getPropertyById(
            Long propertyId
    ) {

        if (propertyId == null) {

            throw new IllegalArgumentException(
                    "Property ID is required."
            );
        }

        PropertyServiceResponse response =
                restClient
                    .get()
                    .uri(
                            "/api/properties/{propertyId}",
                            propertyId
                    )
                    .retrieve()
                    .body(
                            PropertyServiceResponse.class
                    );

        if (response == null) {

            throw new IllegalStateException(
                    "Property Service returned an empty response."
            );
        }

        return response;
    }

    /* =========================================================
       BOOK PG BEDS

       Example:

       Before payment:
       availableBeds = 6

       Tenant successfully pays for 1 bed

       After:
       availableBeds = 5

       PATCH:
       /api/properties/{propertyId}/book-pg-beds

       Body:
       {
           "beds": 1
       }
    ========================================================= */

    public void bookPgBeds(
            Long propertyId,
            Integer beds
    ) {

        validateBeds(
                propertyId,
                beds
        );

        Map<String, Integer> body =
                Map.of(
                        "beds",
                        beds
                );

        restClient
            .method(
                    HttpMethod.PATCH
            )
            .uri(
                    "/api/properties/{propertyId}/book-pg-beds",
                    propertyId
            )
            .body(
                    body
            )
            .retrieve()
            .toBodilessEntity();

        System.out.println(
                "PROPERTY CLIENT -> PG BEDS BOOKED: " +
                "propertyId=" +
                propertyId +
                ", beds=" +
                beds
        );
    }

    /* =========================================================
       RELEASE PG BEDS

       Useful later if a paid PG booking
       gets cancelled.

       Example:

       availableBeds = 5
       release 1

       availableBeds = 6
    ========================================================= */

    public void releasePgBeds(
            Long propertyId,
            Integer beds
    ) {

        validateBeds(
                propertyId,
                beds
        );

        Map<String, Integer> body =
                Map.of(
                        "beds",
                        beds
                );

        restClient
            .method(
                    HttpMethod.PATCH
            )
            .uri(
                    "/api/properties/{propertyId}/release-pg-beds",
                    propertyId
            )
            .body(
                    body
            )
            .retrieve()
            .toBodilessEntity();

        System.out.println(
                "PROPERTY CLIENT -> PG BEDS RELEASED: " +
                "propertyId=" +
                propertyId +
                ", beds=" +
                beds
        );
    }

    /* =========================================================
       UPDATE RENTAL STATUS

       Used mainly for Apartment / normal properties.

       Example:

       AVAILABLE
           ↓
       BOOKED

       IMPORTANT:

       Do NOT directly mark a PG BOOKED
       after only one tenant pays.

       PG status is controlled by
       availableBeds.

       availableBeds > 0
           → AVAILABLE

       availableBeds == 0
           → BOOKED
    ========================================================= */

    public void updateRentalStatus(
            Long propertyId,
            String rentalStatus
    ) {

        if (propertyId == null) {

            throw new IllegalArgumentException(
                    "Property ID is required."
            );
        }

        if (
                rentalStatus == null ||
                rentalStatus.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Rental status is required."
            );
        }

        Map<String, String> body =
                Map.of(
                        "rentalStatus",
                        rentalStatus
                );

        restClient
            .method(
                    HttpMethod.PATCH
            )
            .uri(
                    "/api/properties/{propertyId}/rental-status",
                    propertyId
            )
            .body(
                    body
            )
            .retrieve()
            .toBodilessEntity();

        System.out.println(
                "PROPERTY CLIENT -> STATUS UPDATED: " +
                "propertyId=" +
                propertyId +
                ", status=" +
                rentalStatus
        );
    }

    /* =========================================================
       VALIDATE PG BED REQUEST
    ========================================================= */

    private void validateBeds(
            Long propertyId,
            Integer beds
    ) {

        if (propertyId == null) {

            throw new IllegalArgumentException(
                    "Property ID is required."
            );
        }

        if (
                beds == null ||
                beds < 1
        ) {

            throw new IllegalArgumentException(
                    "Number of beds must be at least 1."
            );
        }
    }

    /* =========================================================
       RESPONSE RECEIVED FROM PROPERTY SERVICE

       This inner DTO should match the important fields
       of PropertyResponse.java from Property Service.
    ========================================================= */

    public static class PropertyServiceResponse {

        private Long id;

        private String title;

        private String category;

        private String pricingType;

        private String area;

        private String city;

        private String landlordId;

        private String landlordName;

        private String rentalStatus;

        private String approvalStatus;

        /* -----------------------------------------------------
           NORMAL PROPERTY
        ----------------------------------------------------- */

        private BigDecimal monthlyRent;

        /* -----------------------------------------------------
           VILLA
        ----------------------------------------------------- */

        private BigDecimal dailyRent;

        private Integer minimumStayDays;

        private Integer maximumStayDays;

        private Integer maximumGuests;

        private String checkInTime;

        private String checkOutTime;

        /* -----------------------------------------------------
           PG
        ----------------------------------------------------- */

        private BigDecimal rentPerBed;

        private BigDecimal depositPerBed;

        private Integer totalRooms;

        private Integer totalBeds;

        private Integer availableBeds;

        private String sharingType;

        private String genderPreference;

        private String roomType;

        /* -----------------------------------------------------
           COMMON CHARGES
        ----------------------------------------------------- */

        private BigDecimal securityDeposit;

        private BigDecimal maintenanceCharge;

        /* -----------------------------------------------------
           IMAGE
        ----------------------------------------------------- */

        private String image;

        private List<PropertyPhoto> photos;

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

            this.category =
                    category;
        }

        public String getPricingType() {

            return pricingType;
        }

        public void setPricingType(
                String pricingType
        ) {

            this.pricingType =
                    pricingType;
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

        public String getRentalStatus() {

            return rentalStatus;
        }

        public void setRentalStatus(
                String rentalStatus
        ) {

            this.rentalStatus =
                    rentalStatus;
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

        public BigDecimal getMonthlyRent() {

            return monthlyRent;
        }

        public void setMonthlyRent(
                BigDecimal monthlyRent
        ) {

            this.monthlyRent =
                    monthlyRent;
        }

        public BigDecimal getDailyRent() {

            return dailyRent;
        }

        public void setDailyRent(
                BigDecimal dailyRent
        ) {

            this.dailyRent =
                    dailyRent;
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

        public String getCheckInTime() {

            return checkInTime;
        }

        public void setCheckInTime(
                String checkInTime
        ) {

            this.checkInTime =
                    checkInTime;
        }

        public String getCheckOutTime() {

            return checkOutTime;
        }

        public void setCheckOutTime(
                String checkOutTime
        ) {

            this.checkOutTime =
                    checkOutTime;
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

        public String getImage() {

            return image;
        }

        public void setImage(
                String image
        ) {

            this.image = image;
        }

        public List<PropertyPhoto> getPhotos() {

            return photos;
        }

        public void setPhotos(
                List<PropertyPhoto> photos
        ) {

            this.photos =
                    photos;
        }
    }

    /* =========================================================
       PROPERTY PHOTO DTO
    ========================================================= */

    public static class PropertyPhoto {

        private Long id;

        private String photoUrl;

        private Boolean primary;

        public PropertyPhoto() {
        }

        public Long getId() {

            return id;
        }

        public void setId(
                Long id
        ) {

            this.id = id;
        }

        public String getPhotoUrl() {

            return photoUrl;
        }

        public void setPhotoUrl(
                String photoUrl
        ) {

            this.photoUrl =
                    photoUrl;
        }

        public Boolean getPrimary() {

            return primary;
        }

        public void setPrimary(
                Boolean primary
        ) {

            this.primary =
                    primary;
        }
    }
}