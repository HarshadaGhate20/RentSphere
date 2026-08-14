import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRupeeSign,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser
} from "react-icons/fa";

const PropertyCard = ({
  property,
  onView,
  onApprove,
  onReject
}) => {
  const statusClass = property.status.toLowerCase();

  return (
    <motion.div
      className="admin-property-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
    >
      {/* Property Image */}

      <div className="property-image-wrapper">
        <img
          src={property.images[0]}
          alt={property.title}
          className="property-image"
        />

        <span
          className={`property-status ${statusClass}`}
        >
          {property.status}
        </span>
      </div>

      {/* Body */}

      <div className="property-card-body">

        <div className="property-type">
          {property.type}
        </div>

        <h3>{property.title}</h3>

        <p className="property-location">
          <FaMapMarkerAlt />
          {property.area}, {property.city}
        </p>

        <div className="property-price">
          <FaRupeeSign />
          {property.rent.toLocaleString("en-IN")}
          <span>/month</span>
        </div>

        <div className="property-features">

          <span>
            <FaBed />
            {property.bedrooms} Beds
          </span>

          <span>
            <FaBath />
            {property.bathrooms} Baths
          </span>

          <span>
            {property.areaSqft} sqft
          </span>

        </div>

        <div className="property-landlord">

          <FaUser />

          <div>
            <strong>
              {property.landlord}
            </strong>

            <span>
              Landlord
            </span>
          </div>

        </div>

        <div className="property-buttons">

          <button
            className="view-btn"
            onClick={() => onView(property)}
          >
            <FaEye />
            View
          </button>

          {property.status === "PENDING" && (
            <>
              <button
                className="approve-btn"
                onClick={() => onApprove(property)}
              >
                <FaCheck />
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => onReject(property)}
              >
                <FaTimes />
                Reject
              </button>
            </>
          )}

        </div>

      </div>

    </motion.div>
  );
};

export default PropertyCard;