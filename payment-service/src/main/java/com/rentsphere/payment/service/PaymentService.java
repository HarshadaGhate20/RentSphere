package com.rentsphere.payment.service;

import java.util.List;

import com.rentsphere.payment.dto.CreateOrderRequest;
import com.rentsphere.payment.dto.CreateOrderResponse;
import com.rentsphere.payment.dto.PaymentResponse;
import com.rentsphere.payment.dto.VerifyPaymentRequest;

public interface PaymentService {

    /*
     * Create Razorpay order for booking.
     */
    CreateOrderResponse createOrder(
            CreateOrderRequest request
    );

    /*
     * Verify successful Razorpay payment.
     */
    PaymentResponse verifyPayment(
            VerifyPaymentRequest request
    );

    /*
     * Get payment using booking ID.
     */
    PaymentResponse getPaymentByBookingId(
            String bookingId
    );

    /*
     * Get payment using database payment ID.
     */
    PaymentResponse getPaymentById(
            Long paymentId
    );

    /*
     * Get tenant payment history.
     */
    List<PaymentResponse> getTenantPayments(
            String tenantId
    );

    /*
     * Get landlord payment history.
     */
    List<PaymentResponse> getLandlordPayments(
            String landlordId
    );

    /*
     * Get all payments.
     *
     * Mainly used by Admin.
     */
    List<PaymentResponse> getAllPayments();
}