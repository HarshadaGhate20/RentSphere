import React from "react";

const FilterBar = ({
  search,
  setSearch,
  type,
  setType,
  sort,
  setSort
}) => {
  return (
    <div className="row g-3 mb-4">

      <div className="col-lg-4">

        <input
          className="form-control"
          placeholder="Search property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="col-lg-3">

        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >

          <option value="">All Types</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>PG</option>

        </select>

      </div>

      <div className="col-lg-3">

        <select
          className="form-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >

          <option value="">Sort By</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>

        </select>

      </div>

    </div>
  );
};

export default FilterBar;