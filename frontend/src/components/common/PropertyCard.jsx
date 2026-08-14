import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaStar
} from "react-icons/fa";
import { motion } from "framer-motion";

const PropertyCard = ({ property }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="property-card"
    >
      <div className="property-image">

        <img
          src={property.image}
          alt={property.title}
        />

        {/* Wishlist Button */}
        <button className="wishlist-btn">
          <FaHeart />
        </button>

      </div>

      <div className="property-body">

        <div className="d-flex justify-content-between align-items-center">

          <span className="badge bg-primary">

            {property.type}

          </span>

          <span className="rating">

            <FaStar className="text-warning" />

            {" "}

            {property.rating}

          </span>

        </div>

        <h4 className="mt-3">

          {property.title}

        </h4>

        <p className="text-muted">

          <FaMapMarkerAlt />

          {" "}

          {property.city}

        </p>

        <h5 className="text-primary fw-bold">

          ₹{property.price.toLocaleString()}/month

        </h5>

        <Link
          to={`/property/${property.id}`}
          className="btn btn-primary w-100 mt-3"
        >
          View Details
        </Link>

      </div>

    </motion.div>
  );
};

export default PropertyCard;