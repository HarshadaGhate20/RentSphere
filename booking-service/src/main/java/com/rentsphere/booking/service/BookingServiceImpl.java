package com.rentsphere.booking.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rentsphere.booking.client.PropertyClient;
import com.rentsphere.booking.client.PropertyClient.PropertyServiceResponse;

import com.rentsphere.booking.dto.BookingApproveRequest;
import com.rentsphere.booking.dto.BookingRequest;
import com.rentsphere.booking.dto.BookingResponse;

import com.rentsphere.booking.model.Booking;
import com.rentsphere.booking.model.BookingStatus;
import com.rentsphere.booking.model.NegotiationStatus;

import com.rentsphere.booking.repository.BookingRepository;
import com.rentsphere.booking.repository.NegotiationRepository;

import com.rentsphere.booking.util.BookingMapper;

@Service
@Transactional
public class BookingServiceImpl
        implements BookingService {

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(bookingMapper::toResponse).toList();
    }

    private final BookingRepository
            bookingRepository;

    private final PropertyClient
            propertyClient;

    private final BookingMapper
            bookingMapper;

    private final NegotiationRepository negotiationRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            PropertyClient propertyClient,
            BookingMapper bookingMapper,
            NegotiationRepository negotiationRepository
    ) {

        this.bookingRepository =
                bookingRepository;

        this.propertyClient =
                propertyClient;

        this.bookingMapper =
                bookingMapper;

        this.negotiationRepository = negotiationRepository;
    }

    /* =========================================================
       CREATE BOOKING
    ========================================================= */

    @Override
    public BookingResponse createBooking(
            BookingRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Booking request is required."
            );
        }

        if (
                request.getPropertyId() ==
                null
        ) {
            throw new IllegalArgumentException(
                    "Property ID is required."
            );
        }

        if (
                request.getTenantId() ==
                null ||
                request
                    .getTenantId()
                    .isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Tenant ID is required."
            );
        }

        PropertyServiceResponse property =
                propertyClient
                        .getPropertyById(
                                request.getPropertyId()
                        );

        if (property == null) {
            throw new IllegalStateException(
                    "Property could not be loaded."
            );
        }

        if (
                !"APPROVED"
                    .equalsIgnoreCase(
                        property
                            .getApprovalStatus()
                    )
        ) {
            throw new IllegalStateException(
                    "Property is not approved."
            );
        }

        boolean pg =
                isPg(
                        property
                );

        /* =====================================================
           CHECK AVAILABILITY
        ===================================================== */

        if (pg) {

            Integer availableBeds =
                    property
                        .getAvailableBeds();

            if (
                    availableBeds ==
                    null ||
                    availableBeds <
                    1
            ) {
                throw new IllegalStateException(
                        "No PG beds are currently available."
                );
            }

            Integer requestedBeds =
                    request
                        .getNumberOfBeds();

            if (
                    requestedBeds ==
                    null ||
                    requestedBeds <
                    1
            ) {
                requestedBeds = 1;
            }

            if (
                    requestedBeds >
                    availableBeds
            ) {
                throw new IllegalStateException(
                        "Only " +
                        availableBeds +
                        " PG bed(s) are available."
                );
            }

        } else {

            if (
                    !"AVAILABLE"
                        .equalsIgnoreCase(
                            property
                                .getRentalStatus()
                        )
            ) {
                throw new IllegalStateException(
                        "Property is not currently available."
                );
            }
        }

        /* =====================================================
           CHECK DUPLICATE FOR THIS TENANT

           Another tenant's PG booking must
           NOT block this tenant.
        ===================================================== */

        if (
                bookingAlreadyExists(
                        request
                            .getTenantId(),
                        request
                            .getPropertyId()
                )
        ) {
            throw new IllegalStateException(
                    "You already have an active booking for this property."
            );
        }

        Booking booking =
                new Booking();

        booking.setId(
                generateBookingId()
        );

        booking.setPropertyId(
                property.getId()
        );

        booking.setPropertyTitle(
                property.getTitle()
        );

        booking.setPropertyCategory(
                property.getCategory()
        );

        booking.setPropertyArea(
                valueOrEmpty(
                        property.getArea()
                )
        );

        booking.setPropertyCity(
                valueOrEmpty(
                        property.getCity()
                )
        );

        booking.setPropertyImage(
                getPrimaryImage(
                        property
                )
        );

        booking.setLandlordId(
                property.getLandlordId()
        );

        booking.setLandlordName(
                valueOrDefault(
                        property
                            .getLandlordName(),
                        "RentSphere Landlord"
                )
        );

        booking.setTenantId(
                request.getTenantId()
        );

        booking.setTenantName(
                valueOrDefault(
                        request
                            .getTenantName(),
                        "Tenant"
                )
        );

        booking.setTenantEmail(
                request
                    .getTenantEmail()
        );

        booking.setTenantPhone(
                request
                    .getTenantPhone()
        );

        booking.setTenantOccupation(
                request
                    .getTenantOccupation()
        );

        /* =====================================================
           PG
        ===================================================== */

        if (pg) {

            int numberOfBeds =
                    request
                        .getNumberOfBeds() ==
                    null
                            ? 1
                            : request
                                .getNumberOfBeds();

            BigDecimal rentPerBed =
                    property
                        .getRentPerBed();

            if (
                    rentPerBed ==
                    null ||
                    rentPerBed
                        .compareTo(
                            BigDecimal.ZERO
                        ) <= 0
            ) {
                throw new IllegalStateException(
                        "PG rent per bed is not configured."
                );
            }

            booking.setNumberOfBeds(
                    numberOfBeds
            );

            booking.setPgBedsAllocated(
                    false
            );

            booking.setRequestedMonthlyRent(
                    rentPerBed.multiply(
                            BigDecimal.valueOf(
                                    numberOfBeds
                            )
                    )
            );

            BigDecimal depositPerBed =
                    property
                        .getDepositPerBed();

            if (
                    depositPerBed ==
                    null
            ) {
                booking.setSecurityDeposit(
                        BigDecimal.ZERO
                );

            } else {

                booking.setSecurityDeposit(
                        depositPerBed.multiply(
                                BigDecimal.valueOf(
                                        numberOfBeds
                                )
                        )
                );
            }

        } else {

            booking.setNumberOfBeds(
                    null
            );

            booking.setPgBedsAllocated(
                    false
            );

            BigDecimal requestedRent =
                    request
                        .getRequestedMonthlyRent();

            if (
                    requestedRent ==
                    null
            ) {
                requestedRent =
                        property
                            .getMonthlyRent();
            }

            if (
                    requestedRent ==
                    null
            ) {
                throw new IllegalStateException(
                        "Requested monthly rent is required."
                );
            }

            booking.setRequestedMonthlyRent(
                    requestedRent
            );

            booking.setSecurityDeposit(
                    zeroIfNull(
                        property
                            .getSecurityDeposit()
                    )
            );
        }

        booking.setMaintenanceCharge(
                zeroIfNull(
                        property
                            .getMaintenanceCharge()
                )
        );

        booking.setRequestedMoveInDate(
                request
                    .getRequestedMoveInDate()
        );

        booking.setDurationMonths(
                request
                    .getDurationMonths()
        );

        booking.setNumberOfOccupants(
                request
                    .getNumberOfOccupants()
        );

        booking.setTenantMessage(
                request
                    .getTenantMessage()
        );

        booking.setStatus(
                BookingStatus.PENDING
        );

        /*
         * IMPORTANT:
         *
         * PG bed is NOT reduced here.
         *
         * It will be reduced only after
         * successful payment.
         */
        Booking saved =
                bookingRepository
                        .save(
                                booking
                        );

        return bookingMapper
                .toResponse(
                        saved
                );
    }

    /* =========================================================
       GET BOOKING BY ID
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public BookingResponse getBookingById(
            String bookingId
    ) {

        return bookingMapper
                .toResponse(
                        findBooking(
                                bookingId
                        )
                );
    }

    /* =========================================================
       TENANT BOOKINGS
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public List<BookingResponse>
    getTenantBookings(
            String tenantId
    ) {

        if (
                tenantId == null ||
                tenantId.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Tenant ID is required."
            );
        }

        return bookingRepository
                .findByTenantIdOrderByCreatedAtDesc(
                        tenantId
                )
                .stream()
                .map(
                        bookingMapper::
                        toResponse
                )
                .toList();
    }

    /* =========================================================
       LANDLORD BOOKINGS
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public List<BookingResponse>
    getLandlordBookings(
            String landlordId
    ) {

        if (
                landlordId == null ||
                landlordId.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Landlord ID is required."
            );
        }

        return bookingRepository
                .findByLandlordIdOrderByCreatedAtDesc(
                        landlordId
                )
                .stream()
                .map(
                        bookingMapper::
                        toResponse
                )
                .toList();
    }

    /* =========================================================
       BOOKING ALREADY EXISTS

       ONLY CURRENT TENANT.
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public boolean bookingAlreadyExists(
            String tenantId,
            Long propertyId
    ) {

        if (
                tenantId == null ||
                tenantId.isBlank() ||
                propertyId == null
        ) {
            return false;
        }

        List<Booking> bookings =
                bookingRepository
                        .findByTenantIdAndPropertyId(
                                tenantId,
                                propertyId
                        );

        return bookings
                .stream()
                .anyMatch(
                        booking ->
                                isBlockingStatus(
                                        booking
                                            .getStatus()
                                )
                );
    }

    /* =========================================================
       APPROVE BOOKING
    ========================================================= */

    @Override
    public BookingResponse approveBooking(
            String bookingId,
            BookingApproveRequest request
    ) {

        Booking booking =
                findBooking(
                        bookingId
                );

        if (
                booking.getStatus() !=
                BookingStatus.PENDING
        ) {
            throw new IllegalStateException(
                    "Only pending bookings can be approved."
            );
        }

        BigDecimal approvedRent =
                booking
                    .getRequestedMonthlyRent();

        approvedRent = negotiationRepository
                .findFirstByPropertyIdAndTenantIdAndStatusOrderByUpdatedAtDesc(
                        booking.getPropertyId(),
                        booking.getTenantId(),
                        NegotiationStatus.ACCEPTED
                )
                .map(negotiation -> negotiation.getAgreedRent())
                .filter(rent -> rent != null && rent.compareTo(BigDecimal.ZERO) > 0)
                .orElse(approvedRent);

        if (
                approvedRent == null
        ) {
            throw new IllegalStateException(
                    "Approved rent is required."
            );
        }

        LocalDate moveInDate =
                booking
                    .getRequestedMoveInDate();

        if (
                request != null &&
                request
                    .getApprovedMoveInDate()
                != null
        ) {
            moveInDate =
                    request
                        .getApprovedMoveInDate();
        }

        booking.setApprovedMonthlyRent(
                approvedRent
        );

        booking.setApprovedMoveInDate(
                moveInDate
        );

        if (request != null) {

            booking.setLandlordMessage(
                    request
                        .getLandlordMessage()
            );
        }

        BigDecimal total =
                approvedRent
                    .add(
                        zeroIfNull(
                            booking
                                .getSecurityDeposit()
                        )
                    )
                    .add(
                        zeroIfNull(
                            booking
                                .getMaintenanceCharge()
                        )
                    );

        booking.setTotalPayable(
                total
        );

        /*
         * IMPORTANT:
         *
         * Do NOT allocate PG bed here.
         */
        booking.setStatus(
                BookingStatus.WAITING_PAYMENT
        );

        Booking saved =
                bookingRepository
                        .save(
                                booking
                        );

        return bookingMapper
                .toResponse(
                        saved
                );
    }

    /* =========================================================
       REJECT BOOKING
    ========================================================= */

    @Override
    public BookingResponse rejectBooking(
            String bookingId,
            String reason
    ) {

        Booking booking =
                findBooking(
                        bookingId
                );

        if (
                booking.getStatus() !=
                BookingStatus.PENDING
        ) {
            throw new IllegalStateException(
                    "Only pending bookings can be rejected."
            );
        }

        booking.setStatus(
                BookingStatus.REJECTED
        );

        booking.setRejectionReason(
                reason
        );

        Booking saved =
                bookingRepository
                        .save(
                                booking
                        );

        return bookingMapper
                .toResponse(
                        saved
                );
    }

    /* =========================================================
       PAYMENT SUCCESS

       PG:
       availableBeds 6 -> 5

       Apartment:
       status AVAILABLE -> BOOKED
    ========================================================= */

    @Override
    public BookingResponse markPaymentSuccessful(
            String bookingId,
            String paymentId,
            String paymentOrderId
    ) {

        Booking booking =
                findBooking(
                        bookingId
                );

        boolean pg =
                "PG".equalsIgnoreCase(
                        booking.getPropertyCategory()
                );

        /*
         * Prevent Razorpay/payment retry
         * from decreasing PG beds twice.
         */
        if (
                pg &&
                Boolean.TRUE.equals(
                        booking.getPgBedsAllocated()
                )
        ) {

            return bookingMapper.toResponse(
                    booking
            );
        }

        booking.setPaymentId(
                paymentId
        );

        booking.setPaymentOrderId(
                paymentOrderId
        );

        booking.setPaymentDate(
                LocalDateTime.now()
        );

        if (pg) {

            Integer beds =
                    booking.getNumberOfBeds();

            if (
                    beds == null ||
                    beds < 1
            ) {
                beds = 1;
            }

            System.out.println(
                    "ALLOCATING PG BED(S): " +
                    "propertyId=" +
                    booking.getPropertyId() +
                    ", beds=" +
                    beds
            );

            /*
             * Calls Property Service:
             *
             * availableBeds 6 -> 5
             */
            propertyClient.bookPgBeds(
                    booking.getPropertyId(),
                    beds
            );

            booking.setPgBedsAllocated(
                    true
            );

        } else {

            /*
             * Apartment/non-PG:
             *
             * Whole property becomes booked.
             */
            propertyClient.updateRentalStatus(
                    booking.getPropertyId(),
                    "BOOKED"
            );
        }

        /*
         * Payment successful.
         */
        booking.setStatus(
                BookingStatus.ACTIVE
        );

        if (
                booking.getApprovedMoveInDate()
                != null
        ) {

            booking.setLeaseStartDate(
                    booking.getApprovedMoveInDate()
            );

            if (
                    booking.getDurationMonths() !=
                    null &&
                    booking.getDurationMonths() > 0
            ) {

                booking.setLeaseEndDate(
                        booking
                            .getApprovedMoveInDate()
                            .plusMonths(
                                booking.getDurationMonths()
                            )
                );
            }
        }

        Booking saved =
                bookingRepository.save(
                        booking
                );

        return bookingMapper.toResponse(
                saved
        );
    }
    /* =========================================================
       BLOCKING STATUS
    ========================================================= */

    @Override
    public BookingResponse cancelBooking(String bookingId) {
        Booking booking = findBooking(bookingId);
        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED)
            throw new IllegalStateException("This booking can no longer be cancelled.");
        if (booking.getStatus() == BookingStatus.PAID || booking.getStatus() == BookingStatus.ACTIVE || booking.getStatus() == BookingStatus.LEASE_ACTIVE)
            throw new IllegalStateException("A paid booking cannot be cancelled online. Please contact the landlord.");
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse activateLease(String bookingId) {
        Booking booking = findBooking(bookingId);
        if (booking.getStatus() != BookingStatus.PAID && booking.getStatus() != BookingStatus.ACTIVE)
            throw new IllegalStateException("Only a paid booking can start a lease.");
        booking.setStatus(BookingStatus.LEASE_ACTIVE);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse completeLease(String bookingId) {
        Booking booking = findBooking(bookingId);
        if (booking.getStatus() != BookingStatus.LEASE_ACTIVE && booking.getStatus() != BookingStatus.ACTIVE)
            throw new IllegalStateException("Only an active lease can be completed.");
        booking.setStatus(BookingStatus.COMPLETED);
        if ("PG".equalsIgnoreCase(booking.getPropertyCategory()) && Boolean.TRUE.equals(booking.getPgBedsAllocated()))
            propertyClient.releasePgBeds(booking.getPropertyId(), booking.getNumberOfBeds() == null ? 1 : booking.getNumberOfBeds());
        else
            propertyClient.updateRentalStatus(booking.getPropertyId(), "AVAILABLE");
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    private boolean isBlockingStatus(
            BookingStatus status
    ) {

        if (status == null) {
            return false;
        }

        return (
                status ==
                BookingStatus.PENDING ||

                status ==
                BookingStatus.WAITING_PAYMENT ||

                status ==
                BookingStatus.ACTIVE
        );
    }

    /* =========================================================
       PG CHECK
    ========================================================= */

    private boolean isPg(
            PropertyServiceResponse property
    ) {

        if (property == null) {
            return false;
        }

        return (
                "PG"
                    .equalsIgnoreCase(
                        property
                            .getCategory()
                    )
                ||
                "PER_BED_MONTHLY"
                    .equalsIgnoreCase(
                        property
                            .getPricingType()
                    )
        );
    }

    /* =========================================================
       PRIMARY IMAGE
    ========================================================= */

    private String getPrimaryImage(
            PropertyServiceResponse property
    ) {

        if (
                property.getPhotos() !=
                null &&
                !property
                    .getPhotos()
                    .isEmpty()
        ) {

            for (
                    PropertyClient.PropertyPhoto
                    photo :
                    property.getPhotos()
            ) {

                if (
                        photo != null &&
                        Boolean.TRUE
                            .equals(
                                photo
                                    .getPrimary()
                            )
                ) {

                    return photo
                            .getPhotoUrl();
                }
            }

            PropertyClient.PropertyPhoto
                    firstPhoto =
                    property
                        .getPhotos()
                        .get(0);

            if (firstPhoto != null) {

                return firstPhoto
                        .getPhotoUrl();
            }
        }

        return property.getImage();
    }

    /* =========================================================
       FIND BOOKING
    ========================================================= */

    private Booking findBooking(
            String bookingId
    ) {

        if (
                bookingId == null ||
                bookingId.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Booking ID is required."
            );
        }

        return bookingRepository
                .findById(
                        bookingId
                )
                .orElseThrow(
                        () ->
                            new IllegalArgumentException(
                                "Booking not found: " +
                                bookingId
                            )
                );
    }

    /* =========================================================
       BOOKING ID
    ========================================================= */

    private String generateBookingId() {

        return "BOOK-" +
                System.currentTimeMillis() +
                "-" +
                UUID.randomUUID()
                    .toString()
                    .substring(
                        0,
                        6
                    )
                    .toUpperCase();
    }

    private BigDecimal zeroIfNull(
            BigDecimal value
    ) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }

    private String valueOrEmpty(
            String value
    ) {

        return value == null
                ? ""
                : value;
    }

    private String valueOrDefault(
            String value,
            String defaultValue
    ) {

        if (
                value == null ||
                value.isBlank()
        ) {
            return defaultValue;
        }

        return value;
    }
}
