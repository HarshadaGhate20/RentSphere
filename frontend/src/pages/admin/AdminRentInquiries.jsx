import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaFlag,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaTimes,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

import { getAllNegotiations } from "../../services/negotiationApi";
import "../../assets/css/adminRentInquiries.css";

const normalizeStatus = (status) => {
  if (status === "CLOSED") {
    return "RESOLVED";
  }

  return status;
};

const AdminRentInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [search, setSearch] = useState("");
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);

  useEffect(() => {
    getAllNegotiations().then((rows) => setInquiries((Array.isArray(rows) ? rows : []).map((n) => ({
      ...n,
      id: n.id,
      status: ["ACCEPTED", "REJECTED"].includes(n.status) ? "RESOLVED" : n.status === "CANCELLED" ? "CANCELLED" : "ACTIVE",
      createdOn: n.createdAt,
      lastUpdated: n.updatedAt,
      flagged: false,
      resolvedByAdmin: false,
      tenant: { name: n.tenantName || "Tenant", email: n.tenantEmail || "", phone: "" },
      landlord: { name: n.landlordName || "Landlord", email: "", phone: "" },
      property: { id: n.propertyId, title: n.propertyTitle || "Property", type: "Property", city: "", area: "", rent: Number(n.listedRent || 0), image: "" },
      tenantOffer: Number(n.tenantProposedRent || 0),
      landlordOffer: Number(n.landlordCounterRent || 0),
      finalRent: Number(n.agreedRent || 0),
      message: n.tenantMessage || "",
      negotiations: [],
    })))).catch((error) => toast.error(error.message));
  }, []);

  const selectedInquiry = useMemo(
    () =>
      inquiries.find(
        (inquiry) => inquiry.id === selectedInquiryId
      ) || null,
    [inquiries, selectedInquiryId]
  );

  const summary = useMemo(() => {
    return {
      total: inquiries.length,

      active: inquiries.filter(
        (inquiry) => inquiry.status === "ACTIVE"
      ).length,

      resolved: inquiries.filter(
        (inquiry) => inquiry.status === "RESOLVED"
      ).length,

      cancelled: inquiries.filter(
        (inquiry) => inquiry.status === "CANCELLED"
      ).length,

      flagged: inquiries.filter(
        (inquiry) => inquiry.flagged
      ).length,
    };
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const matchesTab =
        activeTab === "ALL" ||
        (activeTab === "FLAGGED"
          ? inquiry.flagged
          : inquiry.status === activeTab);

      const searchableText = [
        inquiry.id,
        inquiry.tenant.name,
        inquiry.tenant.email,
        inquiry.landlord.name,
        inquiry.landlord.email,
        inquiry.property.title,
        inquiry.property.city,
        inquiry.property.area,
        inquiry.property.type,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, inquiries, search]);

  const markAsResolved = (inquiryId) => {
    setInquiries((currentInquiries) =>
      currentInquiries.map((inquiry) =>
        inquiry.id === inquiryId
          ? {
              ...inquiry,
              status: "RESOLVED",
              resolvedByAdmin: true,
              resolvedOn: new Date().toLocaleDateString("en-IN"),
            }
          : inquiry
      )
    );

    setSelectedInquiryId(null);
    toast.success("Inquiry marked as resolved.");
  };

  const toggleFlagInquiry = (inquiryId) => {
    let isNowFlagged = false;

    setInquiries((currentInquiries) =>
      currentInquiries.map((inquiry) => {
        if (inquiry.id !== inquiryId) {
          return inquiry;
        }

        isNowFlagged = !inquiry.flagged;

        return {
          ...inquiry,
          flagged: isNowFlagged,
        };
      })
    );

    toast.success(
      isNowFlagged
        ? "Inquiry flagged for administrator review."
        : "Inquiry flag removed."
    );
  };

  return (
    <div className="inquiries-page">
      <motion.section
        className="inquiries-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="inquiries-eyebrow">
            Rent inquiry monitoring
          </span>

          <h1>Manage rent inquiries</h1>

          <p>
            Review tenant-landlord conversations, monitor rent
            negotiations and flag suspicious or disputed inquiries.
          </p>
        </div>

        <div className="inquiries-header-icon">
          <FaComments />
        </div>
      </motion.section>

      <section className="inquiries-summary-grid">
        <motion.article
          className="inquiry-summary-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inquiry-summary-top">
            <span>Total Inquiries</span>

            <div className="inquiry-summary-icon total">
              <FaComments />
            </div>
          </div>

          <strong>{summary.total}</strong>
          <small>All recorded inquiries</small>
        </motion.article>

        <motion.article
          className="inquiry-summary-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="inquiry-summary-top">
            <span>Active Inquiries</span>

            <div className="inquiry-summary-icon active">
              <FaClock />
            </div>
          </div>

          <strong>{summary.active}</strong>
          <small>Negotiations in progress</small>
        </motion.article>

        <motion.article
          className="inquiry-summary-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inquiry-summary-top">
            <span>Resolved</span>

            <div className="inquiry-summary-icon closed">
              <FaCheckCircle />
            </div>
          </div>

          <strong>{summary.resolved}</strong>
          <small>Completed or resolved inquiries</small>
        </motion.article>

        <motion.article
          className="inquiry-summary-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="inquiry-summary-top">
            <span>Flagged</span>

            <div className="inquiry-summary-icon flagged">
              <FaFlag />
            </div>
          </div>

          <strong>{summary.flagged}</strong>
          <small>Require administrator attention</small>
        </motion.article>
      </section>

      <section className="inquiries-content-card">
        <div className="inquiries-toolbar">
          <div className="inquiries-tabs">
            {[
              {
                value: "ALL",
                label: "All Inquiries",
              },
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "RESOLVED",
                label: "Resolved",
              },
              {
                value: "CANCELLED",
                label: "Cancelled",
              },
              {
                value: "FLAGGED",
                label: "Flagged",
              },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={
                  activeTab === tab.value ? "active" : ""
                }
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inquiries-search">
            <FaSearch />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tenant, landlord or property"
            />
          </div>
        </div>

        <div className="inquiries-list">
          {filteredInquiries.map((inquiry, index) => (
            <motion.article
              key={inquiry.id}
              className={`inquiry-card ${
                inquiry.flagged ? "flagged-card" : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="inquiry-property">
                <img
                  src={inquiry.property.image}
                  alt={inquiry.property.title}
                />

                <div>
                  <div className="inquiry-reference-row">
                    <span className="inquiry-id">
                      {inquiry.id}
                    </span>

                    {inquiry.flagged && (
                      <span className="inquiry-flag-label">
                        <FaFlag />
                        Flagged
                      </span>
                    )}
                  </div>

                  <h3>{inquiry.property.title}</h3>

                  <p>
                    <FaMapMarkerAlt />
                    {inquiry.property.area},{" "}
                    {inquiry.property.city}
                  </p>
                </div>
              </div>

              <div className="inquiry-person">
                <span>Tenant</span>
                <strong>{inquiry.tenant.name}</strong>
                <small>{inquiry.tenant.email}</small>
              </div>

              <div className="inquiry-person">
                <span>Landlord</span>
                <strong>{inquiry.landlord.name}</strong>
                <small>{inquiry.landlord.email}</small>
              </div>

              <div className="inquiry-offer">
                <span>Tenant offer</span>

                <strong>
                  ₹
                  {inquiry.tenantOffer.toLocaleString("en-IN")}
                </strong>

                <small>
                  Listed: ₹
                  {inquiry.property.rent.toLocaleString(
                    "en-IN"
                  )}
                </small>
              </div>

              <div>
                <span
                  className={`inquiry-status ${inquiry.status.toLowerCase()}`}
                >
                  {inquiry.status}
                </span>
              </div>

              <button
                type="button"
                className="inquiry-view-button"
                onClick={() =>
                  setSelectedInquiryId(inquiry.id)
                }
              >
                <FaEye />
                View Details
              </button>
            </motion.article>
          ))}

          {filteredInquiries.length === 0 && (
            <div className="inquiries-empty">
              <FaComments />

              <h3>No inquiries found</h3>

              <p>
                Try changing the selected tab or search text.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedInquiry && (
        <div
          className="inquiry-modal-backdrop"
          onMouseDown={() =>
            setSelectedInquiryId(null)
          }
        >
          <div
            className="inquiry-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="inquiry-modal-close"
              onClick={() =>
                setSelectedInquiryId(null)
              }
              aria-label="Close inquiry details"
            >
              <FaTimes />
            </button>

            <div className="inquiry-modal-header">
              <img
                src={selectedInquiry.property.image}
                alt={selectedInquiry.property.title}
              />

              <div>
                <div className="inquiry-modal-reference">
                  <span>{selectedInquiry.id}</span>

                  {selectedInquiry.flagged && (
                    <span className="inquiry-flag-label">
                      <FaFlag />
                      Flagged
                    </span>
                  )}
                </div>

                <h2 id="inquiry-modal-title">
                  {selectedInquiry.property.title}
                </h2>

                <p>
                  <FaMapMarkerAlt />
                  {selectedInquiry.property.area},{" "}
                  {selectedInquiry.property.city}
                </p>
              </div>

              <span
                className={`inquiry-status ${selectedInquiry.status.toLowerCase()}`}
              >
                {selectedInquiry.status}
              </span>
            </div>

            <div className="inquiry-modal-body">
              {selectedInquiry.flagged && (
                <div className="inquiry-warning-banner">
                  <FaExclamationTriangle />

                  <div>
                    <strong>
                      This inquiry is flagged
                    </strong>

                    <span>
                      Review the negotiation history for
                      suspicious, abusive or policy-violating
                      activity.
                    </span>
                  </div>
                </div>
              )}

              <div className="inquiry-parties-grid">
                <div className="inquiry-profile-card">
                  <div className="inquiry-profile-icon tenant">
                    <FaUser />
                  </div>

                  <div>
                    <span>Tenant details</span>
                    <h3>{selectedInquiry.tenant.name}</h3>

                    <p>
                      <FaEnvelope />
                      {selectedInquiry.tenant.email}
                    </p>

                    <p>
                      <FaPhoneAlt />
                      {selectedInquiry.tenant.phone}
                    </p>
                  </div>
                </div>

                <div className="inquiry-profile-card">
                  <div className="inquiry-profile-icon landlord">
                    <FaBuilding />
                  </div>

                  <div>
                    <span>Landlord details</span>
                    <h3>
                      {selectedInquiry.landlord.name}
                    </h3>

                    <p>
                      <FaEnvelope />
                      {selectedInquiry.landlord.email}
                    </p>

                    <p>
                      <FaPhoneAlt />
                      {selectedInquiry.landlord.phone}
                    </p>
                  </div>
                </div>
              </div>

              <section className="inquiry-rent-comparison">
                <div>
                  <span>Listed rent</span>

                  <strong>
                    ₹
                    {selectedInquiry.property.rent.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Tenant offer</span>

                  <strong>
                    ₹
                    {selectedInquiry.tenantOffer.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Landlord offer</span>

                  <strong>
                    ₹
                    {selectedInquiry.landlordOffer.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>Final rent</span>

                  <strong>
                    {selectedInquiry.finalRent
                      ? `₹${selectedInquiry.finalRent.toLocaleString(
                          "en-IN"
                        )}`
                      : "Not finalized"}
                  </strong>
                </div>
              </section>

              <section className="inquiry-message-section">
                <h3>Initial inquiry message</h3>
                <p>{selectedInquiry.message}</p>
              </section>

              <section className="inquiry-negotiation-section">
                <h3>Negotiation history</h3>

                <div className="negotiation-timeline">
                  {selectedInquiry.negotiations.map(
                    (negotiation) => (
                      <div
                        key={negotiation.id}
                        className={`negotiation-message ${negotiation.sender.toLowerCase()}`}
                      >
                        <div>
                          <strong>
                            {negotiation.senderName}
                          </strong>

                          <span>
                            {negotiation.sender}
                          </span>
                        </div>

                        <p>{negotiation.message}</p>

                        <div className="negotiation-footer">
                          <strong>
                            ₹
                            {negotiation.amount.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <small>
                            {negotiation.time}
                          </small>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              {selectedInquiry.cancellationReason && (
                <section className="inquiry-cancellation-reason">
                  <h3>Cancellation reason</h3>
                  <p>
                    {selectedInquiry.cancellationReason}
                  </p>
                </section>
              )}

              {selectedInquiry.resolvedByAdmin && (
                <section className="inquiry-resolution-note">
                  <FaCheckCircle />

                  <div>
                    <strong>
                      Marked as resolved by Admin
                    </strong>

                    <span>
                      Resolved on{" "}
                      {selectedInquiry.resolvedOn}
                    </span>
                  </div>
                </section>
              )}

              <div className="inquiry-modal-actions">
                {selectedInquiry.status === "ACTIVE" && (
                  <button
                    type="button"
                    className="inquiry-resolve-action"
                    onClick={() =>
                      markAsResolved(selectedInquiry.id)
                    }
                  >
                    <FaCheckCircle />
                    Mark as Resolved
                  </button>
                )}

                <button
                  type="button"
                  className={
                    selectedInquiry.flagged
                      ? "inquiry-remove-flag-action"
                      : "inquiry-flag-action"
                  }
                  onClick={() =>
                    toggleFlagInquiry(selectedInquiry.id)
                  }
                >
                  <FaFlag />

                  {selectedInquiry.flagged
                    ? "Remove Flag"
                    : "Flag Inquiry"}
                </button>

                <button
                  type="button"
                  className="inquiry-dismiss-action"
                  onClick={() =>
                    setSelectedInquiryId(null)
                  }
                >
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

export default AdminRentInquiries;
