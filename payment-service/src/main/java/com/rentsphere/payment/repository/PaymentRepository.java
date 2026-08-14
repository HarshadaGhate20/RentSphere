package com.rentsphere.payment.repository;

import com.rentsphere.payment.entity.Payment;
import com.rentsphere.payment.entity.PaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository
    extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(
        String bookingId
    );

    Optional<Payment> findByRazorpayOrderId(
        String razorpayOrderId
    );

    Optional<Payment> findByRazorpayPaymentId(
        String razorpayPaymentId
    );

    List<Payment>
        findByTenantIdOrderByCreatedAtDesc(
            String tenantId
        );

    List<Payment>
        findByLandlordIdOrderByCreatedAtDesc(
            String landlordId
        );

    boolean existsByBookingIdAndStatus(
        String bookingId,
        PaymentStatus status
    );
}