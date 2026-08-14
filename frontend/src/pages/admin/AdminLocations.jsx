import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaBuilding,
  FaCheckCircle,
  FaCity,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import "../../assets/css/adminLocations.css";
import { getAllPropertiesForAdmin } from "../../services/propertyApi";

const initialLocations = [
  {
    id: 1,
    city: "Mumbai",
    state: "Maharashtra",
    area: "Andheri West",
    pinCode: "400053",
    propertyCount: 325,
    status: "ACTIVE",
  },
  {
    id: 2,
    city: "Pune",
    state: "Maharashtra",
    area: "Hinjewadi",
    pinCode: "411057",
    propertyCount: 184,
    status: "ACTIVE",
  },
  {
    id: 3,
    city: "Navi Mumbai",
    state: "Maharashtra",
    area: "Vashi",
    pinCode: "400703",
    propertyCount: 146,
    status: "ACTIVE",
  },
  {
    id: 4,
    city: "Thane",
    state: "Maharashtra",
    area: "Ghodbunder Road",
    pinCode: "400607",
    propertyCount: 98,
    status: "INACTIVE",
  },
  {
    id: 5,
    city: "Mumbai",
    state: "Maharashtra",
    area: "Powai",
    pinCode: "400076",
    propertyCount: 212,
    status: "ACTIVE",
  },
];

const emptyForm = {
  city: "",
  state: "",
  area: "",
  pinCode: "",
  status: "ACTIVE",
};

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAllPropertiesForAdmin().then((properties) => {
      const grouped = new Map();
      (Array.isArray(properties) ? properties : []).forEach((property) => {
        const key = `${property.city || "Unknown"}|${property.state || ""}|${property.area || ""}|${property.pinCode || ""}`;
        const current = grouped.get(key) || { id: key, city: property.city || "Unknown", state: property.state || "", area: property.area || "", pinCode: property.pinCode || "", propertyCount: 0, status: "ACTIVE" };
        current.propertyCount += 1;
        grouped.set(key, current);
      });
      setLocations([...grouped.values()]);
    }).catch((error) => toast.error(error.message));
  }, []);

  const summary = useMemo(() => {
    return {
      total: locations.length,
      active: locations.filter(
        (location) => location.status === "ACTIVE"
      ).length,
      inactive: locations.filter(
        (location) => location.status === "INACTIVE"
      ).length,
      properties: locations.reduce(
        (total, location) => total + location.propertyCount,
        0
      ),
    };
  }, [locations]);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return locations.filter((location) => {
      const matchesSearch =
        !query ||
        `${location.city} ${location.state} ${location.area} ${location.pinCode}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" || location.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [locations, search, statusFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const validateForm = () => {
    if (!form.city.trim()) {
      toast.error("City is required.");
      return false;
    }

    if (!form.state.trim()) {
      toast.error("State is required.");
      return false;
    }

    if (!form.area.trim()) {
      toast.error("Area or locality is required.");
      return false;
    }

    if (!/^\d{6}$/.test(form.pinCode)) {
      toast.error("PIN code must contain exactly 6 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingId) {
      setLocations((currentLocations) =>
        currentLocations.map((location) =>
          location.id === editingId
            ? {
                ...location,
                ...form,
              }
            : location
        )
      );

      toast.success("Location updated successfully.");
    } else {
      const newLocation = {
        id: Date.now(),
        ...form,
        propertyCount: 0,
      };

      setLocations((currentLocations) => [
        newLocation,
        ...currentLocations,
      ]);

      toast.success("Location added successfully.");
    }

    resetForm();
  };

  const handleEdit = (location) => {
    setEditingId(location.id);

    setForm({
      city: location.city,
      state: location.state,
      area: location.area,
      pinCode: location.pinCode,
      status: location.status,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (location) => {
    const confirmed = window.confirm(
      `Delete ${location.area}, ${location.city}?`
    );

    if (!confirmed) {
      return;
    }

    setLocations((currentLocations) =>
      currentLocations.filter(
        (currentLocation) => currentLocation.id !== location.id
      )
    );

    toast.success("Location deleted successfully.");
  };

  const toggleStatus = (id) => {
    setLocations((currentLocations) =>
      currentLocations.map((location) =>
        location.id === id
          ? {
              ...location,
              status:
                location.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : location
      )
    );

    toast.success("Location status updated.");
  };

  return (
    <div className="locations-page">
      <motion.section
        className="locations-header"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="locations-eyebrow">
            Location management
          </span>

          <h1>Manage service locations</h1>

          <p>
            Configure cities and localities where landlords can list
            rental properties and PG accommodations.
          </p>
        </div>

        <button
          type="button"
          className="locations-add-button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm((currentValue) => !currentValue);
          }}
        >
          {showForm ? <FaTimes /> : <FaPlus />}

          {showForm ? "Close form" : "Add location"}
        </button>
      </motion.section>

      <section className="locations-summary-grid">
        <motion.article
          className="location-summary-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="location-summary-icon icon-blue">
            <FaMapMarkerAlt />
          </span>

          <div>
            <span>Total locations</span>
            <strong>{summary.total}</strong>
            <small>Configured areas</small>
          </div>
        </motion.article>

        <motion.article
          className="location-summary-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <span className="location-summary-icon icon-green">
            <FaCheckCircle />
          </span>

          <div>
            <span>Active locations</span>
            <strong>{summary.active}</strong>
            <small>Available for listings</small>
          </div>
        </motion.article>

        <motion.article
          className="location-summary-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="location-summary-icon icon-orange">
            <FaCity />
          </span>

          <div>
            <span>Inactive locations</span>
            <strong>{summary.inactive}</strong>
            <small>Temporarily unavailable</small>
          </div>
        </motion.article>

        <motion.article
          className="location-summary-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span className="location-summary-icon icon-purple">
            <FaBuilding />
          </span>

          <div>
            <span>Listed properties</span>
            <strong>
              {summary.properties.toLocaleString("en-IN")}
            </strong>
            <small>Across all locations</small>
          </div>
        </motion.article>
      </section>

      {showForm && (
        <motion.section
          className="location-form-card"
          initial={{ opacity: 0, height: 0, y: -12 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="location-card-heading">
            <div>
              <span className="locations-eyebrow">
                {editingId ? "Edit location" : "New location"}
              </span>

              <h2>
                {editingId
                  ? "Update location information"
                  : "Add a service location"}
              </h2>

              <p>
                This location will become available in property listing
                and search forms.
              </p>
            </div>

            <button
              type="button"
              className="location-close-button"
              onClick={resetForm}
              aria-label="Close form"
            >
              <FaTimes />
            </button>
          </div>

          <form className="location-form" onSubmit={handleSubmit}>
            <div className="location-form-group">
              <label htmlFor="city">City</label>

              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="Example: Mumbai"
                autoComplete="address-level2"
              />
            </div>

            <div className="location-form-group">
              <label htmlFor="state">State</label>

              <input
                id="state"
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                placeholder="Example: Maharashtra"
                autoComplete="address-level1"
              />
            </div>

            <div className="location-form-group">
              <label htmlFor="area">Area or locality</label>

              <input
                id="area"
                name="area"
                type="text"
                value={form.area}
                onChange={handleChange}
                placeholder="Example: Andheri West"
              />
            </div>

            <div className="location-form-group">
              <label htmlFor="pinCode">PIN code</label>

              <input
                id="pinCode"
                name="pinCode"
                type="text"
                maxLength="6"
                value={form.pinCode}
                onChange={(event) => {
                  const numericValue = event.target.value.replace(
                    /\D/g,
                    ""
                  );

                  setForm((currentForm) => ({
                    ...currentForm,
                    pinCode: numericValue,
                  }));
                }}
                placeholder="Example: 400053"
                inputMode="numeric"
              />
            </div>

            <div className="location-form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="location-form-actions">
              <button
                type="submit"
                className="location-save-button"
              >
                <FaCheckCircle />

                {editingId ? "Update location" : "Save location"}
              </button>

              <button
                type="button"
                className="location-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.section>
      )}

      <motion.section
        className="locations-table-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <div className="locations-toolbar">
          <div>
            <span className="locations-eyebrow">
              Registered areas
            </span>

            <h2>Available locations</h2>

            <p>
              {filteredLocations.length} of {locations.length} locations
              displayed
            </p>
          </div>

          <div className="locations-toolbar-controls">
            <div className="locations-search-box">
              <FaSearch />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search city, area or PIN code"
              />
            </div>

            <select
              className="locations-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter locations by status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="locations-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>State</th>
                <th>PIN code</th>
                <th>Properties</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLocations.map((location) => (
                <tr key={location.id}>
                  <td>
                    <div className="location-name-cell">
                      <span className="location-row-icon">
                        <FaMapMarkerAlt />
                      </span>

                      <div>
                        <strong>{location.area}</strong>
                        <span>{location.city}</span>
                      </div>
                    </div>
                  </td>

                  <td>{location.state}</td>

                  <td>
                    <span className="location-pin">
                      {location.pinCode}
                    </span>
                  </td>

                  <td>
                    <div className="location-property-count">
                      <FaBuilding />
                      <strong>{location.propertyCount}</strong>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`location-status-button ${
                        location.status === "ACTIVE"
                          ? "location-active"
                          : "location-inactive"
                      }`}
                      onClick={() => toggleStatus(location.id)}
                      title="Click to change status"
                    >
                      <span />
                      {location.status}
                    </button>
                  </td>

                  <td>
                    <div className="location-row-actions">
                      <button
                        type="button"
                        className="location-action-button edit-action"
                        onClick={() => handleEdit(location)}
                        aria-label={`Edit ${location.area}`}
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="location-action-button delete-action"
                        onClick={() => handleDelete(location)}
                        aria-label={`Delete ${location.area}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLocations.length === 0 && (
                <tr>
                  <td colSpan="6" className="locations-empty-state">
                    <FaMapMarkerAlt />

                    <h3>No locations found</h3>

                    <p>
                      Try another search term or change the selected
                      status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
};

export default AdminLocations;
