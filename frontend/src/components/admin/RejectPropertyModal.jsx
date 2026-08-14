import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

const rejectionReasons = [
  "Incomplete property information",
  "Invalid landlord documents",
  "Property images are unclear",
  "Incorrect rent or deposit details",
  "Duplicate property listing",
  "Property violates listing guidelines",
  "Other",
];

const RejectPropertyModal = ({
  property,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

  if (!property) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!reason) {
      toast.error("Please select a rejection reason.");
      return;
    }

    if (reason === "Other" && !comments.trim()) {
      toast.error("Please enter rejection comments.");
      return;
    }

    onConfirm(property.id, {
      reason,
      comments: comments.trim(),
    });
  };

  return (
    <div className="property-modal-backdrop" onMouseDown={onClose}>
      <div
        className="property-action-modal reject-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="property-modal-close"
          onClick={onClose}
          aria-label="Close rejection modal"
        >
          <FaTimes />
        </button>

        <div className="property-action-icon reject">
          <FaExclamationTriangle />
        </div>

        <h2>Reject property</h2>

        <p>
          Enter the reason for rejecting{" "}
          <strong>{property.title}</strong>.
        </p>

        <form className="property-reject-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="rejectionReason">Reason</label>

            <select
              id="rejectionReason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              <option value="">Select a reason</option>

              {rejectionReasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rejectionComments">
              Additional comments
            </label>

            <textarea
              id="rejectionComments"
              rows="4"
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Explain what the landlord must correct..."
            />
          </div>

          <div className="property-action-buttons">
            <button
              type="button"
              className="property-action-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="property-action-confirm-reject"
            >
              Reject property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectPropertyModal;