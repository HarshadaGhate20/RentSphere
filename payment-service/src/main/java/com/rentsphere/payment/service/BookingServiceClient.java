package com.rentsphere.payment.service;

import com.rentsphere.payment.dto.BookingServiceResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class BookingServiceClient {

    private final RestClient restClient;

    public BookingServiceClient(
        @Value("${booking.service.base-url}")
        String bookingServiceBaseUrl
    ) {
        this.restClient =
            RestClient.builder()
                .baseUrl(bookingServiceBaseUrl)
                .build();
    }

    public BookingServiceResponse getBooking(
        String bookingId
    ) {
        BookingServiceResponse response =
            restClient
                .get()
                .uri(
                    "/api/bookings/{bookingId}",
                    bookingId
                )
                .retrieve()
                .body(
                    BookingServiceResponse.class
                );

        if (response == null) {
            throw new IllegalArgumentException(
                "Booking Service returned an empty response."
            );
        }

        return response;
    }

    public void markPaymentSuccessful(
        String bookingId,
        String paymentId,
        String paymentOrderId
    ) {
        restClient
            .patch()
            .uri(
                "/api/bookings/{bookingId}/payment-success",
                bookingId
            )
            .body(
                Map.of(
                    "paymentId",
                    paymentId,
                    "paymentOrderId",
                    paymentOrderId
                )
            )
            .retrieve()
            .toBodilessEntity();
    }

    public void markPaymentFailed(
        String bookingId
    ) {
        restClient
            .patch()
            .uri(
                "/api/bookings/{bookingId}/payment-failed",
                bookingId
            )
            .retrieve()
            .toBodilessEntity();
    }
}