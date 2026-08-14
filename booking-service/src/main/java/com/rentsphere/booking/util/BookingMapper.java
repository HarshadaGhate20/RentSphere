package com.rentsphere.booking.util;

import org.springframework.stereotype.Component;

import com.rentsphere.booking.dto.BookingResponse;
import com.rentsphere.booking.model.Booking;

@Component
public class BookingMapper {

    public BookingResponse toResponse(
            Booking booking
    ) {

        if (booking == null) {
            return null;
        }

        BookingResponse response =
                new BookingResponse();

        response.setId(
                booking.getId()
        );

        response.setPropertyId(
                booking.getPropertyId()
        );

        response.setPropertyTitle(
                booking.getPropertyTitle()
        );

        response.setPropertyCategory(
                booking.getPropertyCategory()
        );

        response.setPropertyImage(
                booking.getPropertyImage()
        );

        response.setPropertyArea(
                booking.getPropertyArea()
        );

        response.setPropertyCity(
                booking.getPropertyCity()
        );

        response.setTenantId(
                booking.getTenantId()
        );

        response.setTenantName(
                booking.getTenantName()
        );

        response.setTenantEmail(
                booking.getTenantEmail()
        );

        response.setTenantPhone(
                booking.getTenantPhone()
        );

        response.setTenantOccupation(
                booking.getTenantOccupation()
        );

        response.setLandlordId(
                booking.getLandlordId()
        );

        response.setLandlordName(
                booking.getLandlordName()
        );

        response.setRequestedMonthlyRent(
                booking.getRequestedMonthlyRent()
        );

        response.setApprovedMonthlyRent(
                booking.getApprovedMonthlyRent()
        );

        response.setSecurityDeposit(
                booking.getSecurityDeposit()
        );

        response.setMaintenanceCharge(
                booking.getMaintenanceCharge()
        );

        response.setTotalPayable(
                booking.getTotalPayable()
        );

        response.setRequestedMoveInDate(
                booking.getRequestedMoveInDate()
        );

        response.setApprovedMoveInDate(
                booking.getApprovedMoveInDate()
        );

        response.setDurationMonths(
                booking.getDurationMonths()
        );

        response.setNumberOfOccupants(
                booking.getNumberOfOccupants()
        );

        /*
         * PG FIELDS
         */
        response.setNumberOfBeds(
                booking.getNumberOfBeds()
        );

        response.setPgBedsAllocated(
                booking.getPgBedsAllocated()
        );

        response.setTenantMessage(
                booking.getTenantMessage()
        );

        response.setLandlordMessage(
                booking.getLandlordMessage()
        );

        response.setRejectionReason(
                booking.getRejectionReason()
        );

        response.setStatus(
                booking.getStatus()
        );

        response.setPaymentId(
                booking.getPaymentId()
        );

        response.setPaymentOrderId(
                booking.getPaymentOrderId()
        );

        response.setPaymentDate(
                booking.getPaymentDate()
        );

        response.setLeaseStartDate(
                booking.getLeaseStartDate()
        );

        response.setLeaseEndDate(
                booking.getLeaseEndDate()
        );

        response.setCreatedAt(
                booking.getCreatedAt()
        );

        response.setUpdatedAt(
                booking.getUpdatedAt()
        );

        return response;
    }
}