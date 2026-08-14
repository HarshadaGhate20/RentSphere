package com.rentsphere.property.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.rentsphere.property.dto.PropertyCreateRequest;
import com.rentsphere.property.dto.PropertyPhotoResponse;
import com.rentsphere.property.dto.PropertyResponse;

import com.rentsphere.property.enums.PropertyApprovalStatus;
import com.rentsphere.property.enums.PropertyRentalStatus;
import com.rentsphere.property.enums.PricingType;

import com.rentsphere.property.exception.PropertyNotFoundException;

import com.rentsphere.property.model.Property;
import com.rentsphere.property.model.PropertyPhoto;

import com.rentsphere.property.repository.PropertyPhotoRepository;
import com.rentsphere.property.repository.PropertyRepository;

@Service
@Transactional
public class PropertyServiceImpl
        implements PropertyService {

    private static final int MAX_IMAGES = 8;

    private final PropertyRepository propertyRepository;

    private final PropertyPhotoRepository propertyPhotoRepository;

    private final FileStorageService fileStorageService;

    public PropertyServiceImpl(
            PropertyRepository propertyRepository,
            PropertyPhotoRepository propertyPhotoRepository,
            FileStorageService fileStorageService
    ) {

        this.propertyRepository =
                propertyRepository;

        this.propertyPhotoRepository =
                propertyPhotoRepository;

        this.fileStorageService =
                fileStorageService;
    }

    /* =========================================================
       CREATE PROPERTY
    ========================================================= */

    @Override
    public PropertyResponse createProperty(

            PropertyCreateRequest request,

            List<MultipartFile> images,

            String landlordId,

            String landlordName
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Property request is required."
            );
        }

        if (
                landlordId == null ||
                landlordId.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Landlord ID is required."
            );
        }

        validateImages(images);

        Property property =
                new Property();

        copyRequestToProperty(
                request,
                property,
                true
        );

        property.setLandlordId(
                landlordId.trim()
        );

        property.setLandlordName(
                landlordName == null ||
                landlordName.isBlank()
                        ? "RentSphere Landlord"
                        : landlordName.trim()
        );

        property.setApprovalStatus(
                PropertyApprovalStatus.PENDING
        );

        property.setRentalStatus(
                PropertyRentalStatus.AVAILABLE
        );

        Property savedProperty =
                propertyRepository.save(
                        property
                );

        /*
         * Save uploaded images.
         */
        for (
                int index = 0;
                index < images.size();
                index++
        ) {

            MultipartFile image =
                    images.get(index);

            if (
                    image == null ||
                    image.isEmpty()
            ) {
                continue;
            }

            String imageUrl =
                    fileStorageService
                            .storePropertyImage(
                                    image,
                                    savedProperty.getId()
                            );

            PropertyPhoto photo =
                    new PropertyPhoto();

            photo.setProperty(
                    savedProperty
            );

            photo.setImageUrl(
                    imageUrl
            );

            /*
             * First image is cover image.
             */
            photo.setCoverImage(
                    index == 0
            );

            photo.setDisplayOrder(
                    index
            );

            propertyPhotoRepository.save(
                    photo
            );
        }

        /*
         * Flush so photo rows are immediately
         * available before building response.
         */
        propertyPhotoRepository.flush();

        return mapToResponse(
                savedProperty
        );
    }

    /* =========================================================
       GET PROPERTY BY ID
    ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(
            Long propertyId
    ) {

        Property property =
                findProperty(
                        propertyId
                );

        return mapToResponse(
                property
        );
    }

    /* =========================================================
       GET PUBLIC APPROVED PROPERTIES
    ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse>
    getPublicProperties() {

        return propertyRepository
                .findByApprovalStatusOrderByCreatedAtDesc(
                        PropertyApprovalStatus.APPROVED
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /* =========================================================
       GET LANDLORD PROPERTIES
    ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse>
    getLandlordProperties(
            String landlordId
    ) {

        if (
                landlordId == null ||
                landlordId.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Landlord ID is required."
            );
        }

        return propertyRepository
                .findByLandlordIdOrderByCreatedAtDesc(
                        landlordId.trim()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /* =========================================================
       ADMIN - GET ALL PROPERTIES
    ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse>
    getAllPropertiesForAdmin() {

        return propertyRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /* =========================================================
       UPDATE PROPERTY
    ========================================================= */

    @Override
    public PropertyResponse updateProperty(

            Long propertyId,

            PropertyCreateRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Property request is required."
            );
        }

        Property property =
                findProperty(
                        propertyId
                );

        Integer oldTotalBeds =
                property.getTotalBeds();

        Integer oldAvailableBeds =
                property.getAvailableBeds();

        copyRequestToProperty(
                request,
                property,
                false
        );

        /*
         * PG:
         * preserve already occupied beds.
         */
        if (
                isPg(property) &&
                oldTotalBeds != null &&
                oldAvailableBeds != null &&
                request.getTotalBeds() != null
        ) {

            int occupiedBeds =
                    Math.max(
                            0,
                            oldTotalBeds
                                    - oldAvailableBeds
                    );

            int newAvailableBeds =
                    Math.max(
                            0,
                            request.getTotalBeds()
                                    - occupiedBeds
                    );

            property.setAvailableBeds(
                    newAvailableBeds
            );

            property.setRentalStatus(
                    newAvailableBeds > 0
                            ? PropertyRentalStatus.AVAILABLE
                            : PropertyRentalStatus.BOOKED
            );
        }

        Property savedProperty =
                propertyRepository.save(
                        property
                );

        return mapToResponse(
                savedProperty
        );
    }

    @Override
    public PropertyResponse updateProperty(
            Long propertyId,
            PropertyCreateRequest request,
            List<MultipartFile> images,
            List<String> keepImageUrls
    ) {
        PropertyResponse response = updateProperty(propertyId, request);
        if (images == null && keepImageUrls == null) return response;

        List<MultipartFile> uploadedImages = images == null ? List.of() : images;
        if (!uploadedImages.isEmpty()) validateImages(uploadedImages);
        Property property = findProperty(propertyId);
        List<PropertyPhoto> oldPhotos = propertyPhotoRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
        List<String> keptUrls = keepImageUrls == null
                ? oldPhotos.stream().map(PropertyPhoto::getImageUrl).toList()
                : keepImageUrls;

        for (PropertyPhoto photo : oldPhotos) {
            boolean keep = keptUrls.stream().anyMatch(value ->
                    value != null && (value.equals(photo.getImageUrl()) || value.endsWith(photo.getImageUrl())));
            if (!keep) {
                propertyPhotoRepository.delete(photo);
                fileStorageService.deleteFile(photo.getImageUrl());
            }
        }
        propertyPhotoRepository.flush();

        List<PropertyPhoto> remaining = propertyPhotoRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
        int displayOrder = 0;
        for (PropertyPhoto photo : remaining) {
            photo.setCoverImage(displayOrder == 0);
            photo.setDisplayOrder(displayOrder++);
            propertyPhotoRepository.save(photo);
        }
        for (MultipartFile image : uploadedImages) {
            if (image == null || image.isEmpty()) continue;
            PropertyPhoto photo = new PropertyPhoto();
            photo.setProperty(property);
            photo.setImageUrl(fileStorageService.storePropertyImage(image, propertyId));
            photo.setCoverImage(displayOrder == 0);
            photo.setDisplayOrder(displayOrder++);
            propertyPhotoRepository.save(photo);
        }
        return mapToResponse(property);
    }

    /* =========================================================
       APPROVE PROPERTY
    ========================================================= */

    @Override
    public PropertyResponse approveProperty(
            Long propertyId
    ) {

        Property property =
                findProperty(
                        propertyId
                );

        property.setApprovalStatus(
                PropertyApprovalStatus.APPROVED
        );

        property.setRejectionReason(
                null
        );

        if (
                property.getRentalStatus() == null
        ) {

            property.setRentalStatus(
                    PropertyRentalStatus.AVAILABLE
            );
        }

        Property saved =
                propertyRepository.save(
                        property
                );

        return mapToResponse(
                saved
        );
    }

    /* =========================================================
       REJECT PROPERTY
    ========================================================= */

    @Override
    public PropertyResponse rejectProperty(

            Long propertyId,

            String rejectionReason
    ) {

        if (
                rejectionReason == null ||
                rejectionReason.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Rejection reason is required."
            );
        }

        Property property =
                findProperty(
                        propertyId
                );

        property.setApprovalStatus(
                PropertyApprovalStatus.REJECTED
        );

        property.setRejectionReason(
                rejectionReason.trim()
        );

        Property saved =
                propertyRepository.save(
                        property
                );

        return mapToResponse(
                saved
        );
    }

    /* =========================================================
       UPDATE RENTAL STATUS
    ========================================================= */

    @Override
    public PropertyResponse updateRentalStatus(

            Long propertyId,

            PropertyRentalStatus rentalStatus
    ) {

        if (rentalStatus == null) {

            throw new IllegalArgumentException(
                    "Rental status is required."
            );
        }

        Property property =
                findProperty(
                        propertyId
                );

        /*
         * PG should stay AVAILABLE while
         * one or more beds remain.
         */
        if (
                isPg(property) &&
                rentalStatus
                        == PropertyRentalStatus.BOOKED &&
                property.getAvailableBeds() != null &&
                property.getAvailableBeds() > 0
        ) {

            property.setRentalStatus(
                    PropertyRentalStatus.AVAILABLE
            );

        } else {

            property.setRentalStatus(
                    rentalStatus
            );
        }

        Property saved =
                propertyRepository.save(
                        property
                );

        return mapToResponse(
                saved
        );
    }

    /* =========================================================
       BOOK PG BEDS
    ========================================================= */

    @Override
    public synchronized PropertyResponse bookPgBeds(

            Long propertyId,

            Integer beds
    ) {

        if (
                beds == null ||
                beds < 1
        ) {

            throw new IllegalArgumentException(
                    "At least one bed must be booked."
            );
        }

        Property property =
                findProperty(
                        propertyId
                );

        if (!isPg(property)) {

            throw new IllegalStateException(
                    "Bed booking is only available for PG properties."
            );
        }

        int availableBeds =
                property.getAvailableBeds() == null
                        ? 0
                        : property.getAvailableBeds();

        if (availableBeds < beds) {

            throw new IllegalStateException(
                    "Only "
                            + availableBeds
                            + " bed(s) are available."
            );
        }

        int remainingBeds =
                availableBeds - beds;

        property.setAvailableBeds(
                remainingBeds
        );

        property.setRentalStatus(
                remainingBeds > 0
                        ? PropertyRentalStatus.AVAILABLE
                        : PropertyRentalStatus.BOOKED
        );

        Property saved =
                propertyRepository.save(
                        property
                );

        System.out.println(
                "PG BED ALLOCATED -> propertyId="
                        + propertyId
                        + ", booked="
                        + beds
                        + ", remainingBeds="
                        + remainingBeds
        );

        return mapToResponse(
                saved
        );
    }

    /* =========================================================
       RELEASE PG BEDS
    ========================================================= */

    @Override
    public synchronized PropertyResponse releasePgBeds(

            Long propertyId,

            Integer beds
    ) {

        if (
                beds == null ||
                beds < 1
        ) {

            throw new IllegalArgumentException(
                    "At least one bed must be released."
            );
        }

        Property property =
                findProperty(
                        propertyId
                );

        if (!isPg(property)) {

            throw new IllegalStateException(
                    "Bed release is only available for PG properties."
            );
        }

        int totalBeds =
                property.getTotalBeds() == null
                        ? 0
                        : property.getTotalBeds();

        int availableBeds =
                property.getAvailableBeds() == null
                        ? 0
                        : property.getAvailableBeds();

        int updatedAvailableBeds =
                Math.min(
                        totalBeds,
                        availableBeds + beds
                );

        property.setAvailableBeds(
                updatedAvailableBeds
        );

        property.setRentalStatus(
                PropertyRentalStatus.AVAILABLE
        );

        Property saved =
                propertyRepository.save(
                        property
                );

        return mapToResponse(
                saved
        );
    }

    /* =========================================================
       COPY REQUEST DATA TO ENTITY
    ========================================================= */

    private void copyRequestToProperty(

            PropertyCreateRequest request,

            Property property,

            boolean creating
    ) {

        property.setTitle(
                request.getTitle()
        );

        property.setCategory(
                request.getCategory()
        );

        property.setDescription(
                request.getDescription()
        );

        property.setPricingType(PricingType.valueOf(request.getPricingType().trim().toUpperCase()));

        property.setMonthlyRent(
                request.getMonthlyRent()
        );

        property.setSecurityDeposit(
                defaultMoney(
                        request.getSecurityDeposit()
                )
        );

        property.setMaintenanceCharge(
                defaultMoney(
                        request.getMaintenanceCharge()
                )
        );

        property.setBedrooms(
                request.getBedrooms()
        );

        property.setBathrooms(
                request.getBathrooms()
        );

        property.setBalconies(
                request.getBalconies()
        );

        property.setAreaSqft(
                request.getAreaSqft()
        );

        property.setFurnishingStatus(
                request.getFurnishingStatus()
        );

        property.setFloorNumber(
                request.getFloorNumber()
        );

        property.setTotalFloors(
                request.getTotalFloors()
        );

        property.setParkingAvailable(
                request.getParkingAvailable()
        );

        property.setAddressLine1(
                request.getAddressLine1()
        );

        property.setAddressLine2(
                request.getAddressLine2()
        );

        property.setArea(
                request.getArea()
        );

        property.setCity(
                request.getCity()
        );

        property.setState(
                request.getState()
        );

        property.setPincode(
                request.getPincode()
        );

        property.setAvailabilityType(
                request.getAvailabilityType()
        );

        property.setAvailableFrom(
                request.getAvailableFrom()
        );

        property.setAmenities(
                request.getAmenities() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                                request.getAmenities()
                        )
        );

        /* =========================
           VILLA
        ========================= */

        property.setDailyRent(
                request.getDailyRent()
        );

        property.setMinimumStayDays(
                request.getMinimumStayDays()
        );

        property.setMaximumStayDays(
                request.getMaximumStayDays()
        );

        property.setMaximumGuests(
                request.getMaximumGuests()
        );

        property.setCheckInTime(
                request.getCheckInTime()
        );

        property.setCheckOutTime(
                request.getCheckOutTime()
        );

        /* =========================
           PG
        ========================= */

        property.setTotalRooms(
                request.getTotalRooms()
        );

        property.setTotalBeds(
                request.getTotalBeds()
        );

        if (
                creating &&
                isPgRequest(request)
        ) {

            Integer availableBeds =
                    request.getAvailableBeds();

            if (availableBeds == null) {
                availableBeds =
                        request.getTotalBeds();
            }

            if (availableBeds == null) {
                availableBeds = 0;
            }

            property.setAvailableBeds(
                    availableBeds
            );
        }

        property.setSharingType(
                request.getSharingType()
        );

        property.setGenderPreference(
                request.getGenderPreference()
        );

        property.setRoomType(
                request.getRoomType()
        );

        property.setRentPerBed(
                request.getRentPerBed()
        );

        property.setDepositPerBed(
                request.getDepositPerBed()
        );

        property.setFoodIncluded(
                request.getFoodIncluded()
        );

        property.setWifiAvailable(
                request.getWifiAvailable()
        );

        property.setLaundryAvailable(
                request.getLaundryAvailable()
        );

        property.setHousekeepingAvailable(
                request.getHousekeepingAvailable()
        );

        property.setAttachedBathroom(
                request.getAttachedBathroom()
        );
    }

    /* =========================================================
       ENTITY -> PROPERTY RESPONSE

       IMPORTANT IMAGE FIX:

       We query PropertyPhotoRepository directly instead of
       relying on property.getPhotos().
    ========================================================= */

    private PropertyResponse mapToResponse(
            Property property
    ) {

        PropertyResponse response =
                new PropertyResponse();

        /* =========================
           BASIC
        ========================= */

        response.setId(
                property.getId()
        );

        response.setTitle(
                property.getTitle()
        );

        response.setCategory(
                property.getCategory()
        );

        response.setDescription(
                property.getDescription()
        );

        response.setPricingType(
                property.getPricingType()
        );

        /* =========================
           PRICING
        ========================= */

        response.setMonthlyRent(
                property.getMonthlyRent()
        );

        response.setSecurityDeposit(
                property.getSecurityDeposit()
        );

        response.setMaintenanceCharge(
                property.getMaintenanceCharge()
        );

        /* =========================
           SIZE / DETAILS
        ========================= */

        response.setBedrooms(
                property.getBedrooms()
        );

        response.setBathrooms(
                property.getBathrooms()
        );

        response.setBalconies(
                property.getBalconies()
        );

        response.setAreaSqft(
                property.getAreaSqft()
        );

        response.setFurnishingStatus(
                property.getFurnishingStatus()
        );

        response.setFloorNumber(
                property.getFloorNumber()
        );

        response.setTotalFloors(
                property.getTotalFloors()
        );

        response.setParkingAvailable(
                property.getParkingAvailable()
        );

        /* =========================
           ADDRESS
        ========================= */

        response.setAddressLine1(
                property.getAddressLine1()
        );

        response.setAddressLine2(
                property.getAddressLine2()
        );

        response.setArea(
                property.getArea()
        );

        response.setCity(
                property.getCity()
        );

        response.setState(
                property.getState()
        );

        response.setPincode(
                property.getPincode()
        );

        /* =========================
           AVAILABILITY
        ========================= */

        response.setAvailabilityType(
                property.getAvailabilityType()
        );

        response.setAvailableFrom(
                property.getAvailableFrom()
        );

        /* =========================
           AMENITIES
        ========================= */

        response.setAmenities(
                property.getAmenities() == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                                property.getAmenities()
                        )
        );

        /* =========================
           VILLA
        ========================= */

        response.setDailyRent(
                property.getDailyRent()
        );

        response.setMinimumStayDays(
                property.getMinimumStayDays()
        );

        response.setMaximumStayDays(
                property.getMaximumStayDays()
        );

        response.setMaximumGuests(
                property.getMaximumGuests()
        );

        response.setCheckInTime(property.getCheckInTime() == null ? null : property.getCheckInTime().toString());

        response.setCheckOutTime(property.getCheckOutTime() == null ? null : property.getCheckOutTime().toString());

        /* =========================
           PG
        ========================= */

        response.setTotalRooms(
                property.getTotalRooms()
        );

        response.setTotalBeds(
                property.getTotalBeds()
        );

        response.setAvailableBeds(
                property.getAvailableBeds()
        );

        response.setSharingType(
                property.getSharingType()
        );

        response.setGenderPreference(
                property.getGenderPreference()
        );

        response.setRoomType(
                property.getRoomType()
        );

        response.setRentPerBed(
                property.getRentPerBed()
        );

        response.setDepositPerBed(
                property.getDepositPerBed()
        );

        response.setFoodIncluded(
                property.getFoodIncluded()
        );

        response.setWifiAvailable(
                property.getWifiAvailable()
        );

        response.setLaundryAvailable(
                property.getLaundryAvailable()
        );

        response.setHousekeepingAvailable(
                property.getHousekeepingAvailable()
        );

        response.setAttachedBathroom(
                property.getAttachedBathroom()
        );

        /* =========================
           STATUS
        ========================= */

        response.setApprovalStatus(
                property.getApprovalStatus()
        );

        response.setRentalStatus(
                property.getRentalStatus()
        );

        response.setRejectionReason(
                property.getRejectionReason()
        );

        /* =========================
           LANDLORD
        ========================= */

        response.setLandlordId(
                property.getLandlordId()
        );

        response.setLandlordName(
                property.getLandlordName()
        );

        /* =========================
           TIMESTAMPS
        ========================= */

        response.setCreatedAt(
                property.getCreatedAt()
        );

        response.setUpdatedAt(
                property.getUpdatedAt()
        );

        /* =====================================================
           CRITICAL PHOTO FIX

           MySQL:
           property_photos

           Fetch directly using property_id.
        ===================================================== */

        List<PropertyPhoto> propertyPhotos =
                propertyPhotoRepository
                        .findByPropertyIdOrderByDisplayOrderAsc(
                                property.getId()
                        );

        /*
         * Never return null photos.
         */
        if (propertyPhotos == null) {
            propertyPhotos =
                    new ArrayList<>();
        }

        List<PropertyPhotoResponse> photoResponses =
                propertyPhotos
                        .stream()
                        .map(this::mapPhoto)
                        .toList();

        response.setPhotos(
                photoResponses
        );

        /*
         * Find cover / main image.
         */
        String primaryImage =
                findPrimaryImage(
                        photoResponses
                );

        /*
         * Support both frontend fields.
         */
        response.setImageUrl(
                primaryImage
        );

        response.setImage(
                primaryImage
        );

        return response;
    }

    /* =========================================================
       PROPERTY PHOTO -> PHOTO RESPONSE
    ========================================================= */

    private PropertyPhotoResponse mapPhoto(
            PropertyPhoto photo
    ) {

        PropertyPhotoResponse response =
                new PropertyPhotoResponse();

        response.setId(
                photo.getId()
        );

        response.setImageUrl(
                photo.getImageUrl()
        );

        response.setCoverImage(
                photo.getCoverImage()
        );

        response.setDisplayOrder(
                photo.getDisplayOrder()
        );

        return response;
    }

    /* =========================================================
       FIND PRIMARY / COVER IMAGE
    ========================================================= */

    private String findPrimaryImage(
            List<PropertyPhotoResponse> photos
    ) {

        if (
                photos == null ||
                photos.isEmpty()
        ) {
            return null;
        }

        /*
         * First priority:
         * cover image.
         */
        for (
                PropertyPhotoResponse photo :
                photos
        ) {

            if (
                    Boolean.TRUE.equals(
                            photo.getCoverImage()
                    ) &&
                    photo.getImageUrl() != null &&
                    !photo.getImageUrl().isBlank()
            ) {

                return photo.getImageUrl();
            }
        }

        /*
         * Fallback:
         * first valid image.
         */
        for (
                PropertyPhotoResponse photo :
                photos
        ) {

            if (
                    photo.getImageUrl() != null &&
                    !photo.getImageUrl().isBlank()
            ) {

                return photo.getImageUrl();
            }
        }

        return null;
    }

    /* =========================================================
       FIND PROPERTY
    ========================================================= */

    private Property findProperty(
            Long propertyId
    ) {

        if (propertyId == null) {

            throw new IllegalArgumentException(
                    "Property ID is required."
            );
        }

        return propertyRepository
                .findById(propertyId)
                .orElseThrow(
                        () ->
                                new PropertyNotFoundException(propertyId)
                );
    }

    /* =========================================================
       CHECK WHETHER PROPERTY IS PG
    ========================================================= */

    private boolean isPg(
            Property property
    ) {

        if (property == null) {
            return false;
        }

        return
                "PG".equalsIgnoreCase(
                        property.getCategory()
                )
                ||
                "PER_BED_MONTHLY"
                        .equalsIgnoreCase(
                                String.valueOf(
                                        property.getPricingType()
                                )
                        );
    }

    /* =========================================================
       CHECK WHETHER REQUEST IS PG
    ========================================================= */

    private boolean isPgRequest(
            PropertyCreateRequest request
    ) {

        if (request == null) {
            return false;
        }

        return
                "PG".equalsIgnoreCase(
                        request.getCategory()
                )
                ||
                "PER_BED_MONTHLY"
                        .equalsIgnoreCase(
                                String.valueOf(
                                        request.getPricingType()
                                )
                        );
    }

    /* =========================================================
       MONEY DEFAULT
    ========================================================= */

    private BigDecimal defaultMoney(
            BigDecimal value
    ) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }

    /* =========================================================
       VALIDATE PROPERTY IMAGES
    ========================================================= */

    private void validateImages(
            List<MultipartFile> images
    ) {

        if (
                images == null ||
                images.isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "At least one property image is required."
            );
        }

        if (
                images.size() > MAX_IMAGES
        ) {

            throw new IllegalArgumentException(
                    "Maximum "
                            + MAX_IMAGES
                            + " property images are allowed."
            );
        }

        for (
                MultipartFile image :
                images
        ) {

            if (
                    image == null ||
                    image.isEmpty()
            ) {

                throw new IllegalArgumentException(
                        "Property image cannot be empty."
                );
            }

            String contentType =
                    image.getContentType();

            if (
                    contentType == null ||
                    !contentType.startsWith(
                            "image/"
                    )
            ) {

                throw new IllegalArgumentException(
                        "Only image files are allowed."
                );
            }
        }
    }
}
