import React from "react";
import {
  FaBuilding,
  FaCity,
  FaFilter,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

const PropertyFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  city,
  setCity,
  type,
  setType,
  cities,
  propertyTypes,
  resultCount,
  totalCount,
  onReset,
}) => {
  return (
    <section className="property-filter-card">
      <div className="property-filter-heading">
        <div>
          <span className="property-filter-eyebrow">
            <FaFilter />
            Search and filters
          </span>

          <h2>Find property submissions</h2>

          <p>
            Showing {resultCount} of {totalCount} properties
          </p>
        </div>

        <button
          type="button"
          className="property-reset-button"
          onClick={onReset}
        >
          <FaSyncAlt />
          Reset filters
        </button>
      </div>

      <div className="property-filter-grid">
        <div className="property-search-field">
          <FaSearch />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search property, landlord, city or area"
            aria-label="Search properties"
          />
        </div>

        <div className="property-select-field">
          <FaFilter />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="property-select-field">
          <FaCity />

          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-label="Filter by city"
          >
            <option value="ALL">All cities</option>

            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        <div className="property-select-field">
          <FaBuilding />

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            aria-label="Filter by property type"
          >
            <option value="ALL">All property types</option>

            {propertyTypes.map((propertyType) => (
              <option key={propertyType} value={propertyType}>
                {propertyType}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default PropertyFilters;