import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaBath,
  FaBed,
  FaBuilding,
  FaEye,
  FaMapMarkerAlt,
  FaPen,
  FaRulerCombined,
  FaSearch,
} from "react-icons/fa";

import {
  toast,
} from "react-toastify";

import {
  getLandlordProperties,
} from "../../services/propertyApi";

import {
  getLandlordUser,
} from "../../utils/sessionUser";

/* =========================================================
   CURRENCY
========================================================= */

const formatCurrency = (
  amount
) => {
  const value =
    Number(
      amount || 0
    );

  return `₹${value.toLocaleString(
    "en-IN"
  )}`;
};

/* =========================================================
   CATEGORY
========================================================= */

const normalizeCategory = (
  category
) =>
  String(
    category || ""
  )
    .trim()
    .toUpperCase();

/* =========================================================
   PRICE DISPLAY
========================================================= */

const getPriceDetails = (
  property
) => {
  const category =
    normalizeCategory(
      property.category
    );

  const pricingType =
    String(
      property.pricingType ||
        ""
    )
      .trim()
      .toUpperCase();

  /*
   * PG
   */
  if (
    category === "PG" ||
    pricingType ===
      "PER_BED_MONTHLY"
  ) {
    return {
      amount:
        property.rentPerBed ||
        0,

      suffix:
        "/bed/month",

      label:
        "Rent per bed",
    };
  }

  /*
   * Villa
   */
  if (
    category ===
      "VILLA" ||
    pricingType ===
      "DAILY"
  ) {
    return {
      amount:
        property.dailyRent ||
        0,

      suffix:
        "/day",

      label:
        "Daily rent",
    };
  }

  /*
   * Apartment / house
   */
  return {
    amount:
      property.monthlyRent ||
      0,

    suffix:
      "/month",

    label:
      "Monthly rent",
  };
};

/* =========================================================
   STATUS BADGE
========================================================= */

const getApprovalBadgeClass = (
  status
) => {
  switch (
    String(
      status || ""
    ).toUpperCase()
  ) {
    case "APPROVED":
      return "bg-success";

    case "REJECTED":
      return "bg-danger";

    default:
      return "bg-warning text-dark";
  }
};

/* =========================================================
   MY PROPERTIES
========================================================= */

const MyProperties = () => {
  const navigate =
    useNavigate();

  const [
    properties,
    setProperties,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    const loadProperties =
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const landlord =
            getLandlordUser();

          const landlordId =
            landlord?.id ||
            landlord?.email;

          if (!landlordId) {
            throw new Error(
              "Landlord session not found."
            );
          }

          const data =
            await getLandlordProperties(
              landlordId
            );

          console.log(
            "LANDLORD PROPERTIES:",
            data
          );

          setProperties(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          loadError
        ) {
          console.error(
            "LANDLORD PROPERTY ERROR:",
            loadError
          );

          setError(
            loadError.message ||
              "Unable to load properties."
          );

          toast.error(
            loadError.message ||
              "Unable to load properties."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadProperties();
  }, []);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredProperties =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        if (!term) {
          return properties;
        }

        return properties.filter(
          (property) =>
            [
              property.title,
              property.category,
              property.area,
              property.city,
              property.state,
              property.id,
            ]
              .filter(
                Boolean
              )
              .some(
                (value) =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      term
                    )
              )
        );
      },
      [
        properties,
        search,
      ]
    );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading properties...
        </p>

      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-4">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-4">

        <small className="text-primary fw-bold">
          PROPERTY LISTINGS
        </small>

        <h1 className="fw-bold mb-1">
          My Property Portfolio
        </h1>

        <p className="text-muted">
          View and manage all
          properties added by you.
        </p>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="input-group mb-4">

        <span className="input-group-text bg-white">
          <FaSearch />
        </span>

        <input
          type="text"
          className="form-control"
          placeholder="Search property..."
          value={
            search
          }
          onChange={(
            event
          ) =>
            setSearch(
              event.target
                .value
            )
          }
        />

      </div>

      {/* =====================================================
          COUNT
      ===================================================== */}

      <div className="d-flex align-items-center gap-2 mb-3">

        <FaBuilding />

        <strong>
          {
            filteredProperties.length
          }{" "}
          {filteredProperties.length ===
          1
            ? "property"
            : "properties"}
        </strong>

      </div>

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {filteredProperties.length ===
      0 ? (
        <div className="card border-0 shadow-sm p-5 text-center">

          <FaBuilding
            size={45}
            className="text-primary mb-3 mx-auto"
          />

          <h3>
            No properties found
          </h3>

          <p className="text-muted">
            Add your first
            property to RentSphere.
          </p>

          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  "/landlord/add-property"
                )
              }
            >
              Add Property
            </button>
          </div>

        </div>
      ) : (
        <div className="row g-4">

          {filteredProperties.map(
            (property) => {
              const price =
                getPriceDetails(
                  property
                );

              const category =
                normalizeCategory(
                  property.category
                );

              const isPG =
                category ===
                  "PG" ||
                property.pricingType ===
                  "PER_BED_MONTHLY";

              const isVilla =
                category ===
                  "VILLA" ||
                property.pricingType ===
                  "DAILY";

              return (
                <div
                  className="col-xl-4 col-lg-6"
                  key={
                    property.id
                  }
                >

                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                    {/* =======================================
                        IMAGE
                    ======================================= */}

                    <div
                      className="position-relative bg-light"
                      style={{
                        minHeight:
                          "230px",
                      }}
                    >

                      {property.image ? (
                        <img
                          src={
                            property.image
                          }
                          alt={
                            property.title
                          }
                          className="w-100"
                          style={{
                            height:
                              "230px",

                            objectFit:
                              "cover",
                          }}
                          onError={(
                            event
                          ) => {
                            console.error(
                              "IMAGE FAILED:",
                              property.image
                            );

                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex flex-column justify-content-center align-items-center text-muted"
                          style={{
                            height:
                              "230px",
                          }}
                        >
                          <FaBuilding
                            size={
                              45
                            }
                          />

                          <span className="mt-2">
                            No image
                          </span>
                        </div>
                      )}

                      {/* CATEGORY */}

                      <span className="badge bg-light text-primary position-absolute bottom-0 start-0 m-3">

                        {property.category ||
                          "Property"}

                      </span>

                      {/* APPROVAL */}

                      <span
                        className={`badge position-absolute top-0 end-0 m-3 ${getApprovalBadgeClass(
                          property.approvalStatus
                        )}`}
                      >
                        {property.approvalStatus ||
                          "PENDING"}
                      </span>

                    </div>

                    {/* =======================================
                        BODY
                    ======================================= */}

                    <div className="card-body p-4">

                      <small className="text-primary fw-bold">
                        PROPERTY #
                        {
                          property.id
                        }
                      </small>

                      <h4 className="fw-bold mt-2">

                        {
                          property.title
                        }

                      </h4>

                      <p className="text-muted">

                        <FaMapMarkerAlt className="me-2" />

                        {property.area ||
                          "Location"}

                        {property.city
                          ? `, ${property.city}`
                          : ""}

                      </p>

                      {/* =====================================
                          PRICE
                      ===================================== */}

                      <div className="mb-3">

                        <span className="fs-3 fw-bold text-primary">

                          {formatCurrency(
                            price.amount
                          )}

                        </span>

                        <span className="text-muted">

                          {
                            price.suffix
                          }

                        </span>

                      </div>

                      {/* =====================================
                          NORMAL / VILLA
                      ===================================== */}

                      {!isPG && (
                        <div className="row bg-light rounded-3 py-3 mb-3 text-center">

                          <div className="col-4">

                            <FaBed className="me-1" />

                            {property.bedrooms ||
                              0}{" "}
                            Bed

                          </div>

                          <div className="col-4">

                            <FaBath className="me-1" />

                            {property.bathrooms ||
                              0}{" "}
                            Bath

                          </div>

                          <div className="col-4">

                            <FaRulerCombined className="me-1" />

                            {property.areaSqft ||
                              0}{" "}
                            sqft

                          </div>

                        </div>
                      )}

                      {/* =====================================
                          PG INFORMATION
                      ===================================== */}

                      {isPG && (
                        <div className="bg-light rounded-3 p-3 mb-3">

                          <div className="row g-3 text-center">

                            <div className="col-4">

                              <strong>
                                {property.totalRooms ||
                                  0}
                              </strong>

                              <div className="small text-muted">
                                Rooms
                              </div>

                            </div>

                            <div className="col-4">

                              <strong>
                                {property.totalBeds ||
                                  0}
                              </strong>

                              <div className="small text-muted">
                                Total Beds
                              </div>

                            </div>

                            <div className="col-4">

                              <strong className="text-success">
                                {property.availableBeds ??
                                  0}
                              </strong>

                              <div className="small text-muted">
                                Vacant
                              </div>

                            </div>

                          </div>

                          {property.sharingType && (
                            <div className="text-center mt-3">

                              <span className="badge bg-primary">

                                {
                                  property.sharingType
                                }{" "}
                                Sharing

                              </span>

                            </div>
                          )}

                        </div>
                      )}

                      {/* =====================================
                          VILLA INFORMATION
                      ===================================== */}

                      {isVilla && (
                        <div className="alert alert-info py-2">

                          Stay:{" "}

                          <strong>
                            {property.minimumStayDays ||
                              1}
                          </strong>

                          {" - "}

                          <strong>
                            {property.maximumStayDays ||
                              "Any"}
                          </strong>

                          {" days"}

                          {property.maximumGuests && (
                            <>
                              {" • "}

                              {
                                property.maximumGuests
                              }{" "}
                              guests
                            </>
                          )}

                        </div>
                      )}

                      {/* =====================================
                          STATUS
                      ===================================== */}

                      <div className="mb-3">

                        <small className="text-muted d-block">
                          Approval Status
                        </small>

                        <strong>
                          {property.approvalStatus ||
                            "PENDING"}
                        </strong>

                      </div>

                      <div className="mb-4">

                        <small className="text-muted d-block">
                          Rental Status
                        </small>

                        <strong>
                          {property.rentalStatus ||
                            "AVAILABLE"}
                        </strong>

                      </div>

                      {/* =====================================
                          BUTTONS
                      ===================================== */}

                      <div className="d-flex gap-2">

                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() =>
                            navigate(
                              `/property/${property.id}`
                            )
                          }
                        >
                          <FaEye className="me-1" />

                          View
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            navigate(
                              `/landlord/properties/${property.id}/edit`
                            )
                          }
                        >
                          <FaPen className="me-1" />

                          Edit
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default MyProperties;