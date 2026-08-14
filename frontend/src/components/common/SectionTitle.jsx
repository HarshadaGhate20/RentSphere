import React from "react";

const SectionTitle = ({
  title,
  subtitle,
  center = true
}) => {
  return (
    <div className={`mb-5 ${center ? "text-center" : ""}`}>
      <h2 className="fw-bold">{title}</h2>

      {subtitle && (
        <p className="text-muted mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;