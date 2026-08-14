import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaCloud,
  FaHandshake,
  FaHome,
  FaKey,
  FaShieldAlt,
  FaTools,
  FaUsers,
} from "react-icons/fa";

import "../assets/css/about.css";

const platformFeatures = [
  {
    icon: <FaBuilding />,
    title: "Property Management",
    description:
      "Landlords can add, update and manage rental properties from one dashboard.",
  },
  {
    icon: <FaHandshake />,
    title: "Rent Negotiation",
    description:
      "Tenants and landlords can negotiate monthly rent before confirming a booking.",
  },
  {
    icon: <FaKey />,
    title: "Booking and Lease",
    description:
      "The platform manages booking approval, payment, lease activation and receipts.",
  },
  {
    icon: <FaTools />,
    title: "Maintenance Tracking",
    description:
      "Tenants can submit maintenance requests and track landlord updates.",
  },
];

const values = [
  {
    icon: <FaShieldAlt />,
    title: "Security",
    description:
      "Secure authentication, role-based access and protected rental information.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Transparency",
    description:
      "Clear property, rent, booking, payment and maintenance information.",
  },
  {
    icon: <FaUsers />,
    title: "Convenience",
    description:
      "A connected experience for administrators, landlords and tenants.",
  },
  {
    icon: <FaCloud />,
    title: "Scalability",
    description:
      "A service-based architecture designed for modern cloud deployment.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const About = () => {
  return (
    <main className="about-page">
      {/* Header */}

      <section className="about-header">
        <div className="container">
          <motion.div
            className="about-header-content"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
            }}
          >
            <span className="about-eyebrow">
              About RentSphere
            </span>

            <h1>
              A smarter property rental
              management platform
            </h1>

            <p>
              RentSphere connects administrators,
              landlords and tenants through a
              secure and centralized rental
              management system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}

      <section className="about-introduction">
        <div className="container">
          <div className="about-introduction-grid">
            <motion.div
              className="about-introduction-image"
              initial={{
                opacity: 0,
                x: -35,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
                alt="Modern residential buildings"
              />

              <div className="about-image-label">
                <FaHome />

                <span>
                  <strong>
                    Complete rental solution
                  </strong>

                  Property to lease management
                </span>
              </div>
            </motion.div>

            <motion.div
              className="about-introduction-content"
              initial={{
                opacity: 0,
                x: 35,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
              }}
            >
              <span className="about-section-label">
                Our purpose
              </span>

              <h2>
                Simplifying every stage of the
                rental journey
              </h2>

              <p>
                Traditional rental processes often
                involve scattered communication,
                unclear payments and manual
                records. RentSphere brings these
                activities together in one
                organized platform.
              </p>

              <p>
                Users can discover properties,
                negotiate rent, submit bookings,
                complete payments, access lease
                information and manage maintenance
                requests.
              </p>

              <div className="about-checklist">
                <span>
                  <FaCheckCircle />
                  Verified property listings
                </span>

                <span>
                  <FaCheckCircle />
                  Transparent booking workflow
                </span>

                <span>
                  <FaCheckCircle />
                  Digital payment records
                </span>

                <span>
                  <FaCheckCircle />
                  Maintenance status tracking
                </span>
              </div>

              <Link
                to="/properties"
                className="about-explore-button"
              >
                Explore Properties
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics */}

      <section className="about-statistics">
        <div className="container">
          <motion.div
            className="about-statistics-grid"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
          >
            <article>
              <strong>2,500+</strong>
              <span>Properties</span>
            </article>

            <article>
              <strong>1,200+</strong>
              <span>Landlords</span>
            </article>

            <article>
              <strong>4,500+</strong>
              <span>Bookings</span>
            </article>

            <article>
              <strong>40+</strong>
              <span>Cities</span>
            </article>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision */}

      <section className="about-direction">
        <div className="container">
          <div className="about-direction-grid">
            <motion.article
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
              }}
            >
              <div className="about-direction-icon">
                <FaHome />
              </div>

              <span>Our Mission</span>

              <h3>
                Make rental management simple
              </h3>

              <p>
                To provide tenants and landlords
                with a secure, transparent and
                convenient way to manage rental
                activities.
              </p>
            </motion.article>

            <motion.article
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
                delay: 0.12,
              }}
            >
              <div className="about-direction-icon">
                <FaCloud />
              </div>

              <span>Our Vision</span>

              <h3>
                Build a connected rental ecosystem
              </h3>

              <p>
                To create a reliable and scalable
                digital platform that supports the
                complete property rental lifecycle.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="about-platform">
        <div className="container">
          <motion.div
            className="about-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
          >
            <span>
              Platform capabilities
            </span>

            <h2>
              One platform for complete rental
              management
            </h2>

            <p>
              RentSphere combines all important
              rental operations into a single
              organized system.
            </p>
          </motion.div>

          <div className="about-feature-grid">
            {platformFeatures.map(
              (feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <div>
                    {feature.icon}
                  </div>

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      {/* Values */}

      <section className="about-values">
        <div className="container">
          <motion.div
            className="about-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
          >
            <span>Our principles</span>

            <h2>
              Values that guide RentSphere
            </h2>
          </motion.div>

          <div className="about-values-grid">
            {values.map(
              (value, index) => (
                <motion.article
                  key={value.title}
                  initial={{
                    opacity: 0,
                    x:
                      index % 2 === 0
                        ? -20
                        : 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                  }}
                >
                  <div>
                    {value.icon}
                  </div>

                  <span>
                    <strong>
                      {value.title}
                    </strong>

                    <small>
                      {value.description}
                    </small>
                  </span>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      {/* Architecture */}

      <section className="about-architecture">
        <div className="container">
          <motion.div
            className="about-architecture-content"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
          >
            <div>
              <span>
                Built with modern technology
              </span>

              <h2>
                Secure, modular and ready for
                backend integration
              </h2>

              <p>
                RentSphere uses React.js for the
                frontend, ASP.NET Core for
                authentication, Spring Boot for
                rental management services, REST
                APIs and MySQL databases.
              </p>
            </div>

            <div className="about-architecture-flow">
              <span>React</span>
              <i />
              <span>.NET Auth</span>
              <i />
              <span>Spring Boot</span>
              <i />
              <span>MySQL</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple CTA */}

      <section className="about-cta">
        <div className="container">
          <motion.div
            className="about-cta-content"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
          >
            <div>
              <span>
                Begin your rental journey
              </span>

              <h2>
                Find a property that matches your
                needs
              </h2>
            </div>

            <Link to="/properties">
              Browse Properties
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;