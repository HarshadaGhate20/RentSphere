package com.rentsphere.payment.serviceimpl;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.UUID;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import com.rentsphere.payment.dto.BookingServiceResponse;
import com.rentsphere.payment.dto.CreateOrderRequest;
import com.rentsphere.payment.dto.CreateOrderResponse;
import com.rentsphere.payment.dto.PaymentResponse;
import com.rentsphere.payment.dto.VerifyPaymentRequest;

import com.rentsphere.payment.entity.Payment;
import com.rentsphere.payment.entity.PaymentStatus;

import com.rentsphere.payment.exception.PaymentNotFoundException;
import com.rentsphere.payment.exception.PaymentProcessingException;

import com.rentsphere.payment.repository.PaymentRepository;

import com.rentsphere.payment.service.BookingServiceClient;
import com.rentsphere.payment.service.PaymentService;

@Service
@Transactional
public class PaymentServiceImpl
        implements PaymentService {

    private final PaymentRepository
            paymentRepository;

    private final BookingServiceClient
            bookingServiceClient;

    private final RazorpayClient
            razorpayClient;

    private final String
            razorpayKeyId;

    private final String
            razorpayKeySecret;

    /* =========================================================
       CONSTRUCTOR
    ========================================================= */

    public PaymentServiceImpl(

            PaymentRepository
                    paymentRepository,

            BookingServiceClient
                    bookingServiceClient,

            RazorpayClient
                    razorpayClient,

            @Value(
                "${razorpay.key-id}"
            )
            String razorpayKeyId,

            @Value(
                "${razorpay.key-secret}"
            )
            String razorpayKeySecret
    ) {

        this.paymentRepository =
                paymentRepository;

        this.bookingServiceClient =
                bookingServiceClient;

        this.razorpayClient =
                razorpayClient;

        this.razorpayKeyId =
                razorpayKeyId;

        this.razorpayKeySecret =
                razorpayKeySecret;
    }

    /* =========================================================
       CREATE RAZORPAY ORDER
    ========================================================= */

    @Override
    public CreateOrderResponse createOrder(
            CreateOrderRequest request
    ) {

        if (
                request == null ||
                request.getBookingId() == null ||
                request.getBookingId().isBlank()
        ) {

            throw new PaymentProcessingException(
                    "Booking ID is required."
            );
        }

        String bookingId =
                request
                    .getBookingId()
                    .trim();

        /*
         * Load booking from Booking Service.
         */
        BookingServiceResponse booking =
                bookingServiceClient
                    .getBooking(
                            bookingId
                    );

        validateBookingForPayment(
                booking
        );

        /*
         * Do not allow duplicate successful
         * payment for the same booking.
         */
        if (
                paymentRepository
                    .existsByBookingIdAndStatus(
                            bookingId,
                            PaymentStatus.PAID
                    )
        ) {

            throw new PaymentProcessingException(
                    "Payment has already been completed for this booking."
            );
        }

        /*
         * If an unpaid Razorpay order
         * already exists, return it.
         */
        Payment existingPayment =
                paymentRepository
                    .findByBookingId(
                            bookingId
                    )
                    .orElse(
                            null
                    );

        if (
                existingPayment != null &&
                existingPayment.getStatus() ==
                    PaymentStatus.ORDER_CREATED
        ) {

            return mapToCreateOrderResponse(
                    existingPayment
            );
        }

        BigDecimal totalAmount =
                booking.getTotalPayable();

        long amountInPaise =
                totalAmount
                    .multiply(
                            new BigDecimal(
                                    "100"
                            )
                    )
                    .setScale(
                            0,
                            RoundingMode.HALF_UP
                    )
                    .longValueExact();

        try {

            JSONObject orderOptions =
                    new JSONObject();

            orderOptions.put(
                    "amount",
                    amountInPaise
            );

            orderOptions.put(
                    "currency",
                    "INR"
            );

            orderOptions.put(
                    "receipt",
                    createOrderReceipt(
                            bookingId
                    )
            );

            /*
             * Additional information sent
             * to Razorpay.
             */
            JSONObject notes =
                    new JSONObject();

            notes.put(
                    "bookingId",
                    bookingId
            );

            notes.put(
                    "tenantId",
                    safeText(
                            booking
                                .getTenantId()
                    )
            );

            notes.put(
                    "landlordId",
                    safeText(
                            booking
                                .getLandlordId()
                    )
            );

            notes.put(
                    "propertyId",
                    booking
                        .getPropertyId()
            );

            orderOptions.put(
                    "notes",
                    notes
            );

            /*
             * Create Razorpay order.
             */
            Order razorpayOrder =
                    razorpayClient
                        .orders
                        .create(
                                orderOptions
                        );

            /*
             * Save our payment record.
             */
            Payment payment =
                    new Payment();

            copyBookingData(
                    payment,
                    booking
            );

            payment.setBookingId(
                    bookingId
            );

            payment.setTotalAmount(
                    totalAmount
            );

            payment.setCurrency(
                    "INR"
            );

            payment.setRazorpayOrderId(
                    razorpayOrder
                        .get(
                            "id"
                        )
            );

            payment.setStatus(
                    PaymentStatus.ORDER_CREATED
            );

            Payment savedPayment =
                    paymentRepository
                        .save(
                                payment
                        );

            return mapToCreateOrderResponse(
                    savedPayment
            );

        } catch (
            PaymentProcessingException exception
        ) {

            throw exception;

        } catch (Exception exception) {

            throw new PaymentProcessingException(
                    "Unable to create Razorpay order: "
                    + exception.getMessage()
            );
        }
    }

    /* =========================================================
       VERIFY RAZORPAY PAYMENT
    ========================================================= */

    @Override
    public PaymentResponse verifyPayment(
            VerifyPaymentRequest request
    ) {

        if (request == null) {

            throw new PaymentProcessingException(
                    "Payment verification request is required."
            );
        }

        validateRequiredText(
                request.getBookingId(),
                "Booking ID is required."
        );

        validateRequiredText(
                request.getRazorpayOrderId(),
                "Razorpay order ID is required."
        );

        validateRequiredText(
                request.getRazorpayPaymentId(),
                "Razorpay payment ID is required."
        );

        validateRequiredText(
                request.getRazorpaySignature(),
                "Razorpay signature is required."
        );

        Payment payment =
                paymentRepository
                    .findByRazorpayOrderId(
                            request
                                .getRazorpayOrderId()
                    )
                    .orElseThrow(
                            () ->
                                new PaymentNotFoundException(
                                    "Payment order not found: "
                                    + request
                                        .getRazorpayOrderId()
                                )
                    );

        /*
         * Prevent verification against the
         * wrong booking.
         */
        if (
                !payment
                    .getBookingId()
                    .equals(
                        request
                            .getBookingId()
                    )
        ) {

            throw new PaymentProcessingException(
                    "Booking ID does not match the payment order."
            );
        }

        /*
         * Idempotency.
         *
         * If already paid, return payment.
         * Do not verify again.
         */
        if (
                payment.getStatus() ==
                    PaymentStatus.PAID
        ) {

            return mapToPaymentResponse(
                    payment
            );
        }

        try {

            JSONObject verificationData =
                    new JSONObject();

            verificationData.put(
                    "razorpay_order_id",
                    request
                        .getRazorpayOrderId()
            );

            verificationData.put(
                    "razorpay_payment_id",
                    request
                        .getRazorpayPaymentId()
            );

            verificationData.put(
                    "razorpay_signature",
                    request
                        .getRazorpaySignature()
            );

            /*
             * Verify Razorpay signature.
             */
            boolean validSignature =
                    Utils
                        .verifyPaymentSignature(
                            verificationData,
                            razorpayKeySecret
                        );

            if (!validSignature) {

                payment.setStatus(
                        PaymentStatus.FAILED
                );

                paymentRepository
                    .save(
                            payment
                    );

                /*
                 * Inform Booking Service.
                 */
                bookingServiceClient
                    .markPaymentFailed(
                            payment
                                .getBookingId()
                    );

                throw new PaymentProcessingException(
                        "Razorpay payment signature verification failed."
                );
            }

            /*
             * Signature is valid.
             */
            payment.setRazorpayPaymentId(
                    request
                        .getRazorpayPaymentId()
            );

            payment.setRazorpaySignature(
                    request
                        .getRazorpaySignature()
            );

            payment.setReceiptNumber(
                    generateReceiptNumber()
            );

            payment.setPaymentDate(
                    LocalDateTime.now()
            );

            payment.setStatus(
                    PaymentStatus.PAID
            );

            Payment savedPayment =
                    paymentRepository
                        .save(
                                payment
                        );

            /*
             * =================================================
             * VERY IMPORTANT
             *
             * Notify Booking Service that payment
             * succeeded.
             *
             * Booking Service will then:
             *
             * Normal property
             *      -> BOOKED
             *
             * PG
             *      -> reduce availableBeds
             *         e.g. 6 -> 5
             * =================================================
             */
            bookingServiceClient
                .markPaymentSuccessful(
                    savedPayment
                        .getBookingId(),

                    savedPayment
                        .getRazorpayPaymentId(),

                    savedPayment
                        .getRazorpayOrderId()
                );

            return mapToPaymentResponse(
                    savedPayment
            );

        } catch (
            PaymentProcessingException exception
        ) {

            throw exception;

        } catch (Exception exception) {

            throw new PaymentProcessingException(
                    "Unable to verify payment: "
                    + exception.getMessage()
            );
        }
    }

    /* =========================================================
       GET PAYMENT BY PAYMENT DATABASE ID
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public PaymentResponse getPaymentById(
            Long paymentId
    ) {

        if (paymentId == null) {

            throw new IllegalArgumentException(
                    "Payment ID is required."
            );
        }

        Payment payment =
                paymentRepository
                    .findById(
                            paymentId
                    )
                    .orElseThrow(
                            () ->
                                new PaymentNotFoundException(
                                    "Payment not found with ID: "
                                    + paymentId
                                )
                    );

        return mapToPaymentResponse(
                payment
        );
    }

    /* =========================================================
       GET PAYMENT BY BOOKING ID
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public PaymentResponse
    getPaymentByBookingId(
            String bookingId
    ) {

        validateRequiredText(
                bookingId,
                "Booking ID is required."
        );

        Payment payment =
                paymentRepository
                    .findByBookingId(
                            bookingId
                    )
                    .orElseThrow(
                            () ->
                                new PaymentNotFoundException(
                                    "Payment not found for booking: "
                                    + bookingId
                                )
                    );

        return mapToPaymentResponse(
                payment
        );
    }

    /* =========================================================
       TENANT PAYMENT HISTORY
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public List<PaymentResponse>
    getTenantPayments(
            String tenantId
    ) {

        validateRequiredText(
                tenantId,
                "Tenant ID is required."
        );

        return paymentRepository
                .findByTenantIdOrderByCreatedAtDesc(
                        tenantId
                )
                .stream()
                .map(
                        this::mapToPaymentResponse
                )
                .toList();
    }

    /* =========================================================
       LANDLORD PAYMENT HISTORY
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public List<PaymentResponse>
    getLandlordPayments(
            String landlordId
    ) {

        validateRequiredText(
                landlordId,
                "Landlord ID is required."
        );

        return paymentRepository
                .findByLandlordIdOrderByCreatedAtDesc(
                        landlordId
                )
                .stream()
                .map(
                        this::mapToPaymentResponse
                )
                .toList();
    }

    /* =========================================================
       ALL PAYMENTS - ADMIN

       THIS WAS THE METHOD MISSING FROM
       YOUR PREVIOUS PaymentServiceImpl.
    ========================================================= */

    @Override
    @Transactional(
        readOnly = true
    )
    public List<PaymentResponse>
    getAllPayments() {

        return paymentRepository
                .findAll()
                .stream()
                .map(
                        this::mapToPaymentResponse
                )
                .toList();
    }

    /* =========================================================
       VALIDATE BOOKING
    ========================================================= */

    private void validateBookingForPayment(
            BookingServiceResponse booking
    ) {

        if (
                booking == null ||
                booking.getId() == null
        ) {

            throw new PaymentProcessingException(
                    "Booking information could not be loaded."
            );
        }

        /*
         * Landlord must first approve the booking.
         */
        if (
                !"WAITING_PAYMENT"
                    .equalsIgnoreCase(
                        booking
                            .getStatus()
                    )
        ) {

            throw new PaymentProcessingException(
                    "Payment can only be created for a booking waiting for payment."
            );
        }

        if (
                booking.getTotalPayable() ==
                    null ||
                booking
                    .getTotalPayable()
                    .compareTo(
                        BigDecimal.ZERO
                    ) <= 0
        ) {

            throw new PaymentProcessingException(
                    "Booking payable amount is invalid."
            );
        }
    }

    /* =========================================================
       COPY BOOKING DETAILS TO PAYMENT
    ========================================================= */

    private void copyBookingData(

            Payment payment,

            BookingServiceResponse booking
    ) {

        payment.setPropertyId(
                booking
                    .getPropertyId()
        );

        payment.setPropertyTitle(
                booking
                    .getPropertyTitle()
        );

        payment.setPropertyImage(
                booking
                    .getPropertyImage()
        );

        payment.setPropertyArea(
                booking
                    .getPropertyArea()
        );

        payment.setPropertyCity(
                booking
                    .getPropertyCity()
        );

        payment.setTenantId(
                booking
                    .getTenantId()
        );

        payment.setTenantName(
                booking
                    .getTenantName()
        );

        payment.setLandlordId(
                booking
                    .getLandlordId()
        );

        payment.setLandlordName(
                booking
                    .getLandlordName()
        );

        payment.setApprovedMonthlyRent(
                defaultMoney(
                        booking
                            .getApprovedMonthlyRent()
                )
        );

        payment.setSecurityDeposit(
                defaultMoney(
                        booking
                            .getSecurityDeposit()
                )
        );

        payment.setMaintenanceCharge(
                defaultMoney(
                        booking
                            .getMaintenanceCharge()
                )
        );
    }

    /* =========================================================
       MAP PAYMENT -> CREATE ORDER RESPONSE
    ========================================================= */

    private CreateOrderResponse
    mapToCreateOrderResponse(
            Payment payment
    ) {

        CreateOrderResponse response =
                new CreateOrderResponse();

        response.setPaymentRecordId(
                payment.getId()
        );

        response.setBookingId(
                payment.getBookingId()
        );

        response.setRazorpayOrderId(
                payment
                    .getRazorpayOrderId()
        );

        response.setRazorpayKeyId(
                razorpayKeyId
        );

        response.setAmountInRupees(
                payment
                    .getTotalAmount()
        );

        response.setAmountInPaise(
                payment
                    .getTotalAmount()
                    .multiply(
                            new BigDecimal(
                                    "100"
                            )
                    )
                    .setScale(
                            0,
                            RoundingMode.HALF_UP
                    )
                    .longValueExact()
        );

        response.setCurrency(
                payment
                    .getCurrency()
        );

        response.setTenantName(
                payment
                    .getTenantName()
        );

        response.setPropertyTitle(
                payment
                    .getPropertyTitle()
        );

        return response;
    }

    /* =========================================================
       MAP PAYMENT -> PAYMENT RESPONSE
    ========================================================= */

    private PaymentResponse mapToPaymentResponse(
            Payment payment
    ) {

        PaymentResponse response =
                new PaymentResponse();

        response.setId(
                payment.getId()
        );

        response.setReceiptNumber(
                payment
                    .getReceiptNumber()
        );

        response.setBookingId(
                payment
                    .getBookingId()
        );

        response.setPropertyId(
                payment
                    .getPropertyId()
        );

        response.setPropertyTitle(
                payment
                    .getPropertyTitle()
        );

        response.setPropertyImage(
                payment
                    .getPropertyImage()
        );

        response.setPropertyArea(
                payment
                    .getPropertyArea()
        );

        response.setPropertyCity(
                payment
                    .getPropertyCity()
        );

        response.setTenantId(
                payment
                    .getTenantId()
        );

        response.setTenantName(
                payment
                    .getTenantName()
        );

        response.setLandlordId(
                payment
                    .getLandlordId()
        );

        response.setLandlordName(
                payment
                    .getLandlordName()
        );

        response.setApprovedMonthlyRent(
                payment
                    .getApprovedMonthlyRent()
        );

        response.setSecurityDeposit(
                payment
                    .getSecurityDeposit()
        );

        response.setMaintenanceCharge(
                payment
                    .getMaintenanceCharge()
        );

        response.setTotalAmount(
                payment
                    .getTotalAmount()
        );

        response.setRazorpayOrderId(
                payment
                    .getRazorpayOrderId()
        );

        response.setRazorpayPaymentId(
                payment
                    .getRazorpayPaymentId()
        );

        response.setCurrency(
                payment
                    .getCurrency()
        );

        response.setStatus(
                payment
                    .getStatus()
        );

        response.setPaymentDate(
                payment
                    .getPaymentDate()
        );

        response.setCreatedAt(
                payment
                    .getCreatedAt()
        );

        response.setUpdatedAt(
                payment
                    .getUpdatedAt()
        );

        return response;
    }

    /* =========================================================
       CREATE RAZORPAY RECEIPT
    ========================================================= */

    private String createOrderReceipt(
            String bookingId
    ) {

        /*
         * Razorpay receipt has length limits,
         * therefore shorten booking ID if needed.
         */
        String shortId =
                bookingId.length() > 25
                        ? bookingId.substring(
                                0,
                                25
                        )
                        : bookingId;

        return "ORDER-"
                + shortId
                + "-"
                + System.currentTimeMillis();
    }

    /* =========================================================
       GENERATE PAYMENT RECEIPT NUMBER
    ========================================================= */

    private String generateReceiptNumber() {

        String datePart =
                LocalDateTime
                    .now()
                    .format(
                        DateTimeFormatter
                            .ofPattern(
                                "yyyyMMdd"
                            )
                    );

        String randomPart =
                UUID
                    .randomUUID()
                    .toString()
                    .replace(
                            "-",
                            ""
                    )
                    .substring(
                            0,
                            8
                    )
                    .toUpperCase();

        return "RCP-"
                + datePart
                + "-"
                + randomPart;
    }

    /* =========================================================
       MONEY HELPER
    ========================================================= */

    private BigDecimal defaultMoney(
            BigDecimal value
    ) {

        return value == null
                ? BigDecimal.ZERO
                : value;
    }

    /* =========================================================
       TEXT VALIDATION
    ========================================================= */

    private void validateRequiredText(
            String value,
            String message
    ) {

        if (
                value == null ||
                value.isBlank()
        ) {

            throw new IllegalArgumentException(
                    message
            );
        }
    }

    /* =========================================================
       NULL SAFE TEXT
    ========================================================= */

    private String safeText(
            String value
    ) {

        return value == null
                ? ""
                : value;
    }
}