import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "react-toastify";

import {
  approveProperty,
  getAdminProperties,
  rejectProperty,
} from "../../services/propertyApi";

import {
  FaCheck,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

const getRentDetails = (property) => {
  const pricingType = String(property?.pricingType || "").toUpperCase();
  const category = String(property?.category || "").toUpperCase();

  if (pricingType === "PER_BED_MONTHLY" || category === "PG") {
    return {
      amount: Number(property?.rentPerBed ?? property?.monthlyRent ?? 0),
      unit: "/bed/month",
    };
  }

  if (pricingType === "DAILY") {
    return {
      amount: Number(property?.dailyRent ?? property?.monthlyRent ?? 0),
      unit: "/day",
    };
  }

  return {
    amount: Number(
      property?.monthlyRent ??
        property?.rentPerBed ??
        property?.dailyRent ??
        0
    ),
    unit: "/month",
  };
};

const AdminProperties = () => {
  const [
    properties,
    setProperties,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadProperties =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getAdminProperties();

        console.log(
          "ADMIN PROPERTY RESPONSE:",
          data
        );

        setProperties(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load admin properties:",
          error
        );

        toast.error(
          error.message ||
            "Unable to load properties."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleApprove =
    async (propertyId) => {
      const confirmed =
        window.confirm(
          "Approve this property?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await approveProperty(
          propertyId
        );

        toast.success(
          "Property approved successfully."
        );

        await loadProperties();
      } catch (error) {
        toast.error(
          error.message ||
            "Unable to approve property."
        );
      }
    };

  const handleReject =
    async (propertyId) => {
      const reason =
        window.prompt(
          "Enter rejection reason:"
        );

      if (!reason?.trim()) {
        return;
      }

      try {
        await rejectProperty(
          propertyId,
          reason.trim()
        );

        toast.success(
          "Property rejected."
        );

        await loadProperties();
      } catch (error) {
        toast.error(
          error.message ||
            "Unable to reject property."
        );
      }
    };

  const getStatusClass =
    (status) => {
      if (
        status === "APPROVED"
      ) {
        return "bg-success";
      }

      if (
        status === "REJECTED"
      ) {
        return "bg-danger";
      }

      if (
        status === "ARCHIVED"
      ) {
        return "bg-secondary";
      }

      return "bg-warning text-dark";
    };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <h4>
          Loading properties...
        </h4>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <small className="text-primary fw-bold">
          PROPERTY MANAGEMENT
        </small>

        <h2 className="fw-bold mt-1">
          Property Approvals
        </h2>

        <p className="text-muted">
          Review landlord property
          listings and approve or reject
          them.
        </p>
      </div>

      <div className="row g-4">
        {properties.map(
          (property) => {
            const rent = getRentDetails(property);

            return (
            <div
              className="col-xl-4 col-lg-6"
              key={property.id}
            >
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <img
                    src={
                      property.image
                    }
                    alt={
                      property.title
                    }
                    style={{
                      width: "100%",
                      height:
                        "220px",
                      objectFit:
                        "cover",
                    }}
                  />

                  <span
                    className={`badge ${getStatusClass(
                      property
                        .approvalStatus
                    )}`}
                    style={{
                      position:
                        "absolute",
                      right:
                        "15px",
                      top: "15px",
                    }}
                  >
                    {
                      property
                        .approvalStatus
                    }
                  </span>
                </div>

                <div className="card-body p-4">
                  <small className="text-primary fw-bold">
                    PROPERTY #
                    {property.id}
                  </small>

                  <h4 className="mt-2">
                    {
                      property.title
                    }
                  </h4>

                  <p className="text-muted">
                    <FaMapMarkerAlt />{" "}
                    {
                      property.area
                    }
                    ,{" "}
                    {
                      property.city
                    }
                  </p>

                  <p>
                    <strong>
                      Landlord:
                    </strong>{" "}
                    {
                      property
                        .landlordName
                    }
                  </p>

                  <p>
                    <strong>
                      Landlord ID:
                    </strong>{" "}
                    {
                      property
                        .landlordId
                    }
                  </p>

                  <p>
                    <strong>
                      Rent:
                    </strong>{" "}
                    ₹
                    {rent.amount.toLocaleString("en-IN")}
                    {rent.unit}
                  </p>

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {
                      property.category
                    }
                  </p>

                  <p>
                    <strong>
                      Rental Status:
                    </strong>{" "}
                    {
                      property
                        .rentalStatus
                    }
                  </p>

                  {property
                    .rejectionReason && (
                    <div className="alert alert-danger">
                      {
                        property
                          .rejectionReason
                      }
                    </div>
                  )}

                  {property
                    .approvalStatus ===
                    "PENDING" && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() =>
                          handleApprove(
                            property.id
                          )
                        }
                      >
                        <FaCheck />{" "}
                        Approve
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          handleReject(
                            property.id
                          )
                        }
                      >
                        <FaTimes />{" "}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          }
        )}
      </div>

      {!properties.length && (
        <div className="text-center py-5">
          <h4>
            No properties found.
          </h4>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
