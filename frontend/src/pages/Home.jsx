import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaCity,
  FaHome,
  FaKey,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";

import "../assets/css/home.css";
import { getPublicProperties } from "../services/propertyApi";

const formatRent = (property) => {
  const category = String(property?.category || "").toUpperCase();
  const amount = category === "PG"
    ? property?.rentPerBed || property?.monthlyRent
    : category === "VILLA"
      ? property?.dailyRent || property?.monthlyRent
      : property?.monthlyRent || property?.dailyRent || property?.rentPerBed;
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const rentUnit = (property) => {
  const category = String(property?.category || "").toUpperCase();
  if (category === "PG") return "/bed/month";
  if (category === "VILLA") return "/day";
  return "/month";
};

const propertyLocation = (property) =>
  [property?.area, property?.city].filter(Boolean).join(", ") || "Location not provided";

const testimonials = [
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    role: "Tenant",
    review:
      "RentSphere helped me find a verified rental apartment within two days. The complete process was simple and transparent.",
  },
  {
    name: "Priya Patel",
    city: "Pune",
    role: "Tenant",
    review:
      "I could explore properties, negotiate rent and complete my booking from one platform. It saved a lot of time.",
  },
  {
    name: "Aman Gupta",
    city: "Bengaluru",
    role: "Landlord",
    review:
      "Managing properties, tenant requests and maintenance updates is much easier through RentSphere.",
  },
];

const faqItems = [
  {
    id: "one",
    question: "How do I book a property?",
    answer:
      "Explore available properties, open the property details, negotiate the rent if required and submit your booking request.",
  },
  {
    id: "two",
    question: "Are landlords and properties verified?",
    answer:
      "RentSphere is designed to support administrator verification of landlords and property listings before they become available.",
  },
  {
    id: "three",
    question: "Can I negotiate the monthly rent?",
    answer:
      "Yes. Tenants can submit a rent offer, and landlords can accept it, reject it or send a counteroffer.",
  },
  {
    id: "four",
    question: "Can I track payments and maintenance requests?",
    answer:
      "Yes. Tenants and landlords receive dedicated dashboards for bookings, payments, leases and maintenance requests.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const Home = () => {
  const navigate = useNavigate();

  const [searchCity, setSearchCity] =
    useState("");
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProperties = async () => {
      try {
        const result = await getPublicProperties();
        if (active) {
          setProperties(result);
          setPropertiesError("");
        }
      } catch (error) {
        if (active) {
          setProperties([]);
          setPropertiesError(error?.message || "Unable to load properties.");
        }
      } finally {
        if (active) setPropertiesLoading(false);
      }
    };

    loadProperties();
    return () => { active = false; };
  }, []);

  const featuredProperties = useMemo(
    () => properties.filter((property) => String(property.category || "").toUpperCase() !== "PG").slice(0, 6),
    [properties]
  );

  const featuredPgs = useMemo(
    () => properties.filter((property) => String(property.category || "").toUpperCase() === "PG").slice(0, 3),
    [properties]
  );

  const heroProperty = properties[0] || null;
  const cityCount = useMemo(
    () => new Set(properties.map((property) => property.city).filter(Boolean)).size,
    [properties]
  );
  const landlordCount = useMemo(
    () => new Set(properties.map((property) => property.landlordId || property.landlordEmail).filter(Boolean)).size,
    [properties]
  );
  const availableCount = properties.filter(
    (property) => String(property.rentalStatus || "AVAILABLE").toUpperCase() === "AVAILABLE"
  ).length;

  const duplicatedProperties =
    useMemo(
      () => featuredProperties.length > 1
        ? [...featuredProperties, ...featuredProperties]
        : featuredProperties,
      [featuredProperties]
    );

  const handleSearch = (event) => {
    event.preventDefault();

    const city =
      searchCity.trim();

    if (city) {
      navigate(
        `/properties?city=${encodeURIComponent(
          city
        )}`
      );

      return;
    }

    navigate("/properties");
  };

  return (
    <main className="home-page">
      {/* =====================================================
          Hero
      ====================================================== */}

      <section className="home-hero">
        <div className="home-hero-background">
          <motion.div
            className="home-floating-shape shape-one"
            animate={{
              y: [0, -28, 0],
              x: [0, 18, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="home-floating-shape shape-two"
            animate={{
              y: [0, 34, 0],
              x: [0, -18, 0],
              rotate: [0, -12, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="home-floating-shape shape-three"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="home-hero-grid-pattern" />
        </div>

        <div className="container home-hero-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <motion.div
                className="home-hero-content"
                initial={{
                  opacity: 0,
                  x: -60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.8,
                }}
              >
                <motion.div
                  className="home-hero-badge"
                  initial={{
                    opacity: 0,
                    y: -15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3,
                  }}
                >
                  <FaShieldAlt />

                  <span>
                    Verified rental
                    marketplace
                  </span>
                </motion.div>

                <h1>
                  Find a place that
                  feels like{" "}
                  <span>home.</span>
                </h1>

                <p className="home-hero-description">
                  Discover verified
                  apartments, villas,
                  houses and PGs. Negotiate
                  rent, book securely and
                  manage your complete
                  rental journey through
                  RentSphere.
                </p>

                <form
                  className="home-hero-search"
                  onSubmit={handleSearch}
                >
                  <div className="home-search-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <input
                    type="text"
                    value={searchCity}
                    onChange={(event) =>
                      setSearchCity(
                        event.target.value
                      )
                    }
                    placeholder="Search by city or locality"
                    aria-label="Search properties by city"
                  />

                  <button type="submit">
                    <FaSearch />

                    <span>Search</span>
                  </button>
                </form>

                <div className="home-hero-actions">
                  <Link
                    className="home-primary-button"
                    to="/properties"
                  >
                    Explore Properties

                    <FaArrowRight />
                  </Link>

                  <Link
                    className="home-secondary-button"
                    to="/register"
                  >
                    List Your Property
                  </Link>
                </div>

                <div className="home-hero-trust">
                  <div>
                    <span className="home-trust-avatars">
                      <i>R</i>
                      <i>P</i>
                      <i>A</i>
                      <i>S</i>
                    </span>

                    <span>
                      <strong>4,500+</strong>
                      happy renters
                    </span>
                  </div>

                  <div>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />

                    <span>4.9 rating</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-6">
              <motion.div
                className="home-hero-visual"
                initial={{
                  opacity: 0,
                  x: 60,
                  scale: 0.92,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                }}
              >
                <motion.div
                  className="home-hero-main-image"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="/rentsphere-pg-hero.png"
                    alt="Modern RentSphere PG accommodation"
                  />

                  <div className="home-image-overlay" />

                  <div className="home-image-content">
                    <span>
                      Featured residence
                    </span>

                    <h3>
                      {heroProperty?.title || "Properties coming soon"}
                    </h3>

                    <p>
                      <FaMapMarkerAlt />
                      {heroProperty ? propertyLocation(heroProperty) : "Explore RentSphere"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="home-floating-card home-price-card"
                  animate={{
                    y: [0, -14, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div>
                    <FaKey />
                  </div>

                  <span>
                    Starting from

                    <strong>
                      {heroProperty ? `${formatRent(heroProperty)}${rentUnit(heroProperty)}` : "View current listings"}
                    </strong>
                  </span>
                </motion.div>

                <motion.div
                  className="home-floating-card home-verified-card"
                  animate={{
                    y: [0, 14, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaCheckCircle />

                  <span>
                    <strong>
                      Verified listings
                    </strong>

                    Safe and transparent
                  </span>
                </motion.div>

                <motion.div
                  className="home-mini-property-card"
                  animate={{
                    x: [0, 8, 0],
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={properties[1]?.image || heroProperty?.image || "/logo512.png"}
                    alt={properties[1]?.title || heroProperty?.title || "RentSphere property"}
                  />

                  <div>
                    <span>
                      New listing
                    </span>

                    <strong>
                      {properties[1]?.title || heroProperty?.title || "Browse properties"}
                    </strong>

                    <small>
                      {properties[1]?.city || heroProperty?.city || "RentSphere"}
                    </small>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="home-scroll-indicator">
          <span>Scroll to explore</span>

          <motion.i
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </div>
      </section>

      {/* =====================================================
          Statistics
      ====================================================== */}

      <section className="home-stats-section">
        <div className="container">
          <motion.div
            className="home-stats-grid"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <article>
              <div className="home-stat-icon">
                <FaBuilding />
              </div>

              <div>
                <strong>{propertiesLoading ? "…" : properties.length}</strong>
                <span>Live properties</span>
              </div>
            </article>

            <article>
              <div className="home-stat-icon">
                <FaUsers />
              </div>

              <div>
                <strong>{propertiesLoading ? "…" : landlordCount}</strong>
                <span>Listed landlords</span>
              </div>
            </article>

            <article>
              <div className="home-stat-icon">
                <FaHome />
              </div>

              <div>
                <strong>{propertiesLoading ? "…" : availableCount}</strong>
                <span>Available properties</span>
              </div>
            </article>

            <article>
              <div className="home-stat-icon">
                <FaCity />
              </div>

              <div>
                <strong>{propertiesLoading ? "…" : cityCount}</strong>
                <span>Cities covered</span>
              </div>
            </article>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          Moving Property Slider
      ====================================================== */}

      <section className="home-properties-section">
        <div className="container">
          <motion.div
            className="home-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <div>
              <span>
                Handpicked for you
              </span>

              <h2>
                Featured rental
                properties
              </h2>

              <p>
                Explore verified homes in
                popular cities with
                transparent rent and
                complete property details.
              </p>
            </div>

            <Link to="/properties">
              View all properties

              <FaArrowRight />
            </Link>
          </motion.div>
        </div>

        {propertiesLoading && (
          <div className="container"><p>Loading current properties…</p></div>
        )}
        {!propertiesLoading && propertiesError && (
          <div className="container"><p role="alert">{propertiesError}</p></div>
        )}
        {!propertiesLoading && !propertiesError && featuredProperties.length === 0 && (
          <div className="container"><p>No approved rental properties are currently available.</p></div>
        )}

        <div className="home-property-slider">
          <motion.div
            className="home-property-track"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {duplicatedProperties.map(
              (property, index) => (
                <article
                  className="home-property-card"
                  key={`${property.id}-${index}`}
                >
                  <div className="home-property-image">
                    <img
                      src={property.image || "/logo512.png"}
                      alt={property.title}
                    />

                    <span>
                      {property.category || "Property"}
                    </span>

                    <div className="home-property-image-overlay" />
                  </div>

                  <div className="home-property-body">
                    <span className="home-property-location">
                      <FaMapMarkerAlt />
                      {propertyLocation(property)}
                    </span>

                    <h3>
                      {property.title}
                    </h3>

                    <div className="home-property-meta">
                      <span>
                        {property.bedrooms ? `${property.bedrooms} Bed` : property.category || "Rental"}
                      </span>

                      <span>
                        Verified
                      </span>
                    </div>

                    <div className="home-property-footer">
                      <div>
                        <strong>
                          {formatRent(property)}
                        </strong>

                        <span>{rentUnit(property)}</span>
                      </div>

                      <Link
                        to={`/property/${property.id}`}
                        aria-label={`View ${property.title}`}
                      >
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          How it works
      ====================================================== */}

      <section className="home-process-section">
        <div className="container">
          <motion.div
            className="home-centered-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <span>
              Simple rental journey
            </span>

            <h2>
              Find and rent your home
              in four easy steps
            </h2>
          </motion.div>

          <div className="home-process-grid">
            {[
              {
                number: "01",
                icon: <FaSearch />,
                title: "Explore",
                text:
                  "Search properties by city, locality and rental preference.",
              },
              {
                number: "02",
                icon: <FaBuilding />,
                title: "Compare",
                text:
                  "Review property details, rent, facilities and availability.",
              },
              {
                number: "03",
                icon: <FaUsers />,
                title: "Negotiate",
                text:
                  "Send your rent offer and communicate with the landlord.",
              },
              {
                number: "04",
                icon: <FaKey />,
                title: "Move in",
                text:
                  "Complete your booking, payment and rental agreement.",
              },
            ].map((item, index) => (
              <motion.article
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 35,
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
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -10,
                }}
              >
                <span className="home-process-number">
                  {item.number}
                </span>

                <div className="home-process-icon">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          Featured PG
      ====================================================== */}

      <section className="home-pg-section">
        <div className="container">
          <motion.div
            className="home-section-heading"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <div>
              <span>
                Affordable shared living
              </span>

              <h2>Featured PGs</h2>

              <p>
                Comfortable PG
                accommodation for students
                and working professionals.
              </p>
            </div>

            <Link to="/properties">
              Explore PGs
              <FaArrowRight />
            </Link>
          </motion.div>

          <div className="home-pg-grid">
            {!propertiesLoading && !propertiesError && featuredPgs.length === 0 && (
              <p>No approved PG listings are currently available.</p>
            )}
            {featuredPgs.map(
              (property, index) => (
                <motion.article
                  className="home-pg-card"
                  key={property.id}
                  initial={{
                    opacity: 0,
                    y: 35,
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
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                >
                  <div>
                    <img
                      src={property.image || "/logo512.png"}
                      alt={property.title}
                    />

                    <span>
                      Popular PG
                    </span>
                  </div>

                  <section>
                    <p>
                      <FaMapMarkerAlt />
                      {propertyLocation(property)}
                    </p>

                    <h3>
                      {property.title}
                    </h3>

                    <small>
                      {property.sharingType || property.occupancyType || "PG accommodation"}
                    </small>

                    <div>
                      <strong>
                        {formatRent(property)}
                      </strong>

                      <span>{rentUnit(property)}</span>
                    </div>

                    <Link to={`/property/${property.id}`}>
                      View Details
                      <FaArrowRight />
                    </Link>
                  </section>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          Testimonials
      ====================================================== */}

      <section className="home-testimonials-section">
        <div className="home-testimonial-background-text">
          RentSphere
        </div>

        <div className="container">
          <motion.div
            className="home-centered-heading light"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <span>
              Trusted by renters and
              landlords
            </span>

            <h2>
              Experiences shared by our
              users
            </h2>
          </motion.div>

          <div className="home-testimonial-grid">
            {testimonials.map(
              (item, index) => (
                <motion.article
                  className="home-testimonial-card"
                  key={item.name}
                  initial={{
                    opacity: 0,
                    y: 35,
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
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -10,
                    rotate: index === 1 ? 0 : index === 0 ? -1 : 1,
                  }}
                >
                  <FaQuoteLeft className="home-quote-icon" />

                  <div className="home-testimonial-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>

                  <p>
                    “{item.review}”
                  </p>

                  <div className="home-testimonial-user">
                    <div>
                      {item.name
                        .split(" ")
                        .map((word) =>
                          word.charAt(0)
                        )
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <span>
                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        {item.role} •{" "}
                        {item.city}
                      </small>
                    </span>
                  </div>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <section className="home-faq-section">
        <div className="container">
          <div className="home-faq-layout">
            <motion.div
              className="home-faq-introduction"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.25,
              }}
            >
              <span>
                Have questions?
              </span>

              <h2>
                Frequently asked
                questions
              </h2>

              <p>
                Learn more about property
                booking, landlord
                verification, rent
                negotiation and rental
                management.
              </p>

              <Link to="/contact">
                Contact Support
                <FaArrowRight />
              </Link>
            </motion.div>

            <motion.div
              className="accordion home-faq-accordion"
              id="homeFaq"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
            >
              {faqItems.map(
                (item, index) => (
                  <div
                    className="accordion-item"
                    key={item.id}
                  >
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${
                          index === 0
                            ? ""
                            : "collapsed"
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${item.id}`}
                        aria-expanded={
                          index === 0
                        }
                        aria-controls={
                          item.id
                        }
                      >
                        <span>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        {item.question}
                      </button>
                    </h2>

                    <div
                      id={item.id}
                      className={`accordion-collapse collapse ${
                        index === 0
                          ? "show"
                          : ""
                      }`}
                      data-bs-parent="#homeFaq"
                    >
                      <div className="accordion-body">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="home-cta-section">
        <motion.div
          className="home-cta-orb orb-one"
          animate={{
            x: [0, 45, 0],
            y: [0, -35, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="home-cta-orb orb-two"
          animate={{
            x: [0, -35, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container">
          <motion.div
            className="home-cta-content"
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.65,
            }}
          >
            <span>
              Your next home is waiting
            </span>

            <h2>
              Ready to find your dream
              rental?
            </h2>

            <p>
              Browse verified properties,
              negotiate your rent and
              manage your complete rental
              journey with RentSphere.
            </p>

            <div>
              <Link
                to="/properties"
                className="home-cta-primary"
              >
                Explore Properties
                <FaArrowRight />
              </Link>

              <Link
                to="/register"
                className="home-cta-secondary"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
