import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBath,
  FaBed,
  FaBuilding,
  FaHeart,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
  saveWishlist,
} from "../../utils/wishlist";

import { getPropertyById } from "../../services/propertyApi";

const getDisplayedRent = (property) => {
  const category = String(property?.category || "").toUpperCase();
  const pricingType = String(property?.pricingType || "").toUpperCase();
  if (category === "PG" || pricingType === "PER_BED_MONTHLY") {
    return Number(property?.rentPerBed || property?.monthlyRent || 0);
  }
  if (category === "VILLA" || pricingType === "DAILY") {
    return Number(property?.dailyRent || property?.monthlyRent || 0);
  }
  return Number(property?.monthlyRent || property?.rentPerBed || property?.dailyRent || 0);
};

const getRentSuffix = (property) => {
  const category = String(property?.category || "").toUpperCase();
  const pricingType = String(property?.pricingType || "").toUpperCase();
  if (category === "PG" || pricingType === "PER_BED_MONTHLY") return "/bed/month";
  if (category === "VILLA" || pricingType === "DAILY") return "/day";
  return "/month";
};

const TenantWishlist = () => {
  const navigate =
    useNavigate();

  const [
    wishlist,
    setWishlist,
  ] = useState([]);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    cityFilter,
    setCityFilter,
  ] = useState("ALL");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("ALL");

  const [
    sortBy,
    setSortBy,
  ] = useState("RECENT");

  const loadWishlist =
    async () => {
      const data =
        getWishlist();

      const saved = Array.isArray(data) ? data : [];
      const refreshed = await Promise.all(saved.map(async (item) => {
        try {
          const current = await getPropertyById(item.id);
          return current ? { ...item, ...current, savedOn: item.savedOn } : item;
        } catch (refreshError) {
          console.warn(`Unable to refresh wishlist property ${item.id}:`, refreshError);
          return item;
        }
      }));

      saveWishlist(refreshed);
      setWishlist(refreshed);
    };

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    const handleStorage =
      () => {
        loadWishlist();
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const handleRemove = (
    propertyId
  ) => {
    const updated =
      removeFromWishlist(
        propertyId
      );

    setWishlist(
      updated
    );
  };

  const clearWishlist =
    () => {
      if (
        wishlist.length ===
        0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Remove all saved properties from your wishlist?"
        );

      if (!confirmed) {
        return;
      }

      saveWishlist([]);

      setWishlist([]);
    };

  const cities =
    useMemo(() => {
      return [
        ...new Set(
          wishlist
            .map(
              (property) =>
                property.city
            )
            .filter(Boolean)
        ),
      ].sort();
    }, [wishlist]);

  const propertyTypes =
    useMemo(() => {
      return [
        ...new Set(
          wishlist
            .map(
              (property) =>
                property.category
            )
            .filter(Boolean)
        ),
      ].sort();
    }, [wishlist]);

  const filteredWishlist =
    useMemo(() => {
      const query =
        searchText
          .trim()
          .toLowerCase();

      let results =
        wishlist.filter(
          (property) => {
            const matchesSearch =
              !query ||
              [
                property.title,
                property.category,
                property.area,
                property.city,
                property.state,
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

            const matchesCity =
              cityFilter ===
                "ALL" ||
              property.city ===
                cityFilter;

            const matchesType =
              typeFilter ===
                "ALL" ||
              property.category ===
                typeFilter;

            return (
              matchesSearch &&
              matchesCity &&
              matchesType
            );
          }
        );

      results = [
        ...results,
      ];

      if (
        sortBy ===
        "RENT_LOW"
      ) {
        results.sort(
          (a, b) =>
            getDisplayedRent(a) -
            getDisplayedRent(b)
        );
      }

      if (
        sortBy ===
        "RENT_HIGH"
      ) {
        results.sort(
          (a, b) =>
            getDisplayedRent(b) -
            getDisplayedRent(a)
        );
      }

      if (
        sortBy ===
        "RECENT"
      ) {
        results.sort(
          (a, b) => {
            const bDate =
              new Date(
                b.savedOn ||
                  b.savedAt ||
                  0
              );

            const aDate =
              new Date(
                a.savedOn ||
                  a.savedAt ||
                  0
              );

            return (
              bDate -
              aDate
            );
          }
        );
      }

      return results;
    }, [
      wishlist,
      searchText,
      cityFilter,
      typeFilter,
      sortBy,
    ]);

  const resetFilters =
    () => {
      setSearchText("");
      setCityFilter(
        "ALL"
      );
      setTypeFilter(
        "ALL"
      );
      setSortBy(
        "RECENT"
      );
    };

  return (
    <div className="container-fluid py-4">

      <section className="mb-4 p-4 bg-white rounded-4 shadow-sm">

        <small className="text-primary fw-bold">
          TENANT WISHLIST
        </small>

        <h1 className="mt-2">
          My Wishlist
        </h1>

        <p className="text-muted mb-0">
          Review and compare the
          rental properties you saved
          while exploring RentSphere.
        </p>

      </section>

      <section className="card border-primary-subtle rounded-4 mb-4">

        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">

          <div className="d-flex align-items-center gap-3">

            <FaHeart
              className="text-danger"
              size={28}
            />

            <div>

              <small className="text-primary fw-bold">
                SAVED PROPERTIES
              </small>

              <h3 className="mb-0">
                {
                  wishlist.length
                }
              </h3>

            </div>

          </div>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  "/properties"
                )
              }
            >
              <FaBuilding className="me-2" />

              Browse More Properties
            </button>

            {wishlist.length >
              0 && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={
                  clearWishlist
                }
              >
                Clear Wishlist
              </button>
            )}

          </div>

        </div>

      </section>

      <section className="card border-0 shadow-sm rounded-4 mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-5">

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Search property, city or locality"
                  value={
                    searchText
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-lg-2">

              <select
                className="form-select"
                value={
                  cityFilter
                }
                onChange={(
                  event
                ) =>
                  setCityFilter(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  All cities
                </option>

                {cities.map(
                  (city) => (
                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="col-lg-2">

              <select
                className="form-select"
                value={
                  typeFilter
                }
                onChange={(
                  event
                ) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
              >
                <option value="ALL">
                  All property types
                </option>

                {propertyTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="col-lg-2">

              <select
                className="form-select"
                value={
                  sortBy
                }
                onChange={(
                  event
                ) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="RECENT">
                  Recently saved
                </option>

                <option value="RENT_LOW">
                  Rent: Low to High
                </option>

                <option value="RENT_HIGH">
                  Rent: High to Low
                </option>
              </select>

            </div>

            <div className="col-lg-1">

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

      </section>

      <div className="d-flex justify-content-between align-items-end mb-3">

        <div>

          <small className="text-primary fw-bold">
            WISHLIST DIRECTORY
          </small>

          <h2>
            Saved rental properties
          </h2>

        </div>

        <p className="text-muted mb-0">
          {
            filteredWishlist.length
          }{" "}
          result
          {filteredWishlist.length ===
          1
            ? ""
            : "s"}{" "}
          found
        </p>

      </div>

      {filteredWishlist.length ===
      0 ? (
        <section className="border rounded-4 p-5 text-center bg-white">

          <FaHeart
            size={55}
            className="text-danger mb-3"
          />

          <h3>
            No saved properties found
          </h3>

          <p className="text-muted">
            Browse properties and
            click the heart icon to
            add listings to your
            wishlist.
          </p>

          <div className="d-flex justify-content-center gap-2">

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={
                resetFilters
              }
            >
              Clear Filters
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  "/properties"
                )
              }
            >
              Browse Properties
            </button>

          </div>

        </section>
      ) : (
        <div className="row g-4">

          {filteredWishlist.map(
            (property) => {
              const image =
                property.image ||
                property.images?.[0] ||
                "";

              return (
                <div
                  className="col-xl-4 col-lg-6"
                  key={
                    property.id
                  }
                >

                  <article className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">

                    <div
                      className="position-relative"
                      style={{
                        height:
                          "260px",
                      }}
                    >

                      {image ? (
                        <img
                          src={image}
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
                        <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">

                          <FaBuilding
                            size={
                              50
                            }
                            className="text-muted"
                          />

                        </div>
                      )}

                      <button
                        type="button"
                        className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow"
                        style={{
                          width:
                            "46px",
                          height:
                            "46px",
                          background:
                            "#ec4899",
                          color:
                            "#ffffff",
                          border:
                            "none",
                        }}
                        onClick={() =>
                          handleRemove(
                            property.id
                          )
                        }
                        title="Remove from wishlist"
                      >
                        <FaHeart />
                      </button>

                      <span className="badge bg-light text-primary position-absolute bottom-0 start-0 m-3">

                        {
                          property.category
                        }

                      </span>

                    </div>

                    <div className="card-body p-4">

                      <small className="text-primary fw-bold">
                        PROPERTY #
                        {
                          property.id
                        }
                      </small>

                      <h3 className="mt-2">
                        {
                          property.title
                        }
                      </h3>

                      <p className="text-muted">

                        <FaMapMarkerAlt className="me-1" />

                        {property.area}

                        {property.area &&
                        property.city
                          ? ", "
                          : ""}

                        {property.city}

                      </p>

                      <h3 className="text-primary">

                        ₹
                        {getDisplayedRent(property).toLocaleString(
                          "en-IN"
                        )}

                        <small className="text-muted fs-6">
                          {getRentSuffix(property)}
                        </small>

                      </h3>

                      <div className="d-flex justify-content-between bg-light rounded-3 p-3 my-3">

                        <span>
                          <FaBed />{" "}
                          {
                            property.bedrooms ||
                            0
                          }{" "}
                          Bed
                        </span>

                        <span>
                          <FaBath />{" "}
                          {
                            property.bathrooms ||
                            0
                          }{" "}
                          Bath
                        </span>

                        <span>
                          <FaRulerCombined />{" "}
                          {
                            property.areaSqft ||
                            0
                          }{" "}
                          sqft
                        </span>

                      </div>

                      <div className="mb-3">

                        <small className="text-muted">
                          Rental Status
                        </small>

                        <div>
                          <strong>
                            {String(
                              property.rentalStatus ||
                                "AVAILABLE"
                            ).replaceAll(
                              "_",
                              " "
                            )}
                          </strong>
                        </div>

                      </div>

                      <div className="d-flex gap-2">

                        <button
                          type="button"
                          className="btn btn-primary flex-grow-1"
                          onClick={() =>
                            navigate(
                              `/property/${property.id}`
                            )
                          }
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleRemove(
                              property.id
                            )
                          }
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </div>

                  </article>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default TenantWishlist;
