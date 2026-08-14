package com.rentsphere.payment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentsphere.payment.dto.CreateOrderRequest;
import com.rentsphere.payment.dto.CreateOrderResponse;
import com.rentsphere.payment.dto.PaymentResponse;
import com.rentsphere.payment.dto.VerifyPaymentRequest;
import com.rentsphere.payment.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService
    ) {
        this.paymentService =
                paymentService;
    }

    /* =========================================================
       CREATE RAZORPAY ORDER
       POST /api/payments/orders
    ========================================================= */

    @PostMapping("/orders")
    public ResponseEntity<CreateOrderResponse>
    createOrder(
            @Valid
            @RequestBody
            CreateOrderRequest request
    ) {

        CreateOrderResponse response =
                paymentService.createOrder(
                        request
                );

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        response
                );
    }

    /* =========================================================
       VERIFY RAZORPAY PAYMENT
       POST /api/payments/verify
    ========================================================= */

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse>
    verifyPayment(
            @Valid
            @RequestBody
            VerifyPaymentRequest request
    ) {

        PaymentResponse response =
                paymentService.verifyPayment(
                        request
                );

        return ResponseEntity.ok(
                response
        );
    }

    /* =========================================================
       GET PAYMENT BY BOOKING ID
       GET /api/payments/booking/{bookingId}
    ========================================================= */

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse>
    getPaymentByBookingId(
            @PathVariable
            String bookingId
    ) {

        PaymentResponse response =
                paymentService
                        .getPaymentByBookingId(
                                bookingId
                        );

        return ResponseEntity.ok(
                response
        );
    }

    /* =========================================================
       GET LANDLORD PAYMENTS
       GET /api/payments/landlord/{landlordId}
    ========================================================= */

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<PaymentResponse>>
    getLandlordPayments(
            @PathVariable
            String landlordId
    ) {

        List<PaymentResponse> payments =
                paymentService
                        .getLandlordPayments(
                                landlordId
                        );

        return ResponseEntity.ok(
                payments
        );
    }

    /* =========================================================
       GET TENANT PAYMENTS
       GET /api/payments/tenant/{tenantId}
    ========================================================= */

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<PaymentResponse>>
    getTenantPayments(
            @PathVariable
            String tenantId
    ) {

        List<PaymentResponse> payments =
                paymentService
                        .getTenantPayments(
                                tenantId
                        );

        return ResponseEntity.ok(
                payments
        );
    }

    /* =========================================================
       GET ALL PAYMENTS - ADMIN
       GET /api/payments/admin
    ========================================================= */

    @GetMapping("/admin")
    public ResponseEntity<List<PaymentResponse>>
    getAllPayments() {

        List<PaymentResponse> payments =
                paymentService
                        .getAllPayments();

        return ResponseEntity.ok(
                payments
        );
    }

    /* =========================================================
       GET PAYMENT BY PAYMENT ID

       IMPORTANT:
       Do NOT use:
       GET /api/payments/{paymentId}

       Otherwise "landlord" may be interpreted as paymentId.

       Use:
       GET /api/payments/id/{paymentId}
    ========================================================= */

    @GetMapping("/id/{paymentId}")
    public ResponseEntity<PaymentResponse>
    getPaymentById(
            @PathVariable
            Long paymentId
    ) {

        PaymentResponse response =
                paymentService
                        .getPaymentById(
                                paymentId
                        );

        return ResponseEntity.ok(
                response
        );
    }
}