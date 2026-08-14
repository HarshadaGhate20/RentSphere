package com.rentsphere.property.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /*
     * Store one property image.
     *
     * Example returned value:
     * /uploads/property_5/uuid-image.jpg
     */
    String storePropertyImage(
        MultipartFile file,
        Long propertyId
    );

    /*
     * Delete one stored image using its
     * relative URL.
     */
    void deleteFile(
        String imageUrl
    );
}