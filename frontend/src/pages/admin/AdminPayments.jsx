import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaFlag,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaSearch,
  FaTimes,
  FaTimesCircle,
  FaUndoAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";

import { getAllPayments } from "../../services/paymentApi";
import "../../assets/css/adminPayments.css";

const paymentTabs = [
  { value: "ALL", label: "All Payments" },
  { value: "SUCCESS", label: "Successful" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "FLAGGED", label: "Flagged" },
];

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [paymentType, setPaymentType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    getAllPayments().then((rows) => setPayments((Array.isArray(rows) ? rows : []).map((p) => ({
      ...p,
      id: p.id || p.paymentRecordId,
      transactionId: p.razorpayPaymentId,
      type: "BOOKING_AMOUNT",
      status: p.status === "PAID" ? "SUCCESS" : p.status,
      amount: Number(p.totalAmount || 0),
      paymentMethod: "RAZORPAY",
      paidOn: p.paymentDate,
      refundedAmount: 0,
      flagged: false,
      tenant: { id: p.tenantId, name: p.tenantName || "Tenant", email: p.tenantEmail || "", phone: "" },
      landlord: { id: p.landlordId, name: p.landlordName || "Landlord", email: "" },
      property: { id: p.propertyId, title: p.propertyTitle || "Property", city: p.propertyCity || "", area: p.propertyArea || "" },
    })))).catch((error) => toast.error(error.message));
  }, []);

  const selectedPayment = useMemo(
    () =>
      payments.find(
        (payment) => payment.id === selectedPaymentId
      ) || null,
    [payments, selectedPaymentId]
  );

  const summary = useMemo(
    () => ({
      totalTransactions: payments.length,

      successfulAmount: payments
        .filter((payment) => payment.status === "SUCCESS")
        .reduce((total, payment) => total + payment.amount, 0),

      pendingAmount: payments
        .filter((payment) => payment.status === "PENDING")
        .reduce((total, payment) => total + payment.amount, 0),

      refundedAmount: payments.reduce(
        (total, payment) =>
          total + (payment.refundedAmount || 0),
        0
      ),

      failed: payments.filter(
        (payment) => payment.status === "FAILED"
      ).length,

      flagged: payments.filter((payment) => payment.flagged)
        .length,
    }),
    [payments]
  );

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesTab =
        activeTab === "ALL" ||
        (activeTab === "FLAGGED"
          ? payment.flagged
          : payment.status === activeTab);

      const matchesType =
        paymentType === "ALL" ||
        payment.type === paymentType;

      const searchableText = [
        payment.id,
        payment.transactionId,
        payment.bookingId,
        payment.tenant.name,
        payment.tenant.email,
        payment.landlord.name,
        payment.property.title,
        payment.property.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesTab && matchesType && matchesSearch;
    });
  }, [activeTab, paymentType, payments, search]);

  const togglePaymentFlag = (paymentId) => {
    let nextFlagValue = false;

    setPayments((currentPayments) =>
      currentPayments.map((payment) => {
        if (payment.id !== paymentId) {
          return payment;
        }

        nextFlagValue = !payment.flagged;

        return {
          ...payment,
          flagged: nextFlagValue,
        };
      })
    );

    toast.success(
      nextFlagValue
        ? "Payment flagged for administrator review."
        : "Payment flag removed."
    );
  };

  const resetFilters = () => {
    setActiveTab("ALL");
    setPaymentType("ALL");
    setSearch("");
  };

  return (
    <div className="admin-payments-page">
      <motion.section
        className="admin-payments-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="admin-payments-eyebrow">
            Payment monitoring
          </span>

          <h1>Manage payment transactions</h1>

          <p>
            Monitor rent payments, security deposits, failed
            transactions and refunds across RentSphere.
          </p>
        </div>

        <div className="admin-payments-header-icon">
          <FaCreditCard />
        </div>
      </motion.section>

      <section className="payment-summary-grid">
        <article className="payment-summary-card">
          <div className="payment-summary-top">
            <span>Total Transactions</span>

            <div className="payment-summary-icon total">
              <FaCreditCard />
            </div>
          </div>

          <strong>{summary.totalTransactions}</strong>
          <small>All payment records</small>
        </article>

        <article className="payment-summary-card">
          <div className="payment-summary-top">
            <span>Successful Amount</span>

            <div className="payment-summary-icon successful">
              <FaCheckCircle />
            </div>
          </div>

          <strong>
            ₹{summary.successfulAmount.toLocaleString("en-IN")}
          </strong>

          <small>Successfully collected</small>
        </article>

        <article className="payment-summary-card">
          <div className="payment-summary-top">
            <span>Pending Amount</span>

            <div className="payment-summary-icon pending">
              <FaClock />
            </div>
          </div>

          <strong>
            ₹{summary.pendingAmount.toLocaleString("en-IN")}
          </strong>

          <small>Awaiting payment completion</small>
        </article>

        <article className="payment-summary-card">
          <div className="payment-summary-top">
            <span>Refunded Amount</span>

            <div className="payment-summary-icon refunded">
              <FaUndoAlt />
            </div>
          </div>

          <strong>
            ₹{summary.refundedAmount.toLocaleString("en-IN")}
          </strong>

          <small>Returned to tenants</small>
        </article>
      </section>

      <section className="admin-payments-content">
        <div className="admin-payments-toolbar">
          <div className="admin-payment-tabs">
            {paymentTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={
                  activeTab === tab.value ? "active" : ""
                }
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}

                {tab.value === "FLAGGED" &&
                  summary.flagged > 0 && (
                    <span>{summary.flagged}</span>
                  )}
              </button>
            ))}
          </div>

          <div className="admin-payment-controls">
            <div className="admin-payment-search">
              <FaSearch />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search transaction, booking or tenant"
              />
            </div>

            <select
              value={paymentType}
              onChange={(event) =>
                setPaymentType(event.target.value)
              }
              aria-label="Filter payment type"
            >
              <option value="ALL">All payment types</option>
              <option value="BOOKING_AMOUNT">
                Booking amount
              </option>
              <option value="SECURITY_DEPOSIT">
                Security deposit
              </option>
              <option value="MONTHLY_RENT">
                Monthly rent
              </option>
            </select>

            <button
              type="button"
              className="admin-payment-reset"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="admin-payment-result-heading">
          <div>
            <span>Transaction records</span>

            <h2>
              {activeTab === "ALL"
                ? "All payments"
                : activeTab === "FLAGGED"
                  ? "Flagged payments"
                  : `${activeTab.toLowerCase()} payments`}
            </h2>
          </div>

          <p>
            {filteredPayments.length} result
            {filteredPayments.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="admin-payment-table-wrapper">
          <table className="admin-payment-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Tenant</th>
                <th>Property</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className={
                    payment.flagged ? "flagged-row" : ""
                  }
                >
                  <td>
                    <div className="payment-reference-cell">
                      <div className="payment-reference-icon">
                        <FaWallet />
                      </div>

                      <div>
                        <strong>{payment.id}</strong>
                        <span>{payment.bookingId}</span>

                        {payment.flagged && (
                          <small>
                            <FaFlag />
                            Flagged
                          </small>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="payment-person-cell">
                        <strong>{payment.tenant.name}</strong>

                        <span>
                        {payment.tenant.email}
                        </span>
                    </div>
                    </td>

                  <td>
                    <div className="payment-property-cell">
                        <strong>{payment.property.title}</strong>

                        <span>
                        {payment.property.city}
                        </span>
                    </div>
                    </td>

                  <td>
                    <span className="payment-type-badge">
                      {payment.type.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    <strong className="payment-amount">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </strong>
                  </td>

                  <td>{payment.paymentMethod.replaceAll("_", " ")}</td>

                  <td>
                    <span
                      className={`payment-status ${payment.status.toLowerCase()}`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="payment-view-button"
                      onClick={() =>
                        setSelectedPaymentId(payment.id)
                      }
                    >
                      <FaEye />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="admin-payments-empty"
                  >
                    <FaCreditCard />

                    <h3>No payments found</h3>

                    <p>
                      Try changing the selected filters or
                      search text.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedPayment && (
        <div
          className="payment-modal-backdrop"
          onMouseDown={() => setSelectedPaymentId(null)}
        >
          <div
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="payment-modal-close"
              onClick={() => setSelectedPaymentId(null)}
              aria-label="Close payment details"
            >
              <FaTimes />
            </button>

            <div className="payment-modal-header">
              <div className="payment-modal-icon">
                <FaMoneyBillWave />
              </div>

              <div>
                <div className="payment-modal-reference">
                  <span>{selectedPayment.id}</span>

                  {selectedPayment.flagged && (
                    <span className="payment-flagged-label">
                      <FaFlag />
                      Flagged
                    </span>
                  )}
                </div>

                <h2 id="payment-modal-title">
                  ₹
                  {selectedPayment.amount.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p>
                  {selectedPayment.type.replaceAll("_", " ")}
                </p>
              </div>

              <span
                className={`payment-status ${selectedPayment.status.toLowerCase()}`}
              >
                {selectedPayment.status}
              </span>
            </div>

            <div className="payment-modal-body">
              {selectedPayment.flagged && (
                <div className="payment-warning-banner">
                  <FaExclamationTriangle />

                  <div>
                    <strong>
                      This transaction is flagged
                    </strong>

                    <span>
                      Review the transaction and associated
                      booking for suspicious activity.
                    </span>
                  </div>
                </div>
              )}

              <section className="payment-detail-grid">
                <div>
                  <FaCreditCard />
                  <span>Transaction ID</span>
                  <strong>
                    {selectedPayment.transactionId ||
                      "Not generated"}
                  </strong>
                </div>

                <div>
                  <FaBuilding />
                  <span>Booking ID</span>
                  <strong>{selectedPayment.bookingId}</strong>
                </div>

                <div>
                  <FaWallet />
                  <span>Payment method</span>
                  <strong>
                    {selectedPayment.paymentMethod.replaceAll(
                      "_",
                      " "
                    )}
                  </strong>
                </div>

                <div>
                  <FaClock />
                  <span>Payment date</span>
                  <strong>
                    {selectedPayment.paidOn || "Not paid"}
                  </strong>
                </div>
              </section>

              <section className="payment-party-grid">
                <div className="payment-party-card">
                  <div className="payment-party-icon tenant">
                    <FaUser />
                  </div>

                  <div>
                    <span>Tenant details</span>
                    <h3>{selectedPayment.tenant.name}</h3>

                    <p>
                      <FaEnvelope />
                      {selectedPayment.tenant.email}
                    </p>

                    <p>
                      <FaPhoneAlt />
                      {selectedPayment.tenant.phone}
                    </p>
                  </div>
                </div>

                <div className="payment-party-card">
                  <div className="payment-party-icon landlord">
                    <FaBuilding />
                  </div>

                  <div>
                    <span>Landlord details</span>
                    <h3>{selectedPayment.landlord.name}</h3>

                    <p>
                      <FaEnvelope />
                      {selectedPayment.landlord.email}
                    </p>
                  </div>
                </div>
              </section>

              <section className="payment-property-box">
                <FaMapMarkerAlt />

                <div>
                  <span>Property</span>
                  <strong>
                    {selectedPayment.property.title}
                  </strong>

                  <p>
                    {selectedPayment.property.area},{" "}
                    {selectedPayment.property.city}
                  </p>
                </div>
              </section>

              {selectedPayment.failureReason && (
                <section className="payment-failure-box">
                  <FaTimesCircle />

                  <div>
                    <strong>Failure reason</strong>
                    <p>{selectedPayment.failureReason}</p>
                  </div>
                </section>
              )}

              {selectedPayment.status === "REFUNDED" && (
                <section className="payment-refund-box">
                  <FaUndoAlt />

                  <div>
                    <strong>Refund details</strong>

                    <p>
                      Amount: ₹
                      {selectedPayment.refundedAmount.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p>
                      Refunded on:{" "}
                      {selectedPayment.refundedOn}
                    </p>

                    <p>
                      Reference:{" "}
                      {selectedPayment.refundReference}
                    </p>
                  </div>
                </section>
              )}

              <div className="payment-modal-actions">
                <button
                  type="button"
                  className={
                    selectedPayment.flagged
                      ? "payment-remove-flag"
                      : "payment-add-flag"
                  }
                  onClick={() =>
                    togglePaymentFlag(selectedPayment.id)
                  }
                >
                  <FaFlag />

                  {selectedPayment.flagged
                    ? "Remove Flag"
                    : "Flag Payment"}
                </button>

                <button
                  type="button"
                  className="payment-close-details"
                  onClick={() => setSelectedPaymentId(null)}
                >
                  <FaTimes />
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
