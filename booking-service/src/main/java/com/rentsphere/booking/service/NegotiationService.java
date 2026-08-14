package com.rentsphere.booking.service;

import java.util.List;

import com.rentsphere.booking.dto.NegotiationActionRequest;
import com.rentsphere.booking.dto.NegotiationRequest;
import com.rentsphere.booking.dto.NegotiationResponse;

public interface NegotiationService {
    List<NegotiationResponse> getAllNegotiations();

    NegotiationResponse createNegotiation(
        NegotiationRequest request
    );

    NegotiationResponse getById(
        Long negotiationId
    );

    List<NegotiationResponse> getTenantNegotiations(
        String tenantId
    );

    List<NegotiationResponse> getLandlordNegotiations(
        String landlordId
    );

    NegotiationResponse acceptNegotiation(
        Long negotiationId,
        NegotiationActionRequest request
    );

    NegotiationResponse counterNegotiation(
        Long negotiationId,
        NegotiationActionRequest request
    );

    NegotiationResponse rejectNegotiation(
        Long negotiationId,
        NegotiationActionRequest request
    );

    NegotiationResponse acceptCounterOffer(
        Long negotiationId
    );

    NegotiationResponse cancelNegotiation(
        Long negotiationId
    );
}
