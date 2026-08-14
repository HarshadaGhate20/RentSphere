package com.rentsphere.property.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rentsphere.property.model.PropertyPhoto;

@Repository
public interface PropertyPhotoRepository
        extends JpaRepository<PropertyPhoto, Long> {

    List<PropertyPhoto>
    findByPropertyIdOrderByDisplayOrderAsc(
        Long propertyId
    );

    void deleteByPropertyId(
        Long propertyId
    );
}