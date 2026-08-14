package com.rentsphere.property.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rentsphere.property.enums.PropertyApprovalStatus;
import com.rentsphere.property.model.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByApprovalStatusOrderByCreatedAtDesc(PropertyApprovalStatus approvalStatus);
    List<Property> findByLandlordIdOrderByCreatedAtDesc(String landlordId);
}
