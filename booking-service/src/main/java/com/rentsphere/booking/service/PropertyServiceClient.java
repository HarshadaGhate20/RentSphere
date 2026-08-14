package com.rentsphere.booking.service;

import com.rentsphere.booking.dto.PropertyServiceResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PropertyServiceClient {

    private final RestClient restClient;

    public PropertyServiceClient(
        @Value("${property.service.base-url}")
        String propertyServiceBaseUrl
    ) {
        this.restClient =
            RestClient.builder()
                .baseUrl(propertyServiceBaseUrl)
                .build();
    }

    public PropertyServiceResponse getPropertyById(
        Long propertyId
    ) {
        PropertyServiceResponse response =
            restClient
                .get()
                .uri(
                    "/api/properties/{propertyId}",
                    propertyId
                )
                .retrieve()
                .body(
                    PropertyServiceResponse.class
                );

        if (response == null) {
            throw new IllegalArgumentException(
                "Property Service returned an empty response."
            );
        }

        return response;
    }

    public void updateRentalStatus(
        Long propertyId,
        String rentalStatus
    ) {
        restClient
            .patch()
            .uri(
                uriBuilder ->
                    uriBuilder
                        .path(
                            "/api/properties/{propertyId}/rental-status"
                        )
                        .queryParam(
                            "status",
                            rentalStatus
                        )
                        .build(propertyId)
            )
            .retrieve()
            .toBodilessEntity();
    }
}