import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  getPaymentByBookingId,
} from "../../services/paymentApi";

const TenantPaymentSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] =
    useState(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const data =
          await getPaymentByBookingId(
            bookingId
          );

        setPayment(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    loadPayment();
  }, [bookingId]);

  if (!payment) {
    return (
      <div className="p-4">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm p-5 text-center">
        <h1 className="text-success">
          Payment Successful
        </h1>

        <p>
          Receipt:{" "}
          {payment.receiptNumber}
        </p>

        <h2>
          ₹
          {Number(
            payment.totalAmount
          ).toLocaleString(
            "en-IN"
          )}
        </h2>

        <p>
          Booking ID:{" "}
          {payment.bookingId}
        </p>

        <p>
          Payment ID:{" "}
          {payment.razorpayPaymentId}
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              `/tenant/payment-receipt/${bookingId}`
            )
          }
        >
          View Receipt
        </button>

        <button
          type="button"
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate(`/tenant/lease-document/${bookingId}`)}
        >
          Download Lease Agreement
        </button>
      </div>
    </div>
  );
};

export default TenantPaymentSuccess;
