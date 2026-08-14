import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  getPaymentByBookingId,
} from "../../services/paymentApi";

const TenantPaymentReceipt = () => {
  const { bookingId } = useParams();

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
        Loading receipt...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div
        className="card border-0 shadow-sm p-5"
        id="payment-receipt"
      >
        <div className="d-flex justify-content-between">
          <div>
            <h2>RentSphere</h2>
            <p>
              Property Rental Management
            </p>
          </div>

          <div className="text-end">
            <small>
              PAYMENT RECEIPT
            </small>

            <h2>RECEIPT</h2>
          </div>
        </div>

        <hr />

        <div className="alert alert-success d-flex justify-content-between">
          <span>
            Payment successful
          </span>

          <strong>
            ₹
            {Number(
              payment.totalAmount
            ).toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <strong>
              Receipt Number
            </strong>
            <p>
              {payment.receiptNumber}
            </p>
          </div>

          <div className="col-md-4">
            <strong>
              Booking ID
            </strong>
            <p>{payment.bookingId}</p>
          </div>

          <div className="col-md-4">
            <strong>
              Payment ID
            </strong>
            <p>
              {payment.razorpayPaymentId}
            </p>
          </div>

          <div className="col-md-4">
            <strong>
              Order ID
            </strong>
            <p>
              {payment.razorpayOrderId}
            </p>
          </div>

          <div className="col-md-4">
            <strong>Status</strong>
            <p>{payment.status}</p>
          </div>

          <div className="col-md-4">
            <strong>
              Payment Date
            </strong>
            <p>
              {payment.paymentDate
                ? new Date(
                    payment.paymentDate
                  ).toLocaleString(
                    "en-IN"
                  )
                : "-"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4>
            {payment.propertyTitle}
          </h4>

          <p>
            {payment.propertyArea},{" "}
            {payment.propertyCity}
          </p>
        </div>

        <table className="table mt-4">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-end">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                Approved monthly rent
              </td>
              <td className="text-end">
                ₹
                {Number(
                  payment
                    .approvedMonthlyRent
                ).toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>

            <tr>
              <td>
                Security deposit
              </td>
              <td className="text-end">
                ₹
                {Number(
                  payment
                    .securityDeposit
                ).toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>

            <tr>
              <th>Total Paid</th>
              <th className="text-end">
                ₹
                {Number(
                  payment.totalAmount
                ).toLocaleString(
                  "en-IN"
                )}
              </th>
            </tr>
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() =>
            window.print()
          }
        >
          Download / Print Receipt
        </button>
      </div>
    </div>
  );
};

export default TenantPaymentReceipt;