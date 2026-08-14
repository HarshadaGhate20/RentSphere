package com.rentsphere.booking.service;

import java.util.List;

import com.rentsphere.booking.dto.BookingApproveRequest;
import com.rentsphere.booking.dto.BookingRequest;
import com.rentsphere.booking.dto.BookingResponse;

public interface BookingService {
    List<BookingResponse> getAllBookings();

    BookingResponse createBooking(
            BookingRequest request
    );

    BookingResponse getBookingById(
            String bookingId
    );

    List<BookingResponse> getTenantBookings(
            String tenantId
    );

    List<BookingResponse> getLandlordBookings(
            String landlordId
    );

    boolean bookingAlreadyExists(
            String tenantId,
            Long propertyId
    );

    BookingResponse approveBooking(
            String bookingId,
            BookingApproveRequest request
    );

    BookingResponse rejectBooking(
            String bookingId,
            String reason
    );

    BookingResponse markPaymentSuccessful(
            String bookingId,
            String paymentId,
            String paymentOrderId
    );

    BookingResponse cancelBooking(String bookingId);
    BookingResponse activateLease(String bookingId);
    BookingResponse completeLease(String bookingId);
}
