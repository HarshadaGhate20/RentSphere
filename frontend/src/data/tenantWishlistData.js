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
  getTenantUser,
} from "../../utils/sessionUser";

/* =========================================================
   WISHLIST HELPERS
========================================================= */

const getWishlistKey = () => {
  try {
    const tenant =
      getTenantUser();

    const tenantId =
      tenant.email ||
      tenant.id;

    if (!tenantId) {
      return null;
    }

    return `rentsphere_tenant_wishlist_${String(
      tenantId
    ).toLowerCase()}`;
  } catch (error) {
    return null;
  }
};

const readWishlist = () => {
  const key =
    getWishlistKey();

  if (!key) {
    return [];
  }

  try {
    const saved =
      localStorage.getItem(
        key
      );

    const parsed =
      saved
        ? JSON.parse(saved)
        : [];

    return Array.isArray(
      parsed
    )
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Unable to read wishlist:",
      error
    );

    return [];
  }
};

const saveWishlist = (
  wishlist
) => {
  const key =
    getWishlistKey();

  if (!key) {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(
      wishlist
    )
  );
};

/* =========================================================
   COMPONENT
========================================================= */

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

  /* =========================================================
     LOAD WISHLIST
  ========================================================= */

  const loadWishlist =
    () => {
      setWishlist(
        readWishlist()
      );
    };

  useEffect(() => {
    loadWishlist();
  }, []);

  /*
   * Refresh if storage changes
   * from another browser tab.
   */
  useEffect(() => {
    const handleStorage =
      () => {
        loadWishlist();
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () =>
      window.removeEventListener(
        "storage",
        handleStorage
      );
  }, []);

  /* =========================================================
     REMOVE PROPERTY
  ========================================================= */

  const removeFromWishlist =
    (propertyId) => {
      const updated =
        wishlist.filter(
          (property) =>
            Number(
              property.id
            ) !==
            Number(
              propertyId
            )
        );

      setWishlist(
        updated
      );

      saveWishlist(
        updated
      );
    };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

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

      setWishlist([]);

      saveWishlist([]);
    };

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

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

  /* =========================================================
     FILTER + SORT
  ========================================================= */

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
            Number(
              a.monthlyRent ||
                0
            ) -
            Number(
              b.monthlyRent ||
                0
            )
        );
      }

      if (
        sortBy ===
        "RENT_HIGH"
      ) {
        results.sort(
          (a, b) =>
            Number(
              b.monthlyRent ||
                0
            ) -
            Number(
              a.monthlyRent ||
                0
            )
        );
      }

      if (
        sortBy ===
        "RECENT"
      ) {
        results.sort(
          (a, b) =>
            new Date(
              b.savedAt ||
                0
            ) -
            new Date(
              a.savedAt ||
                0
            )
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

  /* =========================================================
     RESET FILTERS
  ========================================================= */

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

      {/* =====================================================
          HEADER
      ====================================================== */}

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

      {/* =====================================================
          SUMMARY
      ====================================================== */}

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

      {/* =====================================================
          FILTERS
      ====================================================== */}

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

      {/* =====================================================
          RESULT HEADING
      ====================================================== */}

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
            : "s"}
        </p>

      </div>

      {/* =====================================================
          EMPTY WISHLIST
      ====================================================== */}

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

        /* ===================================================
           PROPERTY CARDS
        =================================================== */

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

                    {/* IMAGE */}

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

                      {/* REMOVE HEART */}

                      <button
                        type="button"
                        className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow"
                        style={{
                          width:
                            "45px",
                          height:
                            "45px",
                        }}
                        onClick={() =>
                          removeFromWishlist(
                            property.id
                          )
                        }
                        title="Remove from wishlist"
                      >
                        <FaHeart className="text-danger" />
                      </button>

                      {/* CATEGORY */}

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
                        {Number(
                          property.monthlyRent ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}

                        <small className="text-muted fs-6">
                          /month
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
                            removeFromWishlist(
                              property.id
                            )
                          }
                          title="Remove from wishlist"
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