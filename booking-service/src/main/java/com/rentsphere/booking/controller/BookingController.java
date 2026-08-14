package com.rentsphere.booking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentsphere.booking.dto.BookingApproveRequest;
import com.rentsphere.booking.dto.BookingRequest;
import com.rentsphere.booking.dto.BookingResponse;
import com.rentsphere.booking.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @GetMapping("/admin")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService
    ) {
        this.bookingService =
                bookingService;
    }

    /*
     * CREATE BOOKING
     */
    @PostMapping
    public ResponseEntity<BookingResponse>
    createBooking(
            @Valid
            @RequestBody
            BookingRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        bookingService
                                .createBooking(
                                        request
                                )
                );
    }

    /*
     * TENANT BOOKINGS
     */
    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<BookingResponse>>
    getTenantBookings(
            @PathVariable
            String tenantId
    ) {

        return ResponseEntity.ok(
                bookingService
                        .getTenantBookings(
                                tenantId
                        )
        );
    }

    /*
     * LANDLORD BOOKINGS
     */
    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<BookingResponse>>
    getLandlordBookings(
            @PathVariable
            String landlordId
    ) {

        return ResponseEntity.ok(
                bookingService
                        .getLandlordBookings(
                                landlordId
                        )
        );
    }

    /*
     * CHECK WHETHER CURRENT TENANT
     * ALREADY HAS ACTIVE BOOKING.
     */
    @GetMapping(
        "/exists/tenant/{tenantId}/property/{propertyId}"
    )
    public ResponseEntity<Boolean>
    bookingAlreadyExists(
            @PathVariable
            String tenantId,

            @PathVariable
            Long propertyId
    ) {

        return ResponseEntity.ok(
                bookingService
                        .bookingAlreadyExists(
                                tenantId,
                                propertyId
                        )
        );
    }

    /*
     * GET BOOKING
     *
     * Keep this after specific mappings
     * for clarity.
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse>
    getBookingById(
            @PathVariable
            String bookingId
    ) {

        return ResponseEntity.ok(
                bookingService
                        .getBookingById(
                                bookingId
                        )
        );
    }

    /*
     * LANDLORD APPROVES BOOKING
     */
    @PatchMapping("/{bookingId}/approve")
    public ResponseEntity<BookingResponse>
    approveBooking(
            @PathVariable
            String bookingId,

            @RequestBody
            BookingApproveRequest request
    ) {

        return ResponseEntity.ok(
                bookingService
                        .approveBooking(
                                bookingId,
                                request
                        )
        );
    }

    /*
     * LANDLORD REJECTS BOOKING
     */
    @PatchMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponse>
    rejectBooking(
            @PathVariable
            String bookingId,

            @RequestBody
            Map<String, String> body
    ) {

        String reason = body.getOrDefault("reason", body.get("rejectionReason"));

        return ResponseEntity.ok(
                bookingService
                        .rejectBooking(
                                bookingId,
                                reason
                        )
        );
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @PatchMapping("/{bookingId}/lease-active")
    public ResponseEntity<BookingResponse> activateLease(@PathVariable String bookingId) {
        return ResponseEntity.ok(bookingService.activateLease(bookingId));
    }

    @PatchMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponse> completeLease(@PathVariable String bookingId) {
        return ResponseEntity.ok(bookingService.completeLease(bookingId));
    }

    /*
     * PAYMENT SERVICE CALLS THIS
     * AFTER RAZORPAY VERIFICATION.
     *
     * This is where PG vacancy eventually
     * becomes 6 -> 5.
     */
    @PatchMapping(
        "/{bookingId}/payment-success"
    )
    public ResponseEntity<BookingResponse>
    paymentSuccessful(
            @PathVariable
            String bookingId,

            @RequestBody
            Map<String, String> body
    ) {

        String paymentId =
                body.get(
                        "paymentId"
                );

        String paymentOrderId =
                body.get(
                        "paymentOrderId"
                );

        return ResponseEntity.ok(
                bookingService
                        .markPaymentSuccessful(
                                bookingId,
                                paymentId,
                                paymentOrderId
                        )
        );
    }
}
