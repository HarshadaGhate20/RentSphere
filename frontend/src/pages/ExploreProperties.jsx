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
  FaHeart,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaSearch,
} from "react-icons/fa";

import {
  toast,
} from "react-toastify";

import {
  getPublicProperties,
} from "../services/propertyApi";

import {
  getWishlist,
  toggleWishlist,
} from "../utils/wishlist";

const formatCurrency = (
  value
) =>
  `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;

/* =========================================================
   PRICE
========================================================= */

const getPriceDetails = (
  property
) => {

  const category =
    String(
      property.category ||
        ""
    )
      .trim()
      .toUpperCase();

  const pricingType =
    String(
      property.pricingType ||
        ""
    )
      .trim()
      .toUpperCase();

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
    };
  }

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
    };
  }

  return {
    amount:
      property.monthlyRent ||
      0,

    suffix:
      "/month",
  };
};

/* =========================================================
   TYPE
========================================================= */

const isPgProperty = (
  property
) => {

  const category =
    String(
      property.category ||
        ""
    )
      .trim()
      .toUpperCase();

  const pricingType =
    String(
      property.pricingType ||
        ""
    )
      .trim()
      .toUpperCase();

  return (
    category === "PG" ||
    pricingType ===
      "PER_BED_MONTHLY"
  );
};

/* =========================================================
   DISPLAY STATUS
========================================================= */

const getDisplayStatus = (
  property
) => {

  if (
    isPgProperty(
      property
    )
  ) {

    const availableBeds =
      Number(
        property.availableBeds ||
          0
      );

    /*
     * PG remains available while
     * at least one bed remains.
     */
    return availableBeds > 0
      ? "AVAILABLE"
      : "BOOKED";
  }

  return (
    property.rentalStatus ||
    "AVAILABLE"
  );
};

const getStatusClass = (
  status
) => {

  switch (
    String(
      status ||
        ""
    ).toUpperCase()
  ) {

    case "AVAILABLE":
      return "bg-success";

    case "WAITING_PAYMENT":
      return "bg-info text-dark";

    case "BOOKED":
      return "bg-primary";

    case "RENTED":
      return "bg-secondary";

    default:
      return "bg-secondary";
  }
};

const ExploreProperties =
  () => {

    const navigate =
      useNavigate();

    const [
      properties,
      setProperties,
    ] =
      useState([]);

    const [
      wishlist,
      setWishlist,
    ] =
      useState(
        () =>
          getWishlist()
      );

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

    const [
      city,
      setCity,
    ] =
      useState("");

    const [
      category,
      setCategory,
    ] =
      useState("");

    const [
      status,
      setStatus,
    ] =
      useState("");

    /* =======================================================
       LOAD
    ======================================================= */

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

            const data =
              await getPublicProperties();

            console.log(
              "PUBLIC PROPERTIES:",
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
              "PUBLIC PROPERTY LOAD ERROR:",
              loadError
            );

            setError(
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

    /* =======================================================
       CITY OPTIONS
    ======================================================= */

    const cities =
      useMemo(
        () =>
          [
            ...new Set(
              properties
                .map(
                  (
                    property
                  ) =>
                    property.city
                )
                .filter(
                  Boolean
                )
            ),
          ].sort(),
        [
          properties,
        ]
      );

    /* =======================================================
       CATEGORY OPTIONS
    ======================================================= */

    const categories =
      useMemo(
        () =>
          [
            ...new Set(
              properties
                .map(
                  (
                    property
                  ) =>
                    property.category
                )
                .filter(
                  Boolean
                )
            ),
          ].sort(),
        [
          properties,
        ]
      );

    /* =======================================================
       FILTER
    ======================================================= */

    const filteredProperties =
      useMemo(
        () => {

          const term =
            search
              .trim()
              .toLowerCase();

          return properties.filter(
            (
              property
            ) => {

              const matchesSearch =
                !term ||
                [
                  property.title,
                  property.area,
                  property.city,
                  property.category,
                ]
                  .filter(
                    Boolean
                  )
                  .some(
                    (
                      value
                    ) =>
                      String(
                        value
                      )
                        .toLowerCase()
                        .includes(
                          term
                        )
                  );

              const matchesCity =
                !city ||
                property.city ===
                  city;

              const matchesCategory =
                !category ||
                property.category ===
                  category;

              const displayStatus =
                getDisplayStatus(
                  property
                );

              const matchesStatus =
                !status ||
                displayStatus ===
                  status;

              return (
                matchesSearch &&
                matchesCity &&
                matchesCategory &&
                matchesStatus
              );
            }
          );
        },
        [
          properties,
          search,
          city,
          category,
          status,
        ]
      );

    /* =======================================================
       WISHLIST
    ======================================================= */

    const isWishlisted =
      (
        propertyId
      ) =>
        wishlist.some(
          (
            item
          ) =>
            String(
              item.id
            ) ===
            String(
              propertyId
            )
        );

    const handleWishlist =
      (
        property
      ) => {

        const result =
          toggleWishlist(
            property
          );

        setWishlist(
          result.wishlist
        );

        toast.success(
          result.saved
            ? "Property added to wishlist."
            : "Property removed from wishlist."
        );
      };

    const resetFilters =
      () => {

        setSearch("");
        setCity("");
        setCategory("");
        setStatus("");
      };

    if (loading) {

      return (
        <div className="container py-5 text-center">

          <div className="spinner-border text-primary" />

          <p className="mt-3">
            Loading properties...
          </p>

        </div>
      );
    }

    return (
      <div
        className="container-fluid px-lg-5 py-4"
        style={{
          background:
            "#f7f9fc",

          minHeight:
            "100vh",
        }}
      >

        {/* HEADER */}

        <div className="mb-4">

          <small className="text-primary fw-bold">
            RENTAL DIRECTORY
          </small>

          <h1 className="display-5 fw-bold">
            Explore Properties
          </h1>

          <p className="text-muted">
            Discover approved
            rental properties and
            save your favourites.
          </p>

        </div>

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

        {/* FILTERS */}

        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">

          <div className="row g-3">

            <div className="col-lg-4">

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>

                <input
                  className="form-control"
                  placeholder="Search property, city or locality"
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

            </div>

            <div className="col-lg-2">

              <select
                className="form-select"
                value={
                  city
                }
                onChange={(
                  event
                ) =>
                  setCity(
                    event.target
                      .value
                  )
                }
              >

                <option value="">
                  All cities
                </option>

                {cities.map(
                  (
                    value
                  ) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {value}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="col-lg-2">

              <select
                className="form-select"
                value={
                  category
                }
                onChange={(
                  event
                ) =>
                  setCategory(
                    event.target
                      .value
                  )
                }
              >

                <option value="">
                  All property types
                </option>

                {categories.map(
                  (
                    value
                  ) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {value}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="col-lg-2">

              <select
                className="form-select"
                value={
                  status
                }
                onChange={(
                  event
                ) =>
                  setStatus(
                    event.target
                      .value
                  )
                }
              >

                <option value="">
                  All statuses
                </option>

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="WAITING_PAYMENT">
                  Waiting Payment
                </option>

                <option value="BOOKED">
                  Booked
                </option>

                <option value="RENTED">
                  Rented
                </option>

              </select>

            </div>

            <div className="col-lg-2">

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={
                  resetFilters
                }
              >
                Reset
              </button>

            </div>

          </div>

        </div>

        <small className="text-primary fw-bold">
          PROPERTY DIRECTORY
        </small>

        <h2 className="fw-bold mb-4">
          Rental Properties
        </h2>

        {filteredProperties.length ===
        0 ? (

          <div className="card border-0 p-5 text-center">

            <FaBuilding
              size={50}
              className="mx-auto text-primary mb-3"
            />

            <h4>
              No properties found
            </h4>

            <button
              type="button"
              className="btn btn-primary mx-auto mt-3"
              onClick={
                resetFilters
              }
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="row g-4">

            {filteredProperties.map(
              (
                property
              ) => {

                const price =
                  getPriceDetails(
                    property
                  );

                const isPG =
                  isPgProperty(
                    property
                  );

                const displayStatus =
                  getDisplayStatus(
                    property
                  );

                const availableBeds =
                  Number(
                    property
                      .availableBeds ||
                    0
                  );

                const canView =
                  !isPG ||
                  availableBeds >
                    0;

                return (

                  <div
                    className="col-xl-4 col-lg-6"
                    key={
                      property.id
                    }
                  >

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                      {/* IMAGE */}

                      <div
                        className="position-relative bg-light"
                        style={{
                          height:
                            "300px",
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
                            className="w-100 h-100"
                            style={{
                              objectFit:
                                "cover",
                            }}
                          />

                        ) : (

                          <div className="h-100 d-flex justify-content-center align-items-center text-muted">

                            <FaBuilding
                              size={
                                55
                              }
                            />

                          </div>

                        )}

                        {/* STATUS */}

                        <span
                          className={`badge position-absolute top-0 start-0 m-3 ${getStatusClass(
                            displayStatus
                          )}`}
                        >

                          {
                            displayStatus
                          }

                        </span>

                        {/* WISHLIST */}

                        <button
                          type="button"
                          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
                          style={{
                            width:
                              "48px",

                            height:
                              "48px",
                          }}
                          onClick={() =>
                            handleWishlist(
                              property
                            )
                          }
                        >

                          <FaHeart
                            style={{
                              color:
                                isWishlisted(
                                  property.id
                                )
                                  ? "#ec407a"
                                  : "#94a3b8",
                              transition: "color 160ms ease, transform 160ms ease",
                              transform: isWishlisted(property.id) ? "scale(1.12)" : "scale(1)",
                            }}
                          />

                        </button>

                        <span className="badge bg-light text-primary position-absolute bottom-0 start-0 m-3">

                          {
                            property.category
                          }

                        </span>

                      </div>

                      {/* BODY */}

                      <div className="card-body p-4">

                        <small className="text-primary fw-bold">

                          PROPERTY #
                          {property.id}

                        </small>

                        <h4 className="fw-bold mt-3">

                          {
                            property.title
                          }

                      </h4>

                      <p className="mb-2 text-dark">
                        <strong>Landlord:</strong>{" "}
                        {property.landlordName || "RentSphere Landlord"}
                      </p>

                      <p className="text-muted">

                          <FaMapMarkerAlt className="me-2" />

                          {
                            property.area
                          }

                          {property.city
                            ? `, ${property.city}`
                            : ""}

                        </p>

                        {/* PRICE */}

                        <div className="mb-4">

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

                        {/* PG INFO */}

                        {isPG ? (

                          <div className="row bg-light rounded-3 p-3 mb-4 text-center">

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
                                Beds
                              </div>

                            </div>

                            <div className="col-4">

                              <strong
                                className={
                                  availableBeds >
                                  0
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {
                                  availableBeds
                                }
                              </strong>

                              <div className="small text-muted">
                                Vacant
                              </div>

                            </div>

                          </div>

                        ) : (

                          <div className="row bg-light rounded-3 p-3 mb-4 text-center">

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

                        <button
                          type="button"
                          className={`btn w-100 ${
                            canView
                              ? "btn-primary"
                              : "btn-secondary"
                          }`}
                          disabled={
                            !canView
                          }
                          onClick={() =>
                            navigate(
                              `/property/${property.id}`
                            )
                          }
                        >

                          {isPG &&
                          availableBeds ===
                            0
                            ? "No Beds Available"
                            : "View Details"}

                        </button>

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

export default ExploreProperties;
