import React from "react";
import {
  FaBath,
  FaBed,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const PropertyReviewModal = ({
  property,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!property) {
    return null;
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-review-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="admin-modal-close"
          onClick={onClose}
          aria-label="Close property details"
        >
          <FaTimes />
        </button>

        <div className="admin-modal-image-wrapper">
          <img
            src={property.image}
            alt={property.title}
            className="admin-modal-image"
          />

          <span
            className={`admin-status modal-status status-${property.status.toLowerCase()}`}
          >
            {property.status}
          </span>
        </div>

        <div className="admin-modal-content">
          <span className="admin-eyebrow">
            Property #{property.id}
          </span>

          <h2 id="property-review-title">{property.title}</h2>

          <p className="admin-property-location">
            <FaMapMarkerAlt />
            {property.area}, {property.city}
          </p>

          <p className="admin-property-description">
            {property.description}
          </p>

          <div className="admin-detail-grid">
            <div>
              <span>Listing</span>
              <strong>{property.listingType}</strong>
            </div>

            <div>
              <span>Property type</span>
              <strong>{property.type}</strong>
            </div>

            <div>
              <span>Monthly rent</span>
              <strong>
                ₹{property.monthlyRent.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Deposit</span>
              <strong>₹{property.deposit.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>
                <FaBed /> Bedrooms
              </span>
              <strong>{property.bedrooms}</strong>
            </div>

            <div>
              <span>
                <FaBath /> Bathrooms
              </span>
              <strong>{property.bathrooms}</strong>
            </div>
          </div>

          <div className="admin-landlord-card">
            <div className="admin-landlord-avatar">
              <FaUser />
            </div>

            <div>
              <span className="admin-card-label">Landlord details</span>
              <h4>{property.landlordName}</h4>

              <p>
                <FaEnvelope />
                {property.landlordEmail}
              </p>

              <p>
                <FaPhoneAlt />
                {property.landlordPhone}
              </p>
            </div>
          </div>

          {property.status === "PENDING" && (
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-approve-button"
                onClick={() => onApprove(property.id)}
              >
                Approve property
              </button>

              <button
                type="button"
                className="admin-reject-button"
                onClick={() => onReject(property.id)}
              >
                Reject property
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyReviewModal;