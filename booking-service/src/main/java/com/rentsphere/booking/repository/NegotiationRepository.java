package com.rentsphere.booking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentsphere.booking.model.Negotiation;
import com.rentsphere.booking.model.NegotiationStatus;

public interface NegotiationRepository
        extends JpaRepository<Negotiation, Long> {

    List<Negotiation>
        findByTenantIdOrderByCreatedAtDesc(
            String tenantId
        );

    List<Negotiation>
        findByLandlordIdOrderByCreatedAtDesc(
            String landlordId
        );

    List<Negotiation>
        findByPropertyIdOrderByCreatedAtDesc(
            Long propertyId
        );

    boolean
        existsByPropertyIdAndTenantIdAndStatusIn(
            Long propertyId,
            String tenantId,
            List<NegotiationStatus> statuses
        );

    Optional<Negotiation> findFirstByPropertyIdAndTenantIdAndStatusOrderByUpdatedAtDesc(
            Long propertyId,
            String tenantId,
            NegotiationStatus status
    );
}
