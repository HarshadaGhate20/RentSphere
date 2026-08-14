import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { toast } from "react-toastify";

import {
  FaAddressCard,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCamera,
  FaCheckCircle,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileAlt,
  FaHome,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaReceipt,
  FaSave,
  FaShieldAlt,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";

import {
  getTenantBookings,
} from "../../utils/tenantBookings";

import {
  getName,
} from "../../utils/auth";

import { getCurrentUser } from "../../services/adminApi";

import "../../assets/css/tenantProfile.css";

const TENANT_PROFILE_STORAGE_KEY =
  "rentsphere_tenant_profile";

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  occupation: "",
  aadhaarNumber: "",
  panNumber: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  profileImage: "",
  aadhaarDocumentName: "",
  panDocumentName: "",
  profileCompleted: false,
};

const readTenantProfile = () => {
  try {
    const stored = localStorage.getItem(
      TENANT_PROFILE_STORAGE_KEY
    );

    if (!stored) {
      return {
        ...defaultProfile,
        fullName:
          getName() ||
          "RentSphere Tenant",
      };
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultProfile,
      ...parsed,
    };
  } catch (error) {
    console.error(
      "Unable to read tenant profile:",
      error
    );

    return {
      ...defaultProfile,
      fullName:
        getName() ||
        "RentSphere Tenant",
    };
  }
};

const saveTenantProfile = (
  profile
) => {
  localStorage.setItem(
    TENANT_PROFILE_STORAGE_KEY,
    JSON.stringify(profile)
  );
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString(
    "en-IN"
  )}`;

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const maskAadhaar = (value) => {
  const digits = String(value || "")
    .replace(/\D/g, "");

  if (digits.length < 4) {
    return "Not provided";
  }

  return `XXXX XXXX ${digits.slice(-4)}`;
};

const maskPan = (value) => {
  const pan = String(value || "")
    .trim()
    .toUpperCase();

  if (pan.length < 4) {
    return "Not provided";
  }

  return `${pan.slice(0, 2)}*****${pan.slice(-3)}`;
};

const TenantProfile = () => {
  const imageInputRef =
    useRef(null);

  const aadhaarInputRef =
    useRef(null);

  const panInputRef =
    useRef(null);

  const [profile, setProfile] =
    useState(() =>
      readTenantProfile()
    );

  const [formData, setFormData] =
    useState(() =>
      readTenantProfile()
    );

  const [isEditing, setIsEditing] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [bookings, setBookings] =
    useState(() =>
      getTenantBookings()
    );

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        const databaseProfile = {
          ...readTenantProfile(),
          fullName: user.fullName || user.name || getName() || "RentSphere Tenant",
          email: user.email || "",
          phone: user.phone || "",
        };
        setProfile(databaseProfile);
        setFormData(databaseProfile);
        saveTenantProfile(databaseProfile);
        if (user.email) localStorage.setItem("email", user.email);
        if (user.phone) localStorage.setItem("phone", user.phone);
      })
      .catch((profileError) => console.error("Unable to load tenant database profile:", profileError));

    const refreshData = () => {
      setBookings(
        getTenantBookings()
      );
    };

    window.addEventListener(
      "focus",
      refreshData
    );

    window.addEventListener(
      "storage",
      refreshData
    );

    return () => {
      window.removeEventListener(
        "focus",
        refreshData
      );

      window.removeEventListener(
        "storage",
        refreshData
      );
    };
  }, []);

  const activeRental = useMemo(
    () =>
      bookings.find(
        (booking) =>
          booking.status ===
            "ACTIVE" ||
          booking.paymentStatus ===
            "PAID"
      ) || null,
    [bookings]
  );

  const profileCompletion =
    useMemo(() => {
      const requiredFields = [
        profile.fullName,
        profile.email,
        profile.phone,
        profile.dateOfBirth,
        profile.gender,
        profile.occupation,
        profile.addressLine,
        profile.city,
        profile.state,
        profile.postalCode,
        profile.emergencyContactName,
        profile.emergencyContactPhone,
      ];

      const completed =
        requiredFields.filter(Boolean)
          .length;

      return Math.round(
        (completed /
          requiredFields.length) *
          100
      );
    }, [profile]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setErrors(
      (current) => ({
        ...current,
        [name]: "",
      })
    );
  };

  const validateForm = () => {
    const nextErrors = {};

    if (
      !formData.fullName.trim()
    ) {
      nextErrors.fullName =
        "Full name is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        formData.phone
      )
    ) {
      nextErrors.phone =
        "Enter a valid 10-digit mobile number.";
    }

    if (!formData.dateOfBirth) {
      nextErrors.dateOfBirth =
        "Date of birth is required.";
    }

    if (!formData.gender) {
      nextErrors.gender =
        "Select gender.";
    }

    if (
      !formData.occupation.trim()
    ) {
      nextErrors.occupation =
        "Occupation is required.";
    }

    if (
      !formData.addressLine.trim()
    ) {
      nextErrors.addressLine =
        "Address is required.";
    }

    if (!formData.city.trim()) {
      nextErrors.city =
        "City is required.";
    }

    if (!formData.state.trim()) {
      nextErrors.state =
        "State is required.";
    }

    if (
      !/^\d{6}$/.test(
        formData.postalCode
      )
    ) {
      nextErrors.postalCode =
        "Enter a valid 6-digit postal code.";
    }

    if (
      formData.aadhaarNumber &&
      !/^\d{12}$/.test(
        formData.aadhaarNumber
      )
    ) {
      nextErrors.aadhaarNumber =
        "Aadhaar must contain 12 digits.";
    }

    if (
      formData.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
        formData.panNumber.toUpperCase()
      )
    ) {
      nextErrors.panNumber =
        "Enter a valid PAN number.";
    }

    if (
      !formData.emergencyContactName.trim()
    ) {
      nextErrors.emergencyContactName =
        "Emergency contact name is required.";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        formData.emergencyContactPhone
      )
    ) {
      nextErrors.emergencyContactPhone =
        "Enter a valid emergency mobile number.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error(
        "Please correct the highlighted fields."
      );

      return;
    }

    const updatedProfile = {
      ...formData,
      panNumber:
        formData.panNumber.toUpperCase(),
      profileCompleted: true,
      updatedOn:
        new Date().toLocaleString(
          "en-IN"
        ),
    };

    saveTenantProfile(
      updatedProfile
    );

    setProfile(
      updatedProfile
    );

    setFormData(
      updatedProfile
    );

    setIsEditing(false);

    toast.success(
      "Tenant profile updated successfully."
    );
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setErrors({});
    setIsEditing(false);
  };

  const handleProfileImage = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please select an image file."
      );

      return;
    }

    if (
      file.size >
      3 * 1024 * 1024
    ) {
      toast.error(
        "Profile photo must be smaller than 3 MB."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const updated = {
        ...formData,
        profileImage:
          reader.result,
      };

      setFormData(updated);

      if (!isEditing) {
        setProfile(updated);
        saveTenantProfile(updated);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (
    event,
    documentType
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "Upload a PDF, JPG or PNG file."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Document size cannot exceed 5 MB."
      );

      return;
    }

    const fieldName =
      documentType === "AADHAAR"
        ? "aadhaarDocumentName"
        : "panDocumentName";

    setFormData(
      (current) => ({
        ...current,
        [fieldName]: file.name,
      })
    );

    toast.success(
      `${documentType} document selected.`
    );
  };

  const removeDocument = (
    fieldName
  ) => {
    setFormData(
      (current) => ({
        ...current,
        [fieldName]: "",
      })
    );
  };

  return (
    <div className="tenant-profile-page">
      <section className="tenant-profile-header">
        <div>
          <span>
            Account management
          </span>

          <h1>My profile</h1>

          <p>
            Manage your personal,
            contact, identity and
            emergency information.
          </p>
        </div>

        <div className="tenant-profile-header-icon">
          <FaUser />
        </div>
      </section>

      <section className="tenant-profile-completion">
        <div>
          <strong>
            Profile completion
          </strong>

          <span>
            {profileCompletion}%
          </span>
        </div>

        <div className="tenant-profile-progress-track">
          <div
            style={{
              width: `${profileCompletion}%`,
            }}
          />
        </div>

        <p>
          Complete your profile before
          backend verification and lease
          processing.
        </p>
      </section>

      <div className="tenant-profile-layout">
        <aside className="tenant-profile-summary-card">
          <div className="tenant-profile-photo-wrapper">
            {formData.profileImage ? (
              <img
                src={
                  formData.profileImage
                }
                alt={
                  formData.fullName
                }
              />
            ) : (
              <div className="tenant-profile-photo-placeholder">
                <FaUser />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                imageInputRef.current?.click()
              }
              aria-label="Upload profile photo"
            >
              <FaCamera />
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={
                handleProfileImage
              }
            />
          </div>

          <h2>
            {profile.fullName ||
              "RentSphere Tenant"}
          </h2>

          <p>
            <FaEnvelope />

            {profile.email ||
              "Email not provided"}
          </p>

          <p>
            <FaPhoneAlt />

            {profile.phone ||
              "Mobile not provided"}
          </p>

          <span className="tenant-profile-role">
            Tenant account
          </span>

          <div className="tenant-profile-verification">
            <FaShieldAlt />

            <div>
              <strong>
                Identity verification
              </strong>

              <span>
                {profile.aadhaarDocumentName ||
                profile.panDocumentName
                  ? "Documents added"
                  : "Documents pending"}
              </span>
            </div>
          </div>

          {!isEditing ? (
            <button
              type="button"
              className="tenant-profile-edit-button"
              onClick={() =>
                setIsEditing(true)
              }
            >
              <FaEdit />
              Edit Profile
            </button>
          ) : (
            <div className="tenant-profile-edit-actions">
              <button
                type="button"
                onClick={handleSave}
              >
                <FaSave />
                Save
              </button>

              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}
        </aside>

        <main className="tenant-profile-main">
          <section className="tenant-profile-section">
            <div className="tenant-profile-section-heading">
              <div>
                <FaAddressCard />
              </div>

              <span>
                <small>
                  Personal details
                </small>

                <strong>
                  Basic information
                </strong>
              </span>
            </div>

            <div className="tenant-profile-form-grid">
              <label>
                Full name *

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.fullName && (
                  <small className="tenant-profile-error">
                    {
                      errors.fullName
                    }
                  </small>
                )}
              </label>

              <label>
                Email address *

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                  placeholder="tenant@example.com"
                />

                {errors.email && (
                  <small className="tenant-profile-error">
                    {errors.email}
                  </small>
                )}
              </label>

              <label>
                Mobile number *

                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                  placeholder="9876543210"
                />

                {errors.phone && (
                  <small className="tenant-profile-error">
                    {errors.phone}
                  </small>
                )}
              </label>

              <label>
                Date of birth *

                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.dateOfBirth && (
                  <small className="tenant-profile-error">
                    {
                      errors.dateOfBirth
                    }
                  </small>
                )}
              </label>

              <label>
                Gender *

                <select
                  name="gender"
                  value={
                    formData.gender
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>

                {errors.gender && (
                  <small className="tenant-profile-error">
                    {errors.gender}
                  </small>
                )}
              </label>

              <label>
                Occupation *

                <div className="tenant-profile-input-with-icon">
                  <FaBriefcase />

                  <input
                    type="text"
                    name="occupation"
                    value={
                      formData.occupation
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditing
                    }
                    placeholder="Software Engineer"
                  />
                </div>

                {errors.occupation && (
                  <small className="tenant-profile-error">
                    {
                      errors.occupation
                    }
                  </small>
                )}
              </label>
            </div>
          </section>

          <section className="tenant-profile-section">
            <div className="tenant-profile-section-heading">
              <div>
                <FaMapMarkerAlt />
              </div>

              <span>
                <small>
                  Address details
                </small>

                <strong>
                  Permanent address
                </strong>
              </span>
            </div>

            <div className="tenant-profile-form-grid">
              <label className="tenant-profile-full-field">
                Address line *

                <textarea
                  name="addressLine"
                  rows="3"
                  value={
                    formData.addressLine
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                  placeholder="House number, building and street"
                />

                {errors.addressLine && (
                  <small className="tenant-profile-error">
                    {
                      errors.addressLine
                    }
                  </small>
                )}
              </label>

              <label>
                City *

                <input
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.city && (
                  <small className="tenant-profile-error">
                    {errors.city}
                  </small>
                )}
              </label>

              <label>
                State *

                <input
                  type="text"
                  name="state"
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.state && (
                  <small className="tenant-profile-error">
                    {errors.state}
                  </small>
                )}
              </label>

              <label>
                Postal code *

                <input
                  type="text"
                  name="postalCode"
                  maxLength="6"
                  value={
                    formData.postalCode
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.postalCode && (
                  <small className="tenant-profile-error">
                    {
                      errors.postalCode
                    }
                  </small>
                )}
              </label>
            </div>
          </section>

          <section className="tenant-profile-section">
            <div className="tenant-profile-section-heading">
              <div>
                <FaIdCard />
              </div>

              <span>
                <small>
                  Identity details
                </small>

                <strong>
                  Verification documents
                </strong>
              </span>
            </div>

            <div className="tenant-profile-form-grid">
              <label>
                Aadhaar number

                <input
                  type="password"
                  name="aadhaarNumber"
                  maxLength="12"
                  value={
                    formData.aadhaarNumber
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                  placeholder="12-digit Aadhaar"
                />

                {errors.aadhaarNumber && (
                  <small className="tenant-profile-error">
                    {
                      errors.aadhaarNumber
                    }
                  </small>
                )}
              </label>

              <label>
                PAN number

                <input
                  type="text"
                  name="panNumber"
                  maxLength="10"
                  value={
                    formData.panNumber
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                  placeholder="ABCDE1234F"
                />

                {errors.panNumber && (
                  <small className="tenant-profile-error">
                    {
                      errors.panNumber
                    }
                  </small>
                )}
              </label>
            </div>

            <div className="tenant-profile-document-grid">
              <article>
                <FaFileAlt />

                <div>
                  <strong>
                    Aadhaar document
                  </strong>

                  <span>
                    {formData.aadhaarDocumentName ||
                      "No file selected"}
                  </span>
                </div>

                {isEditing && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        aadhaarInputRef.current?.click()
                      }
                    >
                      Upload
                    </button>

                    {formData.aadhaarDocumentName && (
                      <button
                        type="button"
                        onClick={() =>
                          removeDocument(
                            "aadhaarDocumentName"
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={
                    aadhaarInputRef
                  }
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleDocumentUpload(
                      event,
                      "AADHAAR"
                    )
                  }
                />
              </article>

              <article>
                <FaFileAlt />

                <div>
                  <strong>
                    PAN document
                  </strong>

                  <span>
                    {formData.panDocumentName ||
                      "No file selected"}
                  </span>
                </div>

                {isEditing && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        panInputRef.current?.click()
                      }
                    >
                      Upload
                    </button>

                    {formData.panDocumentName && (
                      <button
                        type="button"
                        onClick={() =>
                          removeDocument(
                            "panDocumentName"
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={panInputRef}
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    handleDocumentUpload(
                      event,
                      "PAN"
                    )
                  }
                />
              </article>
            </div>

            <div className="tenant-profile-security-note">
              <FaExclamationTriangle />

              <p>
                This frontend demo stores only
                document names. During backend
                integration, identity files must
                be uploaded securely and stored
                outside browser localStorage.
              </p>
            </div>

            {!isEditing && (
              <div className="tenant-profile-masked-documents">
                <div>
                  <span>Aadhaar</span>

                  <strong>
                    {maskAadhaar(
                      profile.aadhaarNumber
                    )}
                  </strong>
                </div>

                <div>
                  <span>PAN</span>

                  <strong>
                    {maskPan(
                      profile.panNumber
                    )}
                  </strong>
                </div>
              </div>
            )}
          </section>

          <section className="tenant-profile-section">
            <div className="tenant-profile-section-heading">
              <div>
                <FaUserFriends />
              </div>

              <span>
                <small>
                  Safety contact
                </small>

                <strong>
                  Emergency contact
                </strong>
              </span>
            </div>

            <div className="tenant-profile-form-grid">
              <label>
                Contact name *

                <input
                  type="text"
                  name="emergencyContactName"
                  value={
                    formData.emergencyContactName
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.emergencyContactName && (
                  <small className="tenant-profile-error">
                    {
                      errors.emergencyContactName
                    }
                  </small>
                )}
              </label>

              <label>
                Mobile number *

                <input
                  type="tel"
                  name="emergencyContactPhone"
                  maxLength="10"
                  value={
                    formData.emergencyContactPhone
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                />

                {errors.emergencyContactPhone && (
                  <small className="tenant-profile-error">
                    {
                      errors.emergencyContactPhone
                    }
                  </small>
                )}
              </label>

              <label>
                Relationship

                <input
                  type="text"
                  name="emergencyContactRelation"
                  value={
                    formData.emergencyContactRelation
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !isEditing
                  }
                  placeholder="Parent, sibling or friend"
                />
              </label>
            </div>
          </section>

          <section className="tenant-profile-section">
            <div className="tenant-profile-section-heading">
              <div>
                <FaHome />
              </div>

              <span>
                <small>
                  Rental overview
                </small>

                <strong>
                  Current rental
                </strong>
              </span>
            </div>

            {activeRental ? (
              <div className="tenant-profile-rental-card">
                <img
                  src={
                    activeRental.propertyImage
                  }
                  alt={
                    activeRental.propertyTitle
                  }
                />

                <div>
                  <span>
                    {
                      activeRental.propertyCategory
                    }
                  </span>

                  <h3>
                    {
                      activeRental.propertyTitle
                    }
                  </h3>

                  <p>
                    <FaMapMarkerAlt />

                    {
                      activeRental.locality
                    }
                    ,{" "}
                    {activeRental.city}
                  </p>

                  <div className="tenant-profile-rental-grid">
                    <div>
                      <span>
                        Monthly rent
                      </span>

                      <strong>
                        {formatCurrency(
                          activeRental.approvedMonthlyRent
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Move-in date
                      </span>

                      <strong>
                        {formatDate(
                          activeRental.moveInDate
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Booking status
                      </span>

                      <strong>
                        {
                          activeRental.status
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Landlord
                      </span>

                      <strong>
                        {
                          activeRental.landlordName
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="tenant-profile-rental-actions">
                    <Link to="/tenant/lease">
                      <FaBuilding />
                      View Rental
                    </Link>

                    <Link
                      to={`/tenant/payment-receipt/${activeRental.id}`}
                    >
                      <FaReceipt />
                      View Receipt
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tenant-profile-no-rental">
                <FaHome />

                <h3>
                  No active rental
                </h3>

                <p>
                  Active property details will
                  appear after successful booking
                  and payment.
                </p>

                <Link to="/properties">
                  Explore Properties
                </Link>
              </div>
            )}
          </section>

          {isEditing && (
            <div className="tenant-profile-bottom-actions">
              <button
                type="button"
                onClick={handleSave}
              >
                <FaSave />
                Save Profile
              </button>

              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
              >
                <FaTimes />
                Cancel Changes
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TenantProfile;
