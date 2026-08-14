package com.rentsphere.booking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentsphere.booking.dto.NegotiationActionRequest;
import com.rentsphere.booking.dto.NegotiationRequest;
import com.rentsphere.booking.dto.NegotiationResponse;
import com.rentsphere.booking.service.NegotiationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/negotiations")
public class NegotiationController {

    @GetMapping("/admin")
    public ResponseEntity<List<NegotiationResponse>> getAllNegotiations() {
        return ResponseEntity.ok(negotiationService.getAllNegotiations());
    }

    private final NegotiationService negotiationService;

    public NegotiationController(
            NegotiationService negotiationService
    ) {
        this.negotiationService =
                negotiationService;
    }

    @PostMapping
    public ResponseEntity<NegotiationResponse>
        createNegotiation(
            @Valid
            @RequestBody
            NegotiationRequest request
        ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        negotiationService
                                .createNegotiation(
                                        request
                                )
                );
    }

    @GetMapping("/{negotiationId}")
    public ResponseEntity<NegotiationResponse>
        getNegotiation(
            @PathVariable
            Long negotiationId
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .getById(
                                negotiationId
                        )
        );
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<NegotiationResponse>>
        getTenantNegotiations(
            @PathVariable
            String tenantId
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .getTenantNegotiations(
                                tenantId
                        )
        );
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<NegotiationResponse>>
    getLandlordNegotiations(
            @PathVariable String landlordId
    ) {

        return ResponseEntity.ok(
            negotiationService
                .getLandlordNegotiations(
                    landlordId
                )
        );
    }

    @PatchMapping("/{negotiationId}/accept")
    public ResponseEntity<NegotiationResponse>
        acceptNegotiation(
            @PathVariable
            Long negotiationId,

            @RequestBody
            NegotiationActionRequest request
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .acceptNegotiation(
                                negotiationId,
                                request
                        )
        );
    }

    @PatchMapping("/{negotiationId}/counter")
    public ResponseEntity<NegotiationResponse>
        counterNegotiation(
            @PathVariable
            Long negotiationId,

            @RequestBody
            NegotiationActionRequest request
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .counterNegotiation(
                                negotiationId,
                                request
                        )
        );
    }

    @PatchMapping("/{negotiationId}/reject")
    public ResponseEntity<NegotiationResponse>
        rejectNegotiation(
            @PathVariable
            Long negotiationId,

            @RequestBody
            NegotiationActionRequest request
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .rejectNegotiation(
                                negotiationId,
                                request
                        )
        );
    }

    @PatchMapping("/{negotiationId}/accept-counter")
    public ResponseEntity<NegotiationResponse>
        acceptCounterOffer(
            @PathVariable
            Long negotiationId
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .acceptCounterOffer(
                                negotiationId
                        )
        );
    }

    @PatchMapping("/{negotiationId}/cancel")
    public ResponseEntity<NegotiationResponse>
        cancelNegotiation(
            @PathVariable
            Long negotiationId
        ) {

        return ResponseEntity.ok(
                negotiationService
                        .cancelNegotiation(
                                negotiationId
                        )
        );
    }
}
