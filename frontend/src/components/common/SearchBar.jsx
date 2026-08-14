import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search..."
}) => {
  return (
    <div className="input-group">

      <span className="input-group-text bg-primary text-white">

        <FaSearch />

      </span>

      <input
        className="form-control"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />

    </div>
  );
};

export default SearchBar;