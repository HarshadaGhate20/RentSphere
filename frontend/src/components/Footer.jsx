import React from "react";
import { Link } from "react-router-dom";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin
} from "react-icons/fa";

import "../assets/css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="container">

        <div className="row">

          <div className="col-md-4">

            <h3 className="text-white">
              RentSphere
            </h3>

            <p>
              Modern cloud-based property rental management platform for
              landlords and tenants.
            </p>

          </div>

          <div className="col-md-2">

            <h5>Company</h5>

            <Link to="/">Home</Link>

            <Link to="/about">About</Link>

            <Link to="/contact">Contact</Link>

          </div>

          <div className="col-md-3">

            <h5>Services</h5>

            <Link to="/properties">
              Properties
            </Link>

            <Link to="/properties">
              PG Listings
            </Link>

          </div>

          <div className="col-md-3">

            <h5>Follow Us</h5>

            <div className="social-icons">

              <FaFacebook />

              <FaInstagram />

              <FaTwitter />

              <FaLinkedin />

            </div>

          </div>

        </div>

        <hr />

        <p className="text-center mb-0">
          © 2026 RentSphere. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;