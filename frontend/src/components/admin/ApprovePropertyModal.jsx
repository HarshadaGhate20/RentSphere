import React from "react";
import {
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

const ApprovePropertyModal = ({
  property,
  onClose,
  onConfirm,
}) => {
  if (!property) {
    return null;
  }

  return (
    <div className="property-modal-backdrop" onMouseDown={onClose}>
      <div
        className="property-action-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="property-modal-close"
          onClick={onClose}
          aria-label="Close approval modal"
        >
          <FaTimes />
        </button>

        <div className="property-action-icon approve">
          <FaCheckCircle />
        </div>

        <h2>Approve property?</h2>

        <p>
          <strong>{property.title}</strong> will become visible to
          tenants after approval.
        </p>

        <div className="property-action-buttons">
          <button
            type="button"
            className="property-action-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="property-action-confirm-approve"
            onClick={() => onConfirm(property.id)}
          >
            Approve property
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovePropertyModal;