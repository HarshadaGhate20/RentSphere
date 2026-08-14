import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaBath,
  FaBed,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaHandshake,
} from "react-icons/fa";

import {
  getPropertyById,
} from "../services/propertyApi";

const PropertyDetails = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [
    property,
    setProperty,
  ] = useState(null);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadProperty =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getPropertyById(
              id
            );

          setProperty(
            data
          );

          setSelectedImage(
            data.images?.[0] ||
              data.image ||
              ""
          );
        } catch (
          loadError
        ) {
          console.error(
            "PROPERTY DETAILS ERROR:",
            loadError
          );

          setError(
            loadError.message ||
              "Unable to load property."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5">
        Loading property...
      </div>
    );
  }

  if (
    error ||
    !property
  ) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error ||
            "Property not found."}
        </div>

      </div>
    );
  }

  const isAvailable =
    property.approvalStatus ===
      "APPROVED" &&
    property.rentalStatus ===
      "AVAILABLE";

  const category = String(property.category || "").toUpperCase();
  const isPg = category === "PG" || String(property.pricingType || "").toUpperCase() === "PER_BED_MONTHLY";
  const isDaily = category === "VILLA" || String(property.pricingType || "").toUpperCase() === "DAILY";
  const listedRent = isPg ? property.rentPerBed : isDaily ? property.dailyRent : property.monthlyRent;
  const availableForBooking = isAvailable && (!isPg || Number(property.availableBeds || 0) > 0);

  return (
    <div className="container py-5">

      <div className="row g-4">

        {/* =========================
            PROPERTY IMAGES
        ========================== */}

        <div className="col-lg-8">

          <img
            src={
              selectedImage ||
              property.image
            }
            alt={
              property.title
            }
            className="img-fluid rounded-4 w-100"
            style={{
              maxHeight:
                "520px",

              objectFit:
                "cover",
            }}
          />

          <div className="row g-2 mt-2">

            {property.images?.map(
              (
                image,
                index
              ) => (
                <div
                  className="col-3"
                  key={`${image}-${index}`}
                >

                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 w-100"
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                  >

                    <img
                      src={
                        image
                      }
                      alt={`${property.title} ${
                        index + 1
                      }`}
                      className="img-fluid rounded-3"
                      style={{
                        height:
                          "100px",

                        width:
                          "100%",

                        objectFit:
                          "cover",
                      }}
                    />

                  </button>

                </div>
              )
            )}

          </div>

        </div>

        {/* =========================
            PROPERTY INFORMATION
        ========================== */}

        <div className="col-lg-4">

          <div className="card border-0 shadow-sm p-4">

            <small className="text-primary fw-bold">
              {
                property.category
              }
            </small>

            <h2 className="mt-2">
              {
                property.title
              }
            </h2>

            <p className="text-muted">
              <FaMapMarkerAlt />{" "}
              {property.area},{" "}
              {
                property.city
              }
            </p>

            <h2 className="text-primary">

              ₹
              {Number(
                listedRent
              ).toLocaleString(
                "en-IN"
              )}

              <small className="text-muted fs-6">
                {isPg ? "/bed/month" : isDaily ? "/day" : "/month"}
              </small>

            </h2>

            <p>
              Deposit: ₹
              {Number(
                property.securityDeposit ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
            </p>

            <p>
              Maintenance: ₹
              {Number(
                property.maintenanceCharge ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
            </p>

            {/* SPECS */}

            <div className="d-flex justify-content-between my-3">

              <span>
                <FaBed />{" "}
                {
                  property.bedrooms ||
                  0
                }
              </span>

              <span>
                <FaBath />{" "}
                {
                  property.bathrooms ||
                  0
                }
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

            {/* STATUS */}

            <div
              className={`alert ${
                isAvailable
                  ? "alert-success"
                  : "alert-secondary"
              }`}
            >

              {isAvailable
                ? "Available for booking and rent negotiation"
                : `Property status: ${property.rentalStatus}`}

            </div>

            {/* =========================
                TENANT ACTIONS
            ========================== */}

            {availableForBooking ? (
              <div className="d-grid gap-2">

                {/* BOOKING */}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      `/tenant/bookings/new/${property.id}`
                    )
                  }
                >
                  Request Booking
                </button>

                {/* NEGOTIATION */}

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate(
                      `/tenant/negotiate/${property.id}`
                    )
                  }
                >
                  <FaHandshake className="me-2" />

                  Negotiate Rent
                </button>

              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary w-100"
                disabled
              >
                Property Unavailable
              </button>
            )}

          </div>

        </div>

      </div>

      {/* =========================
          DESCRIPTION
      ========================== */}

      <div className="mt-5">

        <h3>
          Description
        </h3>

        <p>
          {
            property.description
          }
        </p>

        {/* AMENITIES */}

        <h3 className="mt-4">
          Amenities
        </h3>

        <div className="d-flex flex-wrap gap-2">

          {property.amenities?.length >
          0 ? (
            property.amenities.map(
              (amenity) => (
                <span
                  className="badge bg-light text-dark border p-2"
                  key={
                    amenity
                  }
                >
                  {amenity}
                </span>
              )
            )
          ) : (
            <p className="text-muted">
              No amenities listed.
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default PropertyDetails;
