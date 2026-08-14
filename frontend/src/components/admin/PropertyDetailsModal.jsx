import React, { useState } from "react";
import {
  FaBath,
  FaBed,
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRulerCombined,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const PropertyDetailsModal = ({
  property,
  onClose,
  onApprove,
  onReject,
}) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!property) {
    return null;
  }

  return (
    <div className="property-modal-backdrop" onMouseDown={onClose}>
      <div
        className="property-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="property-modal-close"
          onClick={onClose}
          aria-label="Close property details"
        >
          <FaTimes />
        </button>

        <div className="property-modal-gallery">
          <img
            src={property.images[activeImage]}
            alt={property.title}
            className="property-modal-main-image"
          />

          <span
            className={`property-modal-status ${property.status.toLowerCase()}`}
          >
            {property.status}
          </span>

          {property.images.length > 1 && (
            <div className="property-modal-thumbnails">
              {property.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={activeImage === index ? "active" : ""}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${property.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="property-modal-content">
          <div className="property-modal-heading">
            <div>
              <span className="property-modal-type">{property.type}</span>

              <h2 id="property-modal-title">{property.title}</h2>

              <p>
                <FaMapMarkerAlt />
                {property.area}, {property.city}
              </p>
            </div>

            <div className="property-modal-price">
              ₹{property.rent.toLocaleString("en-IN")}
              <span>/month</span>
            </div>
          </div>

          <div className="property-modal-specifications">
            <div>
              <FaBed />
              <span>Bedrooms</span>
              <strong>{property.bedrooms}</strong>
            </div>

            <div>
              <FaBath />
              <span>Bathrooms</span>
              <strong>{property.bathrooms}</strong>
            </div>

            <div>
              <FaRulerCombined />
              <span>Area</span>
              <strong>{property.areaSqft} sqft</strong>
            </div>

            <div>
              <FaCheckCircle />
              <span>Deposit</span>
              <strong>₹{property.deposit.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <section className="property-modal-section">
            <h3>Description</h3>
            <p>{property.description}</p>
          </section>

          <section className="property-modal-section">
            <h3>Facilities and amenities</h3>

            <div className="property-modal-amenities">
              {property.amenities.map((amenity) => (
                <span key={amenity}>
                  <FaCheckCircle />
                  {amenity}
                </span>
              ))}
            </div>
          </section>

          <section className="property-modal-section">
            <h3>Landlord details</h3>

            <div className="property-modal-landlord">
              <div className="property-modal-avatar">
                <FaUser />
              </div>

              <div>
                <strong>{property.landlord}</strong>

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
          </section>

          <section className="property-modal-map">
            <FaMapMarkerAlt />
            <div>
              <strong>Property location</strong>
              <span>
                Map integration will display {property.area},{" "}
                {property.city}
              </span>
            </div>
          </section>

          {property.status === "PENDING" && (
            <div className="property-modal-actions">
              <button
                type="button"
                className="property-modal-approve"
                onClick={() => onApprove(property)}
              >
                Approve property
              </button>

              <button
                type="button"
                className="property-modal-reject"
                onClick={() => onReject(property)}
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

export default PropertyDetailsModal;