package com.rentsphere.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rentsphere.booking.model.Booking;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, String> {

    /*
     * Tenant bookings.
     */
    List<Booking>
    findByTenantIdOrderByCreatedAtDesc(
            String tenantId
    );

    /*
     * Landlord bookings.
     */
    List<Booking>
    findByLandlordIdOrderByCreatedAtDesc(
            String landlordId
    );

    /*
     * Property bookings.
     */
    List<Booking>
    findByPropertyIdOrderByCreatedAtDesc(
            Long propertyId
    );

    /*
     * Important:
     * Check bookings belonging to THIS
     * tenant for THIS property.
     *
     * This allows different tenants to
     * book the same PG while beds remain.
     */
    List<Booking>
    findByTenantIdAndPropertyId(
            String tenantId,
            Long propertyId
    );
}