import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  toast,
} from "react-toastify";

import {
  FaCheckCircle,
  FaClock,
  FaExchangeAlt,
  FaEye,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

import {
  acceptNegotiation,
  counterNegotiation,
  getLandlordNegotiations,
  rejectNegotiation,
} from "../../services/negotiationApi";

import {
  getPropertyById,
} from "../../services/propertyApi";

import {
  getLandlordUser,
} from "../../utils/sessionUser";

import {
  resolvePropertyImage,
} from "../../config/api";

import "../../assets/css/landlordNegotiations.css";

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (
  amount
) =>
  `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

/*
 * Convert relative image path from
 * Property Service to full browser URL.
 */
const getResolvedImage = (
  property
) => {
  if (!property) {
    return "";
  }

  const firstImage =
    property.image ||
    property.images?.[0] ||
    property.photos?.[0]?.url ||
    property.photos?.[0]?.imageUrl ||
    property.propertyPhotos?.[0]?.url ||
    property.propertyPhotos?.[0]?.imageUrl ||
    "";

  if (!firstImage) {
    return "";
  }

  return resolvePropertyImage(
    firstImage
  );
};

/*
 * Normalize negotiation response.
 */
const normalizeNegotiation = (
  negotiation
) => {
  return {
    ...negotiation,

    id:
      negotiation.id ??
      negotiation.negotiationId,

    propertyId:
      negotiation.propertyId,

    propertyTitle:
      negotiation.propertyTitle ||
      negotiation.title ||
      `Property #${negotiation.propertyId}`,

    propertyImage:
      negotiation.propertyImage ||
      negotiation.image ||
      "",

    propertyArea:
      negotiation.propertyArea ||
      negotiation.area ||
      "",

    propertyCity:
      negotiation.propertyCity ||
      negotiation.city ||
      "",

    propertyCategory:
      negotiation.propertyCategory ||
      negotiation.category ||
      "",

    tenantName:
      negotiation.tenantName ||
      "RentSphere Tenant",

    tenantEmail:
      negotiation.tenantEmail ||
      "",

    listedRent:
      Number(
        negotiation.listedRent ??
          negotiation.monthlyRent ??
          0
      ),

    offeredRent:
      Number(
        negotiation.offeredRent ??
          negotiation.tenantProposedRent ??
          negotiation.proposedRent ??
          0
      ),

    counterOffer:
      negotiation.counterOffer ??
      negotiation.landlordCounterRent ??
      null,

    approvedRent:
      negotiation.approvedRent ??
      negotiation.agreedRent ??
      null,

    tenantMessage:
      negotiation.tenantMessage ||
      negotiation.message ||
      "",

    landlordMessage:
      negotiation.landlordMessage ||
      "",

    status: String(
      negotiation.status ||
        "PENDING"
    ).toUpperCase(),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const LandlordNegotiations = () => {
  const [
    negotiations,
    setNegotiations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [
    selectedNegotiationId,
    setSelectedNegotiationId,
  ] = useState(null);

  const [
    showCounterModal,
    setShowCounterModal,
  ] = useState(false);

  const [
    counterNegotiationId,
    setCounterNegotiationId,
  ] = useState(null);

  const [
    counterForm,
    setCounterForm,
  ] = useState({
    counterOffer: "",
    landlordMessage: "",
  });

  /* =========================================================
     LOAD NEGOTIATIONS + PROPERTY PHOTOS
  ========================================================= */

  const loadNegotiations =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const landlord =
            getLandlordUser();

          const landlordId =
            landlord.email ||
            landlord.id;

          if (!landlordId) {
            throw new Error(
              "Landlord ID was not found. Please login again."
            );
          }

          console.log(
            "LANDLORD USER:",
            landlord
          );

          console.log(
            "LANDLORD ID SENT TO API:",
            landlordId
          );

          /*
           * STEP 1:
           * Get negotiation records
           * from Booking Service :8082
           */
          const response =
            await getLandlordNegotiations(
              landlordId
            );

          console.log(
            "RAW NEGOTIATIONS:",
            response
          );

          const negotiationList =
            Array.isArray(
              response
            )
              ? response
              : Array.isArray(
                  response?.content
                )
              ? response.content
              : [];

          /*
           * STEP 2:
           * For every negotiation,
           * load complete property
           * from Property Service :8081
           */
          const enrichedNegotiations =
            await Promise.all(
              negotiationList.map(
                async (
                  rawNegotiation
                ) => {
                  const negotiation =
                    normalizeNegotiation(
                      rawNegotiation
                    );

                  if (
                    !negotiation.propertyId
                  ) {
                    return negotiation;
                  }

                  try {
                    const property =
                      await getPropertyById(
                        negotiation.propertyId
                      );

                    console.log(
                      `PROPERTY ${negotiation.propertyId}:`,
                      property
                    );

                    const image =
                      getResolvedImage(
                        property
                      );

                    console.log(
                      `PROPERTY ${negotiation.propertyId} IMAGE:`,
                      image
                    );

                    return {
                      ...negotiation,

                      propertyTitle:
                        property.title ||
                        negotiation.propertyTitle,

                      propertyImage:
                        image,

                      propertyArea:
                        property.area ||
                        negotiation.propertyArea,

                      propertyCity:
                        property.city ||
                        negotiation.propertyCity,

                      propertyCategory:
                        property.category ||
                        negotiation.propertyCategory,

                      propertyMonthlyRent:
                        Number(
                          property.monthlyRent ||
                            negotiation.listedRent ||
                            0
                        ),

                      bedrooms:
                        property.bedrooms ||
                        0,

                      bathrooms:
                        property.bathrooms ||
                        0,

                      areaSqft:
                        property.areaSqft ||
                        0,
                    };
                  } catch (
                    propertyError
                  ) {
                    console.error(
                      `Unable to load property ${negotiation.propertyId}:`,
                      propertyError
                    );

                    /*
                     * Do not break the whole
                     * negotiations page if one
                     * property fails.
                     */
                    return negotiation;
                  }
                }
              )
            );

          console.log(
            "ENRICHED NEGOTIATIONS:",
            enrichedNegotiations
          );

          setNegotiations(
            enrichedNegotiations
          );
        } catch (
          loadError
        ) {
          console.error(
            "LANDLORD NEGOTIATIONS ERROR:",
            loadError
          );

          setNegotiations(
            []
          );

          setError(
            loadError.message ||
              "Unable to load negotiations."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadNegotiations();
  }, [
    loadNegotiations,
  ]);

  /* =========================================================
     FILTERING
  ========================================================= */

  const filteredNegotiations =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return negotiations.filter(
        (
          negotiation
        ) => {
          const matchesSearch =
            !query ||
            [
              negotiation.id,
              negotiation.propertyTitle,
              negotiation.propertyArea,
              negotiation.propertyCity,
              negotiation.tenantName,
              negotiation.tenantEmail,
            ]
              .filter(Boolean)
              .some(
                (value) =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      query
                    )
              );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            negotiation.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      negotiations,
      search,
      statusFilter,
    ]);

  /* =========================================================
     SELECTED NEGOTIATION
  ========================================================= */

  const selectedNegotiation =
    useMemo(
      () =>
        negotiations.find(
          (
            negotiation
          ) =>
            String(
              negotiation.id
            ) ===
            String(
              selectedNegotiationId
            )
        ) ||
        null,
      [
        negotiations,
        selectedNegotiationId,
      ]
    );

  /* =========================================================
     SUMMARY
  ========================================================= */

  const summary =
    useMemo(
      () => ({
        total:
          negotiations.length,

        pending:
          negotiations.filter(
            (item) =>
              item.status ===
              "PENDING"
          ).length,

        countered:
          negotiations.filter(
            (item) =>
              item.status ===
              "COUNTERED"
          ).length,

        accepted:
          negotiations.filter(
            (item) =>
              [
                "ACCEPTED",
                "TENANT_ACCEPTED",
              ].includes(
                item.status
              )
          ).length,

        rejected:
          negotiations.filter(
            (item) =>
              [
                "REJECTED",
                "TENANT_REJECTED",
                "CANCELLED",
              ].includes(
                item.status
              )
          ).length,
      }),
      [
        negotiations,
      ]
    );

  /* =========================================================
     ACCEPT NEGOTIATION
  ========================================================= */

  const handleAccept =
    async (
      negotiation
    ) => {
      const confirmed =
        window.confirm(
          `Accept tenant offer of ${formatCurrency(
            negotiation.offeredRent
          )}/month?`
        );

      if (!confirmed) {
        return;
      }

      try {
        await acceptNegotiation(
          negotiation.id,
          "Your rent offer has been accepted."
        );

        toast.success(
          "Tenant rent offer accepted."
        );

        setSelectedNegotiationId(
          null
        );

        await loadNegotiations();
      } catch (
        actionError
      ) {
        console.error(
          "ACCEPT NEGOTIATION ERROR:",
          actionError
        );

        toast.error(
          actionError.message ||
            "Unable to accept negotiation."
        );
      }
    };

  /* =========================================================
     REJECT NEGOTIATION
  ========================================================= */

  const handleReject =
    async (
      negotiation
    ) => {
      const confirmed =
        window.confirm(
          "Reject this tenant rent offer?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await rejectNegotiation(
          negotiation.id,
          "The landlord has rejected this rent offer."
        );

        toast.success(
          "Negotiation rejected."
        );

        setSelectedNegotiationId(
          null
        );

        await loadNegotiations();
      } catch (
        actionError
      ) {
        console.error(
          "REJECT NEGOTIATION ERROR:",
          actionError
        );

        toast.error(
          actionError.message ||
            "Unable to reject negotiation."
        );
      }
    };

  /* =========================================================
     OPEN COUNTER OFFER
  ========================================================= */

  const openCounterModal = (
    negotiation
  ) => {
    setCounterNegotiationId(
      negotiation.id
    );

    setCounterForm({
      counterOffer:
        String(
          negotiation.counterOffer ||
            negotiation.listedRent ||
            ""
        ),

      landlordMessage:
        negotiation.landlordMessage ||
        "",
    });

    setShowCounterModal(
      true
    );
  };

  /* =========================================================
     CLOSE COUNTER OFFER
  ========================================================= */

  const closeCounterModal =
    () => {
      setShowCounterModal(
        false
      );

      setCounterNegotiationId(
        null
      );

      setCounterForm({
        counterOffer: "",
        landlordMessage: "",
      });
    };

  /* =========================================================
     COUNTER FORM CHANGE
  ========================================================= */

  const handleCounterChange =
    (
      event
    ) => {
      const {
        name,
        value,
      } =
        event.target;

      setCounterForm(
        (
          current
        ) => ({
          ...current,
          [name]:
            value,
        })
      );
    };

  /* =========================================================
     SUBMIT COUNTER OFFER
  ========================================================= */

  const submitCounterOffer =
    async (
      event
    ) => {
      event.preventDefault();

      const negotiation =
        negotiations.find(
          (item) =>
            String(
              item.id
            ) ===
            String(
              counterNegotiationId
            )
        );

      if (!negotiation) {
        toast.error(
          "Negotiation not found."
        );

        return;
      }

      const counterRent =
        Number(
          counterForm.counterOffer
        );

      if (
        !counterRent ||
        counterRent <= 0
      ) {
        toast.error(
          "Enter a valid counter offer."
        );

        return;
      }

      try {
        await counterNegotiation(
          negotiation.id,
          counterRent,
          counterForm.landlordMessage.trim()
        );

        toast.success(
          `Counter offer ${formatCurrency(
            counterRent
          )} sent successfully.`
        );

        closeCounterModal();

        setSelectedNegotiationId(
          null
        );

        await loadNegotiations();
      } catch (
        actionError
      ) {
        console.error(
          "COUNTER ERROR:",
          actionError
        );

        toast.error(
          actionError.message ||
            "Unable to send counter offer."
        );
      }
    };

  /* =========================================================
     STATUS ICON
  ========================================================= */

  const getStatusIcon = (
    status
  ) => {
    if (
      [
        "ACCEPTED",
        "TENANT_ACCEPTED",
      ].includes(
        status
      )
    ) {
      return (
        <FaCheckCircle />
      );
    }

    if (
      [
        "REJECTED",
        "TENANT_REJECTED",
        "CANCELLED",
      ].includes(
        status
      )
    ) {
      return (
        <FaTimesCircle />
      );
    }

    if (
      status ===
      "COUNTERED"
    ) {
      return (
        <FaExchangeAlt />
      );
    }

    return (
      <FaClock />
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="landlord-negotiations-page">

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p className="mt-3">
            Loading negotiations and
            property information...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="landlord-negotiations-page">

      {/* HEADER */}

      <section className="landlord-negotiations-header">

        <div>

          <span>
            RENT NEGOTIATION MANAGEMENT
          </span>

          <h1>
            Tenant rent offers
          </h1>

          <p>
            Review tenant rent
            proposals, accept offers,
            reject requests or send
            a counter-offer.
          </p>

        </div>

        <div className="landlord-negotiations-header-icon">
          <FaExchangeAlt />
        </div>

      </section>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">

          <strong>
            Unable to load negotiations.
          </strong>

          <div>
            {error}
          </div>

          <button
            type="button"
            className="btn btn-outline-danger mt-2"
            onClick={
              loadNegotiations
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* SUMMARY */}

      <section className="landlord-negotiations-summary-grid">

        <article>
          <span>
            Total negotiations
          </span>

          <strong>
            {summary.total}
          </strong>
        </article>

        <article>
          <span>
            Pending review
          </span>

          <strong>
            {summary.pending}
          </strong>
        </article>

        <article>
          <span>
            Countered
          </span>

          <strong>
            {summary.countered}
          </strong>
        </article>

        <article>
          <span>
            Accepted
          </span>

          <strong>
            {summary.accepted}
          </strong>
        </article>

        <article>
          <span>
            Rejected
          </span>

          <strong>
            {summary.rejected}
          </strong>
        </article>

      </section>

      {/* FILTER */}

      <section className="landlord-negotiations-content">

        <div className="landlord-negotiations-toolbar">

          <div className="landlord-negotiations-search">

            <FaSearch />

            <input
              type="search"
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search property, tenant, location or negotiation"
            />

          </div>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="COUNTERED">
              Countered
            </option>

            <option value="ACCEPTED">
              Accepted
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter(
                "ALL"
              );
            }}
          >
            Reset
          </button>

        </div>

        {/* HEADING */}

        <div className="landlord-negotiations-result-heading">

          <div>

            <span>
              NEGOTIATION RECORDS
            </span>

            <h2>
              All rent offers
            </h2>

          </div>

          <p>
            {
              filteredNegotiations.length
            }{" "}
            results found
          </p>

        </div>

        {/* CARDS */}

        {filteredNegotiations.length >
        0 ? (
          <div className="landlord-negotiations-grid">

            {filteredNegotiations.map(
              (
                negotiation
              ) => (
                <article
                  key={
                    negotiation.id
                  }
                  className="landlord-negotiation-card"
                >

                  {/* PROPERTY IMAGE */}

                  <div className="landlord-negotiation-property-image">

                    {negotiation.propertyImage ? (
                      <img
                        src={
                          negotiation.propertyImage
                        }
                        alt={
                          negotiation.propertyTitle
                        }
                        onError={(
                          event
                        ) => {
                          console.error(
                            "IMAGE FAILED:",
                            event.currentTarget.src
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="landlord-negotiation-image-placeholder">

                        <FaExchangeAlt />

                        <span>
                          Property image
                          unavailable
                        </span>

                      </div>
                    )}

                    <span
                      className={`landlord-negotiation-status ${negotiation.status.toLowerCase()}`}
                    >
                      {getStatusIcon(
                        negotiation.status
                      )}

                      {negotiation.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                  </div>

                  {/* BODY */}

                  <div className="landlord-negotiation-card-body">

                    <span>
                      Negotiation #
                      {
                        negotiation.id
                      }
                    </span>

                    <h3>
                      {
                        negotiation.propertyTitle
                      }
                    </h3>

                    <p className="landlord-negotiation-location">

                      <FaMapMarkerAlt />

                      {negotiation.propertyArea ||
                        "Location"}

                      {negotiation.propertyCity
                        ? `, ${negotiation.propertyCity}`
                        : ""}

                    </p>

                    <div className="landlord-negotiation-tenant">

                      <FaUser />

                      <span>
                        Tenant

                        <strong>
                          {
                            negotiation.tenantName
                          }
                        </strong>
                      </span>

                    </div>

                    <div className="landlord-negotiation-price-grid">

                      <div>
                        <span>
                          Listed rent
                        </span>

                        <strong>
                          {formatCurrency(
                            negotiation.listedRent
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Tenant offer
                        </span>

                        <strong>
                          {formatCurrency(
                            negotiation.offeredRent
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Counter-offer
                        </span>

                        <strong>
                          {negotiation.counterOffer
                            ? formatCurrency(
                                negotiation.counterOffer
                              )
                            : "Not sent"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Approved rent
                        </span>

                        <strong>
                          {negotiation.approvedRent
                            ? formatCurrency(
                                negotiation.approvedRent
                              )
                            : "Pending"}
                        </strong>
                      </div>

                    </div>

                    <div className="landlord-negotiation-actions">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedNegotiationId(
                            negotiation.id
                          )
                        }
                      >
                        <FaEye />

                        View Details
                      </button>

                      {negotiation.status ===
                        "PENDING" && (
                        <>

                          <button
                            type="button"
                            onClick={() =>
                              handleAccept(
                                negotiation
                              )
                            }
                          >
                            <FaCheckCircle />

                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openCounterModal(
                                negotiation
                              )
                            }
                          >
                            <FaExchangeAlt />

                            Counter
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleReject(
                                negotiation
                              )
                            }
                          >
                            <FaTimesCircle />

                            Reject
                          </button>

                        </>
                      )}

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        ) : (
          <div className="landlord-negotiations-empty">

            <FaExchangeAlt />

            <h3>
              No negotiations found
            </h3>

          </div>
        )}

      </section>

      {/* =====================================================
          DETAILS MODAL
      ====================================================== */}

      {selectedNegotiation && (
        <div
          className="landlord-negotiation-modal-backdrop"
          onMouseDown={() =>
            setSelectedNegotiationId(
              null
            )
          }
        >

          <div
            className="landlord-negotiation-modal"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="landlord-negotiation-modal-close"
              onClick={() =>
                setSelectedNegotiationId(
                  null
                )
              }
            >
              <FaTimes />
            </button>

            <div className="landlord-negotiation-modal-header">

              {selectedNegotiation.propertyImage ? (
                <img
                  src={
                    selectedNegotiation.propertyImage
                  }
                  alt={
                    selectedNegotiation.propertyTitle
                  }
                />
              ) : (
                <div className="landlord-negotiation-image-placeholder">
                  <FaExchangeAlt />
                </div>
              )}

              <div>

                <span>
                  Negotiation #
                  {
                    selectedNegotiation.id
                  }
                </span>

                <h2>
                  {
                    selectedNegotiation.propertyTitle
                  }
                </h2>

                <p>
                  <FaMapMarkerAlt />{" "}

                  {selectedNegotiation.propertyArea}

                  {selectedNegotiation.propertyCity
                    ? `, ${selectedNegotiation.propertyCity}`
                    : ""}
                </p>

              </div>

            </div>

            <div className="landlord-negotiation-modal-body">

              <section>

                <span>
                  Tenant
                </span>

                <p>
                  <strong>
                    {
                      selectedNegotiation.tenantName
                    }
                  </strong>
                </p>

              </section>

              <div className="landlord-negotiation-price-grid">

                <div>
                  <span>
                    Listed rent
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedNegotiation.listedRent
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Tenant offer
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedNegotiation.offeredRent
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Counter
                  </span>

                  <strong>
                    {selectedNegotiation.counterOffer
                      ? formatCurrency(
                          selectedNegotiation.counterOffer
                        )
                      : "Not sent"}
                  </strong>
                </div>

                <div>
                  <span>
                    Agreed rent
                  </span>

                  <strong>
                    {selectedNegotiation.approvedRent
                      ? formatCurrency(
                          selectedNegotiation.approvedRent
                        )
                      : "Pending"}
                  </strong>
                </div>

              </div>

              {selectedNegotiation.tenantMessage && (
                <section>

                  <span>
                    Tenant message
                  </span>

                  <p>
                    {
                      selectedNegotiation.tenantMessage
                    }
                  </p>

                </section>
              )}

              {selectedNegotiation.landlordMessage && (
                <section>

                  <span>
                    Landlord response
                  </span>

                  <p>
                    {
                      selectedNegotiation.landlordMessage
                    }
                  </p>

                </section>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          COUNTER MODAL
      ====================================================== */}

      {showCounterModal && (
        <div
          className="landlord-negotiation-modal-backdrop"
          onMouseDown={
            closeCounterModal
          }
        >

          <form
            className="landlord-counter-offer-modal"
            onSubmit={
              submitCounterOffer
            }
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="landlord-negotiation-modal-close"
              onClick={
                closeCounterModal
              }
            >
              <FaTimes />
            </button>

            <h2>
              Send Counter-Offer
            </h2>

            <label>
              Counter Monthly Rent

              <input
                type="number"
                name="counterOffer"
                value={
                  counterForm.counterOffer
                }
                onChange={
                  handleCounterChange
                }
                required
              />
            </label>

            <label>
              Message to Tenant

              <textarea
                name="landlordMessage"
                rows="5"
                value={
                  counterForm.landlordMessage
                }
                onChange={
                  handleCounterChange
                }
              />
            </label>

            <div className="landlord-counter-offer-actions">

              <button
                type="button"
                onClick={
                  closeCounterModal
                }
              >
                Cancel
              </button>

              <button
                type="submit"
              >
                Send Counter-Offer
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
};

export default LandlordNegotiations;