import React, {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaHeadset,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaQuestionCircle,
  FaShieldAlt,
} from "react-icons/fa";

import {
  toast,
} from "react-toastify";

import "../assets/css/contact.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const faqs = [
  {
    question:
      "How quickly will I receive a response?",
    answer:
      "For this frontend version, the message is saved locally for demonstration. After backend integration, support requests can be handled through the database or email service.",
  },
  {
    question:
      "Can tenants contact landlords directly?",
    answer:
      "Property communication should happen through the booking and negotiation modules so every interaction remains connected to the rental record.",
  },
  {
    question:
      "Where can I report a maintenance issue?",
    answer:
      "Logged-in tenants can submit and track maintenance requests from the tenant maintenance page.",
  },
];

const Contact = () => {
  const [contact, setContact] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const changeHandler = (event) => {
    const {
      name,
      value,
    } = event.target;

    setContact(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setErrors(
      (current) => ({
        ...current,
        [name]: "",
      })
    );

    setIsSubmitted(false);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (
      !contact.name.trim()
    ) {
      nextErrors.name =
        "Please enter your name.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        contact.email
      )
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (
      contact.phone &&
      !/^[6-9]\d{9}$/.test(
        contact.phone
      )
    ) {
      nextErrors.phone =
        "Enter a valid 10-digit mobile number.";
    }

    if (
      !contact.subject
    ) {
      nextErrors.subject =
        "Please select a subject.";
    }

    if (
      contact.message.trim().length <
      10
    ) {
      nextErrors.message =
        "Message must contain at least 10 characters.";
    }

    setErrors(
      nextErrors
    );

    return (
      Object.keys(
        nextErrors
      ).length === 0
    );
  };

  const submitHandler = (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error(
        "Please correct the highlighted fields."
      );

      return;
    }

    const messages =
      JSON.parse(
        localStorage.getItem(
          "rentsphere_contact_messages"
        ) || "[]"
      );

    const newMessage = {
      id: `CONTACT-${Date.now()}`,
      ...contact,
      status: "NEW",
      createdOn:
        new Date().toLocaleString(
          "en-IN"
        ),
    };

    localStorage.setItem(
      "rentsphere_contact_messages",
      JSON.stringify([
        ...messages,
        newMessage,
      ])
    );

    setContact(
      initialForm
    );

    setErrors({});
    setIsSubmitted(true);

    toast.success(
      "Your message has been submitted successfully."
    );
  };

  return (
    <main className="contact-page">
      {/* Header */}

      <section className="contact-header">
        <div className="container">
          <motion.div
            className="contact-header-content"
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
            <span className="contact-eyebrow">
              Contact RentSphere
            </span>

            <h1>
              How can we help you?
            </h1>

            <p>
              Contact our support team for
              questions about properties,
              bookings, payments, leases,
              maintenance or your RentSphere
              account.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact summary */}

      <section className="contact-summary">
        <div className="container">
          <motion.div
            className="contact-summary-grid"
            initial={{
              opacity: 0,
              y: 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
          >
            <article>
              <div>
                <FaPhoneAlt />
              </div>

              <span>
                <small>
                  Call support
                </small>

                <strong>
                  +91 98765 43210
                </strong>

                <p>
                  Monday to Saturday
                </p>
              </span>
            </article>

            <article>
              <div>
                <FaEnvelope />
              </div>

              <span>
                <small>
                  Email support
                </small>

                <strong>
                  support@rentsphere.com
                </strong>

                <p>
                  Send your rental query
                </p>
              </span>
            </article>

            <article>
              <div>
                <FaMapMarkerAlt />
              </div>

              <span>
                <small>
                  Office location
                </small>

                <strong>
                  Navi Mumbai
                </strong>

                <p>
                  Maharashtra, India
                </p>
              </span>
            </article>
          </motion.div>
        </div>
      </section>

      {/* Main contact area */}

      <section className="contact-main-section">
        <div className="container">
          <div className="contact-main-layout">
            <motion.aside
              className="contact-information-card"
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
                amount: 0.25,
              }}
              transition={{
                duration: 0.65,
              }}
            >
              <span className="contact-section-label">
                Get in touch
              </span>

              <h2>
                We are here to support your
                rental journey
              </h2>

              <p>
                Share your question using the
                form. Our support workflow can
                later connect these messages to
                the backend and administrator
                portal.
              </p>

              <div className="contact-help-list">
                <article>
                  <FaShieldAlt />

                  <span>
                    <strong>
                      Account and security
                    </strong>

                    <small>
                      Login, profile and access
                      concerns
                    </small>
                  </span>
                </article>

                <article>
                  <FaHeadset />

                  <span>
                    <strong>
                      Booking assistance
                    </strong>

                    <small>
                      Negotiation, booking and
                      payment support
                    </small>
                  </span>
                </article>

                <article>
                  <FaQuestionCircle />

                  <span>
                    <strong>
                      Rental guidance
                    </strong>

                    <small>
                      Lease, maintenance and
                      property questions
                    </small>
                  </span>
                </article>
              </div>

              <div className="contact-office-hours">
                <FaClock />

                <div>
                  <span>
                    Support hours
                  </span>

                  <strong>
                    Monday–Saturday
                  </strong>

                  <small>
                    9:00 AM – 6:00 PM
                  </small>
                </div>
              </div>
            </motion.aside>

            <motion.section
              className="contact-form-card"
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
                amount: 0.25,
              }}
              transition={{
                duration: 0.65,
              }}
            >
              <div className="contact-form-heading">
                <div>
                  <span>
                    Send a message
                  </span>

                  <h2>
                    Tell us how we can help
                  </h2>

                  <p>
                    Complete the form below and
                    provide enough detail about
                    your question.
                  </p>
                </div>

                <div className="contact-form-icon">
                  <FaPaperPlane />
                </div>
              </div>

              {isSubmitted && (
                <div className="contact-success-message">
                  <FaCheckCircle />

                  <div>
                    <strong>
                      Message submitted
                    </strong>

                    <span>
                      Your request has been saved
                      successfully.
                    </span>
                  </div>
                </div>
              )}

              <form
                className="contact-form"
                onSubmit={
                  submitHandler
                }
                noValidate
              >
                <div className="contact-form-grid">
                  <label>
                    Full name *

                    <input
                      type="text"
                      name="name"
                      value={
                        contact.name
                      }
                      onChange={
                        changeHandler
                      }
                      placeholder="Enter your full name"
                    />

                    {errors.name && (
                      <small className="contact-error">
                        {errors.name}
                      </small>
                    )}
                  </label>

                  <label>
                    Email address *

                    <input
                      type="email"
                      name="email"
                      value={
                        contact.email
                      }
                      onChange={
                        changeHandler
                      }
                      placeholder="name@example.com"
                    />

                    {errors.email && (
                      <small className="contact-error">
                        {errors.email}
                      </small>
                    )}
                  </label>

                  <label>
                    Mobile number

                    <input
                      type="tel"
                      name="phone"
                      value={
                        contact.phone
                      }
                      onChange={
                        changeHandler
                      }
                      maxLength="10"
                      placeholder="9876543210"
                    />

                    {errors.phone && (
                      <small className="contact-error">
                        {errors.phone}
                      </small>
                    )}
                  </label>

                  <label>
                    Subject *

                    <select
                      name="subject"
                      value={
                        contact.subject
                      }
                      onChange={
                        changeHandler
                      }
                    >
                      <option value="">
                        Select a subject
                      </option>

                      <option value="PROPERTY">
                        Property inquiry
                      </option>

                      <option value="BOOKING">
                        Booking support
                      </option>

                      <option value="PAYMENT">
                        Payment support
                      </option>

                      <option value="LEASE">
                        Lease assistance
                      </option>

                      <option value="MAINTENANCE">
                        Maintenance question
                      </option>

                      <option value="ACCOUNT">
                        Account support
                      </option>

                      <option value="OTHER">
                        Other
                      </option>
                    </select>

                    {errors.subject && (
                      <small className="contact-error">
                        {
                          errors.subject
                        }
                      </small>
                    )}
                  </label>

                  <label className="contact-full-field">
                    Message *

                    <textarea
                      rows="6"
                      name="message"
                      value={
                        contact.message
                      }
                      onChange={
                        changeHandler
                      }
                      placeholder="Describe your question or issue"
                    />

                    <div className="contact-message-meta">
                      {errors.message ? (
                        <small className="contact-error">
                          {
                            errors.message
                          }
                        </small>
                      ) : (
                        <small>
                          Provide at least 10
                          characters
                        </small>
                      )}

                      <small>
                        {
                          contact.message
                            .length
                        }
                        /500
                      </small>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="contact-submit-button"
                >
                  <FaPaperPlane />
                  Send Message
                </button>

                <p className="contact-form-note">
                  This frontend version stores
                  the request in localStorage.
                  Backend integration will replace
                  this with a secure contact API.
                </p>
              </form>
            </motion.section>
          </div>
        </div>
      </section>

      {/* Location */}

      <section className="contact-location-section">
        <div className="container">
          <div className="contact-location-layout">
            <motion.div
              className="contact-location-content"
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
            >
              <span className="contact-section-label">
                Office location
              </span>

              <h2>
                RentSphere support office
              </h2>

              <p>
                Navi Mumbai, Maharashtra,
                India
              </p>

              <div>
                <FaMapMarkerAlt />

                <span>
                  <strong>
                    RentSphere
                  </strong>

                  <small>
                    Property Rental Management
                    Platform
                  </small>
                </span>
              </div>
            </motion.div>

            <motion.div
              className="contact-map-placeholder"
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
                delay: 0.1,
              }}
            >
              <div className="contact-map-grid" />

              <div className="contact-map-marker">
                <FaMapMarkerAlt />
              </div>

              <span>
                Navi Mumbai
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs */}

      <section className="contact-faq-section">
        <div className="container">
          <motion.div
            className="contact-section-heading"
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
          >
            <span>
              Quick answers
            </span>

            <h2>
              Before contacting support
            </h2>

            <p>
              These answers may help you find
              the right RentSphere module.
            </p>
          </motion.div>

          <div className="contact-faq-grid">
            {faqs.map(
              (item, index) => (
                <motion.article
                  key={
                    item.question
                  }
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
                    delay:
                      index * 0.08,
                  }}
                >
                  <span>
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3>
                    {item.question}
                  </h3>

                  <p>
                    {item.answer}
                  </p>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="contact-cta">
        <div className="container">
          <motion.div
            className="contact-cta-content"
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
          >
            <div>
              <span>
                Looking for a rental?
              </span>

              <h2>
                Explore verified properties
                available on RentSphere
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

export default Contact;