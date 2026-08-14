import React from "react";
import "../../assets/css/card.css";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`custom-card ${className}`}>
      {children}
    </div>
  );
};

export default Card;