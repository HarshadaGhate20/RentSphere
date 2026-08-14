package com.rentsphere.property.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.rentsphere.property.dto.PropertyCreateRequest;
import com.rentsphere.property.dto.PropertyResponse;
import com.rentsphere.property.enums.PropertyRentalStatus;

public interface PropertyService {
    PropertyResponse createProperty(PropertyCreateRequest request, List<MultipartFile> images, String landlordId, String landlordName);
    PropertyResponse getPropertyById(Long propertyId);
    List<PropertyResponse> getPublicProperties();
    List<PropertyResponse> getLandlordProperties(String landlordId);
    List<PropertyResponse> getAllPropertiesForAdmin();
    PropertyResponse updateProperty(Long propertyId, PropertyCreateRequest request);
    PropertyResponse updateProperty(Long propertyId, PropertyCreateRequest request, List<MultipartFile> images, List<String> keepImageUrls);
    PropertyResponse approveProperty(Long propertyId);
    PropertyResponse rejectProperty(Long propertyId, String reason);
    PropertyResponse updateRentalStatus(Long propertyId, PropertyRentalStatus status);
    PropertyResponse bookPgBeds(Long propertyId, Integer beds);
    PropertyResponse releasePgBeds(Long propertyId, Integer beds);
}
