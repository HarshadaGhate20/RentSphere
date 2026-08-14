import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaHandshake,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  getPropertyById,
} from "../../services/propertyApi";

import {
  createNegotiation,
} from "../../services/negotiationApi";

import {
  getTenantUser,
} from "../../utils/sessionUser";

const TenantNegotiateRent = () => {
  const { propertyId } =
    useParams();

  const navigate =
    useNavigate();

  const [
    property,
    setProperty,
  ] = useState(null);

  const [
    proposedRent,
    setProposedRent,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

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
              propertyId
            );

          if (!data) {
            throw new Error(
              "Property was not returned by the Property Service."
            );
          }

          setProperty(data);

          setProposedRent(
            String(
              data.monthlyRent || data.rentPerBed || data.dailyRent ||
                ""
            )
          );
        } catch (
          loadError
        ) {
          console.error(
            "NEGOTIATION PROPERTY ERROR:",
            loadError
          );

          setProperty(null);

          setError(
            loadError.message ||
              "Unable to load property."
          );
        } finally {
          setLoading(false);
        }
      };

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaBuilding
          size={45}
          className="text-primary mb-3"
        />

        <h3>
          Loading property...
        </h3>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 text-center">
        <FaBuilding
          size={55}
          className="text-primary mb-3"
        />

        <h2>
          Property not found
        </h2>

        <p className="text-muted">
          {error ||
            "The selected property could not be loaded."}
        </p>

        <Link
          to="/properties"
          className="btn btn-primary"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  const approvalStatus =
    String(
      property.approvalStatus ||
        ""
    ).toUpperCase();

  const rentalStatus =
    String(
      property.rentalStatus ||
        ""
    ).toUpperCase();

  const isNegotiable =
    approvalStatus ===
      "APPROVED" &&
    rentalStatus ===
      "AVAILABLE";

  const pricingType = String(property.pricingType || "").toUpperCase();
  const isPg = String(property.category || "").toUpperCase() === "PG" || pricingType === "PER_BED_MONTHLY";
  const isDaily = String(property.category || "").toUpperCase() === "VILLA" || pricingType === "DAILY";
  const listedRent = Number(isPg ? property.rentPerBed : isDaily ? property.dailyRent : property.monthlyRent) || 0;
  const rentSuffix = isPg ? "/bed/month" : isDaily ? "/day" : "/month";

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      try {
        setError("");

        if (!isNegotiable) {
          setError(
            `This property cannot currently be negotiated. Status: ${rentalStatus}`
          );

          return;
        }

        const rent =
          Number(
            proposedRent
          );

        if (
          !rent ||
          rent <= 0
        ) {
          setError(
            "Please enter a valid proposed monthly rent."
          );

          return;
        }

        if (
          rent >
          Number(
            listedRent
          )
        ) {
          setError(
            "Proposed rent should not be greater than the listed rent."
          );

          return;
        }

        if (
          message.trim().length <
          5
        ) {
          setError(
            "Please enter a short message for the landlord."
          );

          return;
        }

        const tenant =
          getTenantUser();

        const tenantId =
          tenant.email ||
          tenant.id;

        const requestData = {
          propertyId:
            Number(
              property.id
            ),

          tenantId,

          tenantName:
            tenant.name,

          tenantEmail:
            tenant.email,

          proposedRent:
            rent,

          listedRent,

          tenantMessage:
            message.trim(),
        };

        console.log(
          "NEGOTIATION REQUEST:",
          requestData
        );

        setSubmitting(true);

        const response =
          await createNegotiation(
            requestData
          );

        console.log(
          "NEGOTIATION RESPONSE:",
          response
        );

        navigate(
          "/tenant/negotiations"
        );
      } catch (
        submitError
      ) {
        console.error(
          "NEGOTIATION SUBMIT ERROR:",
          submitError
        );

        setError(
          submitError.message ||
            "Unable to send negotiation request."
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="container py-4">
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={() =>
          navigate(
            `/property/${property.id}`
          )
        }
      >
        <FaArrowLeft className="me-2" />
        Back to Property
      </button>

      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="mb-4">
              <small className="text-primary fw-bold">
                RENT NEGOTIATION
              </small>

              <h2 className="mt-2">
                Negotiate Monthly Rent
              </h2>

              <p className="text-muted mb-0">
                Send your proposed monthly
                rent to the landlord.
              </p>
            </div>

            <div className="bg-light rounded-4 p-4 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    flexShrink: 0,
                  }}
                >
                  <FaBuilding />
                </div>

                <div>
                  <small className="text-primary fw-bold">
                    {property.category}
                  </small>

                  <h3 className="mt-1 mb-2">
                    {property.title}
                  </h3>

                  <p className="text-muted mb-2">
                    <FaMapMarkerAlt />{" "}
                    {property.area}
                    {property.area &&
                    property.city
                      ? ", "
                      : ""}
                    {property.city}
                  </p>

                  <small>
                    Property ID:{" "}
                    <strong>
                      {property.id}
                    </strong>
                  </small>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <small className="text-muted">
                Listed Rent
              </small>

              <h2 className="text-primary mt-1">
                ₹
                {Number(
                  listedRent
                ).toLocaleString(
                  "en-IN"
                )}

                <small className="text-muted fs-6">
                  {rentSuffix}
                </small>
              </h2>
            </div>

            <div
              className={`alert ${
                isNegotiable
                  ? "alert-success"
                  : "alert-warning"
              }`}
            >
              {isNegotiable
                ? "This property is available for rent negotiation."
                : `Negotiation unavailable. Property status: ${rentalStatus}`}
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Your Proposed Monthly Rent
                </label>

                <div className="input-group">
                  <span className="input-group-text">
                    ₹
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    step="1"
                    value={
                      proposedRent
                    }
                    disabled={
                      !isNegotiable ||
                      submitting
                    }
                    onChange={(
                      event
                    ) =>
                      setProposedRent(
                        event.target.value
                      )
                    }
                  />
                </div>

                <small className="text-muted">
                  Current listed rent is ₹
                  {Number(
                    listedRent
                  ).toLocaleString(
                    "en-IN"
                  )}.
                </small>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Message to Landlord
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  maxLength="1000"
                  placeholder="Example: I am interested in renting this property for 12 months. Could you consider my proposed rent?"
                  value={message}
                  disabled={
                    !isNegotiable ||
                    submitting
                  }
                  onChange={(
                    event
                  ) =>
                    setMessage(
                      event.target.value
                    )
                  }
                />

                <small className="text-muted">
                  {message.length}/1000 characters
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={
                  !isNegotiable ||
                  submitting
                }
              >
                <FaHandshake className="me-2" />

                {submitting
                  ? "Sending..."
                  : "Send Negotiation Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantNegotiateRent;
