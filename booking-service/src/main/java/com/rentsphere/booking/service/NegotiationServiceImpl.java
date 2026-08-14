package com.rentsphere.booking.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rentsphere.booking.dto.NegotiationActionRequest;
import com.rentsphere.booking.dto.NegotiationRequest;
import com.rentsphere.booking.dto.NegotiationResponse;
import com.rentsphere.booking.dto.PropertyServiceResponse;
import com.rentsphere.booking.exception.ResourceNotFoundException;
import com.rentsphere.booking.model.Negotiation;
import com.rentsphere.booking.model.NegotiationStatus;
import com.rentsphere.booking.repository.NegotiationRepository;

@Service
@Transactional
public class NegotiationServiceImpl
        implements NegotiationService {

    @Override
    @Transactional(readOnly = true)
    public List<NegotiationResponse> getAllNegotiations() {
        return negotiationRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    private final NegotiationRepository negotiationRepository;

    private final PropertyServiceClient propertyServiceClient;

    public NegotiationServiceImpl(
            NegotiationRepository negotiationRepository,
            PropertyServiceClient propertyServiceClient
    ) {
        this.negotiationRepository =
                negotiationRepository;

        this.propertyServiceClient =
                propertyServiceClient;
    }

    @Override
    public NegotiationResponse createNegotiation(
            NegotiationRequest request
    ) {

        PropertyServiceResponse property =
                propertyServiceClient
                        .getPropertyById(
                                request.getPropertyId()
                        );

        if (property == null) {
            throw new IllegalArgumentException(
                    "Property was not found."
            );
        }

        if (
            property.getApprovalStatus() == null
            ||
            !"APPROVED".equalsIgnoreCase(
                    property.getApprovalStatus()
            )
        ) {
            throw new IllegalArgumentException(
                    "Only approved properties can be negotiated."
            );
        }

        if (
            property.getRentalStatus() == null
            ||
            !"AVAILABLE".equalsIgnoreCase(
                    property.getRentalStatus()
            )
        ) {
            throw new IllegalArgumentException(
                    "This property is currently unavailable for negotiation."
            );
        }

        if (
            request.getProposedRent() == null
            ||
            request.getProposedRent()
                    .compareTo(BigDecimal.ZERO)
                    <= 0
        ) {
            throw new IllegalArgumentException(
                    "Proposed rent must be greater than zero."
            );
        }

        boolean alreadyOpen =
                negotiationRepository
                        .existsByPropertyIdAndTenantIdAndStatusIn(
                                request.getPropertyId(),
                                request.getTenantId(),
                                List.of(
                                        NegotiationStatus.PENDING,
                                        NegotiationStatus.COUNTERED
                                )
                        );

        if (alreadyOpen) {
            throw new IllegalArgumentException(
                    "You already have an active negotiation for this property."
            );
        }

        Negotiation negotiation =
                new Negotiation();

        negotiation.setPropertyId(
                property.getId()
        );

        negotiation.setPropertyTitle(
                property.getTitle()
        );

        negotiation.setTenantId(
                request.getTenantId()
        );

        negotiation.setTenantName(
                request.getTenantName()
        );

        negotiation.setTenantEmail(
                request.getTenantEmail()
        );

        negotiation.setLandlordId(
                property.getLandlordId()
        );

        negotiation.setLandlordName(
                property.getLandlordName()
        );

        BigDecimal listedRent = resolveListedRent(property);
        if (listedRent == null || listedRent.compareTo(BigDecimal.ZERO) <= 0) {
            listedRent = request.getListedRent();
        }
        if (listedRent == null || listedRent.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("The listed rent is not configured for this property.");
        }
        negotiation.setListedRent(listedRent);

        negotiation.setTenantProposedRent(
                request.getProposedRent()
        );

        negotiation.setTenantMessage(
                request.getTenantMessage()
        );

        negotiation.setStatus(
                NegotiationStatus.PENDING
        );

        return mapToResponse(
                negotiationRepository
                        .save(negotiation)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public NegotiationResponse getById(
            Long negotiationId
    ) {
        return mapToResponse(
                findNegotiation(
                        negotiationId
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<NegotiationResponse>
        getTenantNegotiations(
            String tenantId
        ) {

        return negotiationRepository
                .findByTenantIdOrderByCreatedAtDesc(
                        tenantId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NegotiationResponse>
        getLandlordNegotiations(
            String landlordId
        ) {

        return negotiationRepository
                .findByLandlordIdOrderByCreatedAtDesc(
                        landlordId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NegotiationResponse acceptNegotiation(
            Long negotiationId,
            NegotiationActionRequest request
    ) {

        Negotiation negotiation =
                findNegotiation(
                        negotiationId
                );

        if (
            negotiation.getStatus()
                    != NegotiationStatus.PENDING
        ) {
            throw new IllegalArgumentException(
                    "Only pending negotiations can be accepted."
            );
        }

        negotiation.setAgreedRent(
                negotiation.getTenantProposedRent()
        );

        negotiation.setLandlordMessage(
                request.getLandlordMessage()
        );

        negotiation.setStatus(
                NegotiationStatus.ACCEPTED
        );

        return mapToResponse(
                negotiationRepository
                        .save(negotiation)
        );
    }

    @Override
    public NegotiationResponse counterNegotiation(
            Long negotiationId,
            NegotiationActionRequest request
    ) {

        Negotiation negotiation =
                findNegotiation(
                        negotiationId
                );

        if (
            negotiation.getStatus()
                    != NegotiationStatus.PENDING
        ) {
            throw new IllegalArgumentException(
                    "Only pending negotiations can receive a counter offer."
            );
        }

        if (
            request.getCounterRent() == null
            ||
            request.getCounterRent()
                    .compareTo(BigDecimal.ZERO)
                    <= 0
        ) {
            throw new IllegalArgumentException(
                    "Counter rent must be greater than zero."
            );
        }

        negotiation.setLandlordCounterRent(
                request.getCounterRent()
        );

        negotiation.setLandlordMessage(
                request.getLandlordMessage()
        );

        negotiation.setStatus(
                NegotiationStatus.COUNTERED
        );

        return mapToResponse(
                negotiationRepository
                        .save(negotiation)
        );
    }

    @Override
    public NegotiationResponse rejectNegotiation(
            Long negotiationId,
            NegotiationActionRequest request
    ) {

        Negotiation negotiation =
                findNegotiation(
                        negotiationId
                );

        if (
            negotiation.getStatus()
                    != NegotiationStatus.PENDING
            &&
            negotiation.getStatus()
                    != NegotiationStatus.COUNTERED
        ) {
            throw new IllegalArgumentException(
                    "This negotiation cannot be rejected."
            );
        }

        negotiation.setLandlordMessage(
                request.getLandlordMessage()
        );

        negotiation.setStatus(
                NegotiationStatus.REJECTED
        );

        return mapToResponse(
                negotiationRepository
                        .save(negotiation)
        );
    }

    @Override
    public NegotiationResponse acceptCounterOffer(
            Long negotiationId
    ) {

        Negotiation negotiation =
                findNegotiation(
                        negotiationId
                );

        if (
            negotiation.getStatus()
                    != NegotiationStatus.COUNTERED
        ) {
            throw new IllegalArgumentException(
                    "There is no counter offer to accept."
            );
        }

        if (
            negotiation.getLandlordCounterRent()
                    == null
        ) {
            throw new IllegalArgumentException(
                    "Counter rent is missing."
            );
        }

        negotiation.setAgreedRent(
                negotiation.getLandlordCounterRent()
        );

        negotiation.setStatus(
                NegotiationStatus.ACCEPTED
        );

        return mapToResponse(
                negotiationRepository
                        .save(negotiation)
        );
    }

    @Override
    public NegotiationResponse cancelNegotiation(
            Long negotiationId
    ) {

        Negotiation negotiation =
                findNegotiation(
                        negotiationId
                );

        if (
            negotiation.getStatus()
                    == NegotiationStatus.ACCEPTED
            ||
            negotiation.getStatus()
                    == NegotiationStatus.REJECTED
        ) {
            throw new IllegalArgumentException(
                    "Completed negotiation cannot be cancelled."
            );
        }

        negotiation.setStatus(
                NegotiationStatus.CANCELLED
        );

        return mapToResponse(
                negotiationRepository
                        .save(negotiation)
        );
    }

    private BigDecimal resolveListedRent(PropertyServiceResponse property) {
        String category = property.getCategory() == null ? "" : property.getCategory().trim().toUpperCase();
        String pricingType = property.getPricingType() == null ? "" : property.getPricingType().trim().toUpperCase();
        if ("PG".equals(category) || "PER_BED_MONTHLY".equals(pricingType)) return property.getRentPerBed();
        if ("VILLA".equals(category) || "DAILY".equals(pricingType)) return property.getDailyRent();
        return property.getMonthlyRent();
    }

    private Negotiation findNegotiation(
            Long negotiationId
    ) {

        return negotiationRepository
                .findById(negotiationId)
                .orElseThrow(
                        () ->
                            new ResourceNotFoundException(
                                    "Negotiation not found with ID: "
                                    + negotiationId
                            )
                );
    }

    private NegotiationResponse mapToResponse(
            Negotiation negotiation
    ) {

        NegotiationResponse response =
                new NegotiationResponse();

        response.setId(
                negotiation.getId()
        );

        response.setPropertyId(
                negotiation.getPropertyId()
        );

        response.setPropertyTitle(
                negotiation.getPropertyTitle()
        );

        response.setTenantId(
                negotiation.getTenantId()
        );

        response.setTenantName(
                negotiation.getTenantName()
        );

        response.setTenantEmail(
                negotiation.getTenantEmail()
        );

        response.setLandlordId(
                negotiation.getLandlordId()
        );

        response.setLandlordName(
                negotiation.getLandlordName()
        );

        response.setListedRent(
                negotiation.getListedRent()
        );

        response.setTenantProposedRent(
                negotiation.getTenantProposedRent()
        );

        response.setLandlordCounterRent(
                negotiation.getLandlordCounterRent()
        );

        response.setAgreedRent(
                negotiation.getAgreedRent()
        );

        response.setTenantMessage(
                negotiation.getTenantMessage()
        );

        response.setLandlordMessage(
                negotiation.getLandlordMessage()
        );

        response.setStatus(
                negotiation.getStatus()
        );

        response.setCreatedAt(
                negotiation.getCreatedAt()
        );

        response.setUpdatedAt(
                negotiation.getUpdatedAt()
        );

        return response;
    }
}
