package com.rentsphere.property.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rentsphere.property.dto.PropertyCreateRequest;
import com.rentsphere.property.dto.PropertyResponse;
import com.rentsphere.property.enums.PropertyRentalStatus;
import com.rentsphere.property.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(
        origins = "http://localhost:3000"
)
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(
            PropertyService propertyService
    ) {
        this.propertyService = propertyService;
    }

    /* =========================================================
       CREATE PROPERTY
    ========================================================= */

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<PropertyResponse> createProperty(

            @RequestPart("property")
            PropertyCreateRequest request,

            @RequestPart("images")
            List<MultipartFile> images,

            @RequestPart("landlordId")
            String landlordId,

            @RequestPart(
                    value = "landlordName",
                    required = false
            )
            String landlordName
    ) {

        PropertyResponse response =
                propertyService.createProperty(
                        request,
                        images,
                        landlordId,
                        landlordName
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /* =========================================================
       GET PROPERTY BY ID
    ========================================================= */

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                propertyService.getPropertyById(id)
        );
    }

    /* =========================================================
       GET LANDLORD PROPERTIES
    ========================================================= */

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<PropertyResponse>>
    getLandlordProperties(
            @PathVariable String landlordId
    ) {

        return ResponseEntity.ok(
                propertyService.getLandlordProperties(
                        landlordId
                )
        );
    }

    /* =========================================================
       GET PUBLIC APPROVED PROPERTIES
    ========================================================= */

    @GetMapping("/public")
    public ResponseEntity<List<PropertyResponse>>
    getPublicProperties() {

        return ResponseEntity.ok(
                propertyService.getPublicProperties()
        );
    }

    /* =========================================================
       ADMIN - GET ALL PROPERTIES
    ========================================================= */

    @GetMapping("/admin/all")
    public ResponseEntity<List<PropertyResponse>>
    getAllPropertiesForAdmin() {

        return ResponseEntity.ok(
                propertyService
                        .getAllPropertiesForAdmin()
        );
    }

    /* =========================================================
       UPDATE PROPERTY
    ========================================================= */

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PropertyResponse> updateProperty(

            @PathVariable Long id,

            @RequestBody
            PropertyCreateRequest request
    ) {

        return ResponseEntity.ok(
                propertyService.updateProperty(
                        id,
                        request
                )
        );
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PropertyResponse> updatePropertyWithImages(
            @PathVariable Long id,
            @RequestPart("property") PropertyCreateRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "keepImageUrls", required = false) List<String> keepImageUrls
    ) {
        return ResponseEntity.ok(propertyService.updateProperty(id, request, images, keepImageUrls));
    }

    /* =========================================================
       APPROVE PROPERTY
    ========================================================= */

    @PatchMapping("/{id}/approve")
    public ResponseEntity<PropertyResponse> approveProperty(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                propertyService.approveProperty(id)
        );
    }

    /* =========================================================
       REJECT PROPERTY

       Request:
       {
           "reason": "Property information is incomplete"
       }
    ========================================================= */

    @PatchMapping("/{id}/reject")
    public ResponseEntity<PropertyResponse> rejectProperty(

            @PathVariable Long id,

            @RequestBody
            Map<String, String> request
    ) {

        String reason =
                request.get("reason");

        return ResponseEntity.ok(
                propertyService.rejectProperty(
                        id,
                        reason
                )
        );
    }

    /* =========================================================
       UPDATE RENTAL STATUS

       Request:
       {
           "rentalStatus": "AVAILABLE"
       }

       or

       {
           "rentalStatus": "BOOKED"
       }
    ========================================================= */

    @PatchMapping("/{id}/rental-status")
    public ResponseEntity<PropertyResponse> updateRentalStatus(

            @PathVariable Long id,

            @RequestBody
            Map<String, String> request
    ) {

        String statusValue =
                request.get("rentalStatus");

        if (
                statusValue == null ||
                statusValue.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Rental status is required."
            );
        }

        PropertyRentalStatus rentalStatus;

        try {

            rentalStatus =
                    PropertyRentalStatus.valueOf(
                            statusValue
                                    .trim()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException exception) {

            throw new IllegalArgumentException(
                    "Invalid rental status: "
                            + statusValue
            );
        }

        return ResponseEntity.ok(
                propertyService.updateRentalStatus(
                        id,
                        rentalStatus
                )
        );
    }

    /* =========================================================
       BOOK PG BEDS

       PATCH:
       /api/properties/{id}/book-pg-beds

       Request:
       {
           "beds": 1
       }
    ========================================================= */

    @PatchMapping("/{id}/book-pg-beds")
    public ResponseEntity<PropertyResponse> bookPgBeds(

            @PathVariable Long id,

            @RequestBody
            Map<String, Integer> request
    ) {

        Integer beds =
                request.get("beds");

        return ResponseEntity.ok(
                propertyService.bookPgBeds(
                        id,
                        beds
                )
        );
    }

    /* =========================================================
       RELEASE PG BEDS

       Request:
       {
           "beds": 1
       }
    ========================================================= */

    @PatchMapping("/{id}/release-pg-beds")
    public ResponseEntity<PropertyResponse> releasePgBeds(

            @PathVariable Long id,

            @RequestBody
            Map<String, Integer> request
    ) {

        Integer beds =
                request.get("beds");

        return ResponseEntity.ok(
                propertyService.releasePgBeds(
                        id,
                        beds
                )
        );
    }
}
