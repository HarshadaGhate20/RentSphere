import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const PGCard = ({ pg }) => {

  return (

    <div className="property-card">

      <img
        src={pg.image}
        alt={pg.title}
      />

      <div className="property-body">

        <h4>

          {pg.title}

        </h4>

        <p>

          <FaMapMarkerAlt />

          {" "}

          {pg.location}

        </p>

        <h5 className="text-success">

          ₹{pg.price}/month

        </h5>

        <Link
          to={`/property/${pg.id}`}
          className="btn btn-primary w-100 mt-3"
        >

          View Details

        </Link>

      </div>

    </div>

  );

};

export default PGCard;