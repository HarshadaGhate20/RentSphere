import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaImage,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaTimesCircle,
  FaTools,
  FaUser,
  FaUserCog,
  FaWrench,
} from "react-icons/fa";

import {
  getMaintenanceRequests,
  MAINTENANCE_STATUS,
  saveMaintenanceRequests,
} from "../../utils/maintenanceRequests";

import "../../assets/css/landlordMaintenance.css";

const statusTabs = [
  {
    value: "ALL",
    label: "All Requests",
  },
  {
    value: MAINTENANCE_STATUS.PENDING,
    label: "Pending",
  },
  {
    value: MAINTENANCE_STATUS.IN_PROGRESS,
    label: "In Progress",
  },
  {
    value: MAINTENANCE_STATUS.RESOLVED,
    label: "Resolved",
  },
  {
    value: MAINTENANCE_STATUS.REJECTED,
    label: "Rejected",
  },
];

const categoryOptions = [
  "ALL",
  "PLUMBING",
  "ELECTRICAL",
  "WATER_LEAKAGE",
  "APPLIANCE",
  "FURNITURE",
  "PEST_CONTROL",
  "CLEANING",
  "STRUCTURAL_DAMAGE",
  "INTERNET_OR_NETWORK",
  "OTHER",
];

const priorityOptions = [
  "ALL",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const formatLabel = (value) =>
  String(value || "UNKNOWN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );

const normalizeCategory = (issueType) =>
  String(issueType || "OTHER")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");

const LandlordMaintenance = () => {
  const [requests, setRequests] =
    useState(() =>
      getMaintenanceRequests()
    );

  const [activeTab, setActiveTab] =
    useState("ALL");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("ALL");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("ALL");

  const [search, setSearch] =
    useState("");

  const [
    selectedRequestId,
    setSelectedRequestId,
  ] = useState(null);

  const [
    landlordResponse,
    setLandlordResponse,
  ] = useState("");

  const [
    assignedTo,
    setAssignedTo,
  ] = useState("");

  /*
    Refresh whenever the landlord returns
    to this browser tab or another tab
    changes localStorage.
  */
  useEffect(() => {
    const refreshRequests = () => {
      setRequests(
        getMaintenanceRequests()
      );
    };

    refreshRequests();

    window.addEventListener(
      "focus",
      refreshRequests
    );

    window.addEventListener(
      "storage",
      refreshRequests
    );

    return () => {
      window.removeEventListener(
        "focus",
        refreshRequests
      );

      window.removeEventListener(
        "storage",
        refreshRequests
      );
    };
  }, []);

  const selectedRequest = useMemo(
    () =>
      requests.find(
        (request) =>
          request.id ===
          selectedRequestId
      ) || null,
    [
      requests,
      selectedRequestId,
    ]
  );

  const summary = useMemo(
    () => ({
      total: requests.length,

      pending: requests.filter(
        (request) =>
          request.status ===
          MAINTENANCE_STATUS.PENDING
      ).length,

      inProgress: requests.filter(
        (request) =>
          request.status ===
          MAINTENANCE_STATUS.IN_PROGRESS
      ).length,

      resolved: requests.filter(
        (request) =>
          request.status ===
          MAINTENANCE_STATUS.RESOLVED
      ).length,

      rejected: requests.filter(
        (request) =>
          request.status ===
          MAINTENANCE_STATUS.REJECTED
      ).length,

      urgent: requests.filter(
        (request) =>
          request.priority ===
            "URGENT" &&
          ![
            MAINTENANCE_STATUS.RESOLVED,
            MAINTENANCE_STATUS.REJECTED,
            MAINTENANCE_STATUS.CANCELLED,
          ].includes(request.status)
      ).length,
    }),
    [requests]
  );

  const filteredRequests =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      return requests.filter(
        (request) => {
          const category =
            normalizeCategory(
              request.issueType
            );

          const matchesStatus =
            activeTab === "ALL" ||
            request.status ===
              activeTab;

          const matchesCategory =
            categoryFilter ===
              "ALL" ||
            category ===
              categoryFilter;

          const matchesPriority =
            priorityFilter ===
              "ALL" ||
            request.priority ===
              priorityFilter;

          const searchableText = [
            request.id,
            request.title,
            request.description,
            request.issueType,
            request.propertyTitle,
            request.locality,
            request.city,
            request.landlordName,
            request.assignedTo,
            request.landlordResponse,
            request.status,
            request.priority,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );

          return (
            matchesStatus &&
            matchesCategory &&
            matchesPriority &&
            matchesSearch
          );
        }
      );
    }, [
      activeTab,
      categoryFilter,
      priorityFilter,
      requests,
      search,
    ]);

  const saveUpdatedRequests = (
    updatedRequests
  ) => {
    setRequests(updatedRequests);

    saveMaintenanceRequests(
      updatedRequests
    );
  };

  const updateRequest = (
    requestId,
    updates
  ) => {
    const updatedRequests =
      requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              ...updates,

              updatedOn:
                new Date().toLocaleString(
                  "en-IN"
                ),
            }
          : request
      );

    saveUpdatedRequests(
      updatedRequests
    );

    return updatedRequests;
  };

  const openDetails = (request) => {
    setSelectedRequestId(
      request.id
    );

    setLandlordResponse(
      request.landlordResponse ||
        ""
    );

    setAssignedTo(
      request.assignedTo || ""
    );
  };

  const closeDetails = () => {
    setSelectedRequestId(null);
    setLandlordResponse("");
    setAssignedTo("");
  };

  const startWork = (
    requestId
  ) => {
    if (
      assignedTo.trim().length < 2
    ) {
      toast.error(
        "Enter the assigned technician or service person."
      );

      return;
    }

    if (
      landlordResponse
        .trim().length < 5
    ) {
      toast.error(
        "Enter a work update of at least 5 characters."
      );

      return;
    }

    updateRequest(requestId, {
      status:
        MAINTENANCE_STATUS.IN_PROGRESS,

      assignedTo:
        assignedTo.trim(),

      landlordResponse:
        landlordResponse.trim(),

      workStartedOn:
        new Date().toLocaleString(
          "en-IN"
        ),
    });

    toast.success(
      "Maintenance request marked as in progress."
    );
  };

  const saveWorkUpdate = (
    requestId
  ) => {
    if (
      landlordResponse
        .trim().length < 5
    ) {
      toast.error(
        "Enter an update of at least 5 characters."
      );

      return;
    }

    updateRequest(requestId, {
      assignedTo:
        assignedTo.trim(),

      landlordResponse:
        landlordResponse.trim(),
    });

    toast.success(
      "Maintenance update saved."
    );
  };

  const markResolved = (
    requestId
  ) => {
    if (
      landlordResponse
        .trim().length < 10
    ) {
      toast.error(
        "Enter a resolution note of at least 10 characters."
      );

      return;
    }

    updateRequest(requestId, {
      status:
        MAINTENANCE_STATUS.RESOLVED,

      assignedTo:
        assignedTo.trim(),

      landlordResponse:
        landlordResponse.trim(),

      resolutionNote:
        landlordResponse.trim(),

      resolvedOn:
        new Date().toLocaleString(
          "en-IN"
        ),
    });

    closeDetails();

    toast.success(
      "Maintenance request marked as resolved."
    );
  };

  const rejectRequest = (
    requestId
  ) => {
    if (
      landlordResponse
        .trim().length < 10
    ) {
      toast.error(
        "Enter a rejection reason of at least 10 characters."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Reject this maintenance request?"
      );

    if (!confirmed) {
      return;
    }

    updateRequest(requestId, {
      status:
        MAINTENANCE_STATUS.REJECTED,

      landlordResponse:
        landlordResponse.trim(),

      rejectionReason:
        landlordResponse.trim(),

      rejectedOn:
        new Date().toLocaleString(
          "en-IN"
        ),
    });

    closeDetails();

    toast.success(
      "Maintenance request rejected."
    );
  };

  const resetFilters = () => {
    setActiveTab("ALL");
    setCategoryFilter("ALL");
    setPriorityFilter("ALL");
    setSearch("");
  };

  const getCategoryIcon = (
    issueType
  ) => {
    const category =
      normalizeCategory(issueType);

    if (
      category === "ELECTRICAL"
    ) {
      return <FaBolt />;
    }

    if (
      category === "PLUMBING" ||
      category ===
        "WATER_LEAKAGE"
    ) {
      return <FaWrench />;
    }

    if (
      category ===
      "STRUCTURAL_DAMAGE"
    ) {
      return <FaShieldAlt />;
    }

    return <FaTools />;
  };

  const getStatusIcon = (
    status
  ) => {
    if (
      status ===
      MAINTENANCE_STATUS.RESOLVED
    ) {
      return <FaCheckCircle />;
    }

    if (
      [
        MAINTENANCE_STATUS.REJECTED,
        MAINTENANCE_STATUS.CANCELLED,
      ].includes(status)
    ) {
      return <FaTimesCircle />;
    }

    if (
      status ===
      MAINTENANCE_STATUS.IN_PROGRESS
    ) {
      return <FaTools />;
    }

    return <FaClock />;
  };

  return (
    <div className="landlord-maintenance-page">
      <motion.section
        className="landlord-maintenance-header"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div>
          <span className="landlord-maintenance-eyebrow">
            Property support
          </span>

          <h1>
            Maintenance requests
          </h1>

          <p>
            Review tenant-reported
            problems, assign repair work
            and maintain a complete
            resolution history.
          </p>
        </div>

        <div className="landlord-maintenance-header-icon">
          <FaTools />
        </div>
      </motion.section>

      <section className="maintenance-summary-grid">
        <article className="maintenance-summary-card">
          <div className="maintenance-summary-top">
            <span>
              Total Requests
            </span>

            <div className="maintenance-summary-icon total">
              <FaTools />
            </div>
          </div>

          <strong>
            {summary.total}
          </strong>

          <small>
            All maintenance reports
          </small>
        </article>

        <article className="maintenance-summary-card">
          <div className="maintenance-summary-top">
            <span>Pending</span>

            <div className="maintenance-summary-icon open">
              <FaExclamationTriangle />
            </div>
          </div>

          <strong>
            {summary.pending}
          </strong>

          <small>
            Waiting for landlord action
          </small>
        </article>

        <article className="maintenance-summary-card">
          <div className="maintenance-summary-top">
            <span>
              In Progress
            </span>

            <div className="maintenance-summary-icon progress">
              <FaClock />
            </div>
          </div>

          <strong>
            {summary.inProgress}
          </strong>

          <small>
            Repairs currently underway
          </small>
        </article>

        <article className="maintenance-summary-card">
          <div className="maintenance-summary-top">
            <span>
              Resolved
            </span>

            <div className="maintenance-summary-icon resolved">
              <FaCheckCircle />
            </div>
          </div>

          <strong>
            {summary.resolved}
          </strong>

          <small>
            Successfully completed
          </small>
        </article>

        <article className="maintenance-summary-card">
          <div className="maintenance-summary-top">
            <span>
              Rejected
            </span>

            <div className="maintenance-summary-icon rejected">
              <FaTimesCircle />
            </div>
          </div>

          <strong>
            {summary.rejected}
          </strong>

          <small>
            Declined maintenance reports
          </small>
        </article>
      </section>

      {summary.urgent > 0 && (
        <section className="maintenance-urgent-banner">
          <FaExclamationTriangle />

          <div>
            <strong>
              {summary.urgent} urgent
              request
              {summary.urgent === 1
                ? ""
                : "s"}{" "}
              require attention
            </strong>

            <span>
              Review urgent safety or
              property issues as soon as
              possible.
            </span>
          </div>
        </section>
      )}

      <section className="landlord-maintenance-content">
        <div className="landlord-maintenance-toolbar">
          <div className="maintenance-status-tabs">
            {statusTabs.map(
              (tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={
                    activeTab ===
                    tab.value
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTab(
                      tab.value
                    )
                  }
                >
                  {tab.label}
                </button>
              )
            )}
          </div>

          <div className="maintenance-toolbar-controls">
            <div className="maintenance-search">
              <FaSearch />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search request, property or issue"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              aria-label="Filter maintenance category"
            >
              {categoryOptions.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "ALL"
                      ? "All categories"
                      : formatLabel(
                          category
                        )}
                  </option>
                )
              )}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
              aria-label="Filter maintenance priority"
            >
              {priorityOptions.map(
                (priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority === "ALL"
                      ? "All priorities"
                      : formatLabel(
                          priority
                        )}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              className="maintenance-reset-button"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="maintenance-result-heading">
          <div>
            <span>
              Issue directory
            </span>

            <h2>
              {activeTab === "ALL"
                ? "All maintenance requests"
                : `${formatLabel(
                    activeTab
                  )} requests`}
            </h2>
          </div>

          <p>
            {filteredRequests.length}{" "}
            result
            {filteredRequests.length ===
            1
              ? ""
              : "s"}{" "}
            found
          </p>
        </div>

        <div className="maintenance-request-grid">
          {filteredRequests.map(
            (request, index) => (
              <motion.article
                key={request.id}
                className={`maintenance-request-card priority-${String(
                  request.priority
                ).toLowerCase()}`}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.04,
                }}
              >
                <div className="maintenance-property-image">
                  {request.propertyImage ? (
                    <img
                      src={
                        request.propertyImage
                      }
                      alt={
                        request.propertyTitle
                      }
                    />
                  ) : (
                    <div className="maintenance-property-image-placeholder">
                      <FaImage />
                    </div>
                  )}

                  <span
                    className={`maintenance-status ${String(
                      request.status
                    )
                      .toLowerCase()
                      .replaceAll(
                        "_",
                        "-"
                      )}`}
                  >
                    {getStatusIcon(
                      request.status
                    )}

                    {formatLabel(
                      request.status
                    )}
                  </span>

                  <span
                    className={`maintenance-priority ${String(
                      request.priority
                    ).toLowerCase()}`}
                  >
                    {request.priority}
                  </span>
                </div>

                <div className="maintenance-request-body">
                  <div className="maintenance-request-reference">
                    <span>
                      {request.id}
                    </span>

                    <span>
                      {getCategoryIcon(
                        request.issueType
                      )}

                      {formatLabel(
                        normalizeCategory(
                          request.issueType
                        )
                      )}
                    </span>
                  </div>

                  <h3>
                    {request.title}
                  </h3>

                  <p className="maintenance-property-location">
                    <FaMapMarkerAlt />

                    {
                      request.propertyTitle
                    }
                    , {request.locality},{" "}
                    {request.city}
                  </p>

                  <p className="maintenance-description-preview">
                    {
                      request.description
                    }
                  </p>

                  <div className="maintenance-tenant-row">
                    <div>
                      <FaUser />
                    </div>

                    <span>
                      Reported by

                      <strong>
                        RentSphere Tenant
                      </strong>
                    </span>
                  </div>

                  <div className="maintenance-date-grid">
                    <div>
                      <span>
                        Reported on
                      </span>

                      <strong>
                        {
                          request.createdOn
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Preferred visit
                      </span>

                      <strong>
                        {request.preferredVisitDate ||
                          "Not specified"}
                      </strong>
                    </div>
                  </div>

                  {request.assignedTo && (
                    <div className="maintenance-assigned-preview">
                      <FaUserCog />

                      <div>
                        <span>
                          Assigned to
                        </span>

                        <strong>
                          {
                            request.assignedTo
                          }
                        </strong>
                      </div>
                    </div>
                  )}

                  {request.status ===
                    MAINTENANCE_STATUS.RESOLVED &&
                    request.landlordResponse && (
                      <div className="maintenance-resolution-preview">
                        <FaCheckCircle />

                        <div>
                          <strong>
                            Resolution
                          </strong>

                          <p>
                            {
                              request.landlordResponse
                            }
                          </p>
                        </div>
                      </div>
                    )}

                  <button
                    type="button"
                    className="maintenance-view-button"
                    onClick={() =>
                      openDetails(
                        request
                      )
                    }
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </motion.article>
            )
          )}

          {filteredRequests.length ===
            0 && (
            <div className="maintenance-empty-state">
              <FaTools />

              <h3>
                No maintenance requests
                found
              </h3>

              <p>
                Try changing the selected
                filters or search text.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedRequest && (
        <div
          className="maintenance-modal-backdrop"
          onMouseDown={
            closeDetails
          }
        >
          <div
            className="maintenance-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="maintenance-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="maintenance-modal-close"
              onClick={
                closeDetails
              }
              aria-label="Close maintenance details"
            >
              <FaTimes />
            </button>

            <div className="maintenance-modal-header">
              {selectedRequest.propertyImage ? (
                <img
                  src={
                    selectedRequest.propertyImage
                  }
                  alt={
                    selectedRequest.propertyTitle
                  }
                />
              ) : (
                <div className="maintenance-modal-image-placeholder">
                  <FaImage />
                </div>
              )}

              <div>
                <div className="maintenance-modal-reference">
                  <span>
                    {
                      selectedRequest.id
                    }
                  </span>

                  <span>
                    {getCategoryIcon(
                      selectedRequest.issueType
                    )}

                    {formatLabel(
                      normalizeCategory(
                        selectedRequest.issueType
                      )
                    )}
                  </span>
                </div>

                <h2 id="maintenance-modal-title">
                  {
                    selectedRequest.title
                  }
                </h2>

                <p>
                  <FaMapMarkerAlt />

                  {
                    selectedRequest.propertyTitle
                  }
                  ,{" "}
                  {
                    selectedRequest.locality
                  }
                  ,{" "}
                  {
                    selectedRequest.city
                  }
                </p>
              </div>

              <div className="maintenance-modal-badges">
                <span
                  className={`maintenance-status ${String(
                    selectedRequest.status
                  )
                    .toLowerCase()
                    .replaceAll(
                      "_",
                      "-"
                    )}`}
                >
                  {getStatusIcon(
                    selectedRequest.status
                  )}

                  {formatLabel(
                    selectedRequest.status
                  )}
                </span>

                <span
                  className={`maintenance-priority ${String(
                    selectedRequest.priority
                  ).toLowerCase()}`}
                >
                  {
                    selectedRequest.priority
                  }
                </span>
              </div>
            </div>

            <div className="maintenance-modal-body">
              <section className="maintenance-tenant-card">
                <div className="maintenance-tenant-icon">
                  <FaUser />
                </div>

                <div>
                  <span>
                    Tenant details
                  </span>

                  <h3>
                    RentSphere Tenant
                  </h3>

                  <p>
                    <FaEnvelope />
                    Tenant email will come
                    from authentication API
                  </p>

                  <p>
                    <FaPhoneAlt />
                    Tenant phone will come
                    from profile API
                  </p>
                </div>
              </section>

              <section className="maintenance-detail-grid">
                <div>
                  <FaTools />

                  <span>
                    Category
                  </span>

                  <strong>
                    {formatLabel(
                      normalizeCategory(
                        selectedRequest.issueType
                      )
                    )}
                  </strong>
                </div>

                <div>
                  <FaExclamationTriangle />

                  <span>
                    Priority
                  </span>

                  <strong>
                    {
                      selectedRequest.priority
                    }
                  </strong>
                </div>

                <div>
                  <FaClock />

                  <span>
                    Reported on
                  </span>

                  <strong>
                    {
                      selectedRequest.createdOn
                    }
                  </strong>
                </div>

                <div>
                  <FaClock />

                  <span>
                    Preferred visit
                  </span>

                  <strong>
                    {selectedRequest.preferredVisitDate ||
                      "Not specified"}
                  </strong>
                </div>
              </section>

              <section className="maintenance-description-section">
                <h3>
                  Issue description
                </h3>

                <p>
                  {
                    selectedRequest.description
                  }
                </p>
              </section>

              {selectedRequest.image && (
                <section className="maintenance-issue-image-section">
                  <h3>
                    Tenant-uploaded image
                  </h3>

                  <img
                    src={
                      selectedRequest.image
                    }
                    alt={
                      selectedRequest.title
                    }
                  />
                </section>
              )}

              {selectedRequest.status !==
                MAINTENANCE_STATUS.RESOLVED &&
                selectedRequest.status !==
                  MAINTENANCE_STATUS.REJECTED &&
                selectedRequest.status !==
                  MAINTENANCE_STATUS.CANCELLED && (
                  <>
                    <section className="maintenance-assignment-form">
                      <label htmlFor="maintenanceAssignedTo">
                        Assigned technician or
                        service person
                      </label>

                      <input
                        id="maintenanceAssignedTo"
                        type="text"
                        value={
                          assignedTo
                        }
                        onChange={(event) =>
                          setAssignedTo(
                            event.target.value
                          )
                        }
                        placeholder="Example: ABC Plumbing Service"
                      />
                    </section>

                    <section className="maintenance-resolution-form">
                      <label htmlFor="maintenanceResolutionNote">
                        Landlord response or
                        work update
                      </label>

                      <textarea
                        id="maintenanceResolutionNote"
                        rows="5"
                        value={
                          landlordResponse
                        }
                        onChange={(event) =>
                          setLandlordResponse(
                            event.target.value
                          )
                        }
                        placeholder="Explain the technician visit, progress, rejection reason or final resolution."
                      />
                    </section>
                  </>
                )}

              {selectedRequest.status ===
                MAINTENANCE_STATUS.RESOLVED && (
                <section className="maintenance-resolved-box">
                  <FaCheckCircle />

                  <div>
                    <strong>
                      Request resolved
                    </strong>

                    <p>
                      {
                        selectedRequest.landlordResponse
                      }
                    </p>

                    <span>
                      Resolved on{" "}
                      {
                        selectedRequest.resolvedOn
                      }
                    </span>
                  </div>
                </section>
              )}

              {selectedRequest.status ===
                MAINTENANCE_STATUS.REJECTED && (
                <section className="maintenance-rejected-box">
                  <FaTimesCircle />

                  <div>
                    <strong>
                      Request rejected
                    </strong>

                    <p>
                      {
                        selectedRequest.landlordResponse
                      }
                    </p>
                  </div>
                </section>
              )}

              {selectedRequest.status ===
                MAINTENANCE_STATUS.CANCELLED && (
                <section className="maintenance-rejected-box">
                  <FaTimesCircle />

                  <div>
                    <strong>
                      Request cancelled by
                      tenant
                    </strong>

                    <p>
                      No further action is
                      required.
                    </p>
                  </div>
                </section>
              )}

              <div className="maintenance-modal-actions">
                {selectedRequest.status ===
                  MAINTENANCE_STATUS.PENDING && (
                  <button
                    type="button"
                    className="maintenance-start-action"
                    onClick={() =>
                      startWork(
                        selectedRequest.id
                      )
                    }
                  >
                    <FaClock />
                    Start Work
                  </button>
                )}

                {selectedRequest.status ===
                  MAINTENANCE_STATUS.IN_PROGRESS && (
                  <button
                    type="button"
                    className="maintenance-start-action"
                    onClick={() =>
                      saveWorkUpdate(
                        selectedRequest.id
                      )
                    }
                  >
                    <FaTools />
                    Save Update
                  </button>
                )}

                {[
                  MAINTENANCE_STATUS.PENDING,
                  MAINTENANCE_STATUS.IN_PROGRESS,
                ].includes(
                  selectedRequest.status
                ) && (
                  <button
                    type="button"
                    className="maintenance-resolve-action"
                    onClick={() =>
                      markResolved(
                        selectedRequest.id
                      )
                    }
                  >
                    <FaCheckCircle />
                    Mark as Resolved
                  </button>
                )}

                {selectedRequest.status ===
                  MAINTENANCE_STATUS.PENDING && (
                  <button
                    type="button"
                    className="maintenance-reject-action"
                    onClick={() =>
                      rejectRequest(
                        selectedRequest.id
                      )
                    }
                  >
                    <FaTimesCircle />
                    Reject Request
                  </button>
                )}

                <button
                  type="button"
                  className="maintenance-dismiss-action"
                  onClick={
                    closeDetails
                  }
                >
                  <FaTimes />
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenance;