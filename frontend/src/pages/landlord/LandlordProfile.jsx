import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  FaAddressCard,
  FaBuilding,
  FaCamera,
  FaCheckCircle,
  FaCreditCard,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileAlt,
  FaHome,
  FaIdCard,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaSave,
  FaShieldAlt,
  FaTimes,
  FaTrash,
  FaUniversity,
  FaUser,
} from "react-icons/fa";

import {
  getLandlordProperties,
} from "../../services/propertyApi";

import {
  getLandlordBookings,
} from "../../services/bookingApi";

import {
  getLandlordUser,
} from "../../utils/sessionUser";

import "../../assets/css/landlordProfile.css";

/* =========================================================
   LOCAL PROFILE STORAGE
========================================================= */

const LANDLORD_PROFILE_STORAGE_KEY =
  "rentsphere_landlord_profile";

/* =========================================================
   DEFAULT PROFILE
========================================================= */

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",

  businessName: "",
  businessType: "",
  gstNumber: "",

  aadhaarNumber: "",
  panNumber: "",

  addressLine: "",
  city: "",
  state: "",
  postalCode: "",

  bankAccountHolder: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",

  profileImage: "",

  aadhaarDocumentName: "",
  panDocumentName: "",
  bankProofDocumentName: "",

  profileCompleted: false,
  updatedOn: "",
};

/* =========================================================
   READ PROFILE
========================================================= */

const readLandlordProfile = () => {
  try {
    const authenticatedUser =
      getLandlordUser();

    const stored =
      localStorage.getItem(
        LANDLORD_PROFILE_STORAGE_KEY
      );

    if (!stored) {
      return {
        ...defaultProfile,

        fullName:
          authenticatedUser.name ||
          "",

        email:
          authenticatedUser.email ||
          "",

        phone:
          authenticatedUser.phone ||
          "",
      };
    }

    const parsed =
      JSON.parse(stored);

    return {
      ...defaultProfile,
      ...parsed,

      /*
       * Always prefer authenticated
       * identity for these values when
       * available.
       */
      fullName:
        parsed.fullName ||
        authenticatedUser.name ||
        "",

      email:
        parsed.email ||
        authenticatedUser.email ||
        "",

      phone:
        parsed.phone ||
        authenticatedUser.phone ||
        "",
    };
  } catch (error) {
    console.error(
      "Unable to read landlord profile:",
      error
    );

    return {
      ...defaultProfile,
    };
  }
};

/* =========================================================
   SAVE PROFILE
========================================================= */

const saveLandlordProfile = (
  profile
) => {
  localStorage.setItem(
    LANDLORD_PROFILE_STORAGE_KEY,
    JSON.stringify(
      profile
    )
  );
};

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (
  amount
) =>
  `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

const maskAadhaar = (
  value
) => {
  const digits =
    String(
      value || ""
    ).replace(
      /\D/g,
      ""
    );

  if (
    digits.length < 4
  ) {
    return "Not provided";
  }

  return `XXXX XXXX ${digits.slice(
    -4
  )}`;
};

const maskPan = (
  value
) => {
  const pan =
    String(
      value || ""
    )
      .trim()
      .toUpperCase();

  if (
    pan.length < 4
  ) {
    return "Not provided";
  }

  return `${pan.slice(
    0,
    2
  )}*****${pan.slice(
    -3
  )}`;
};

const maskAccountNumber = (
  value
) => {
  const digits =
    String(
      value || ""
    ).replace(
      /\D/g,
      ""
    );

  if (
    digits.length < 4
  ) {
    return "Not provided";
  }

  return `XXXXXX${digits.slice(
    -4
  )}`;
};

/* =========================================================
   FILE → DATA URL
========================================================= */

const fileToDataUrl = (
  file
) =>
  new Promise(
    (
      resolve,
      reject
    ) => {
      const reader =
        new FileReader();

      reader.onload =
        () =>
          resolve(
            reader.result
          );

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );
    }
  );

/* =========================================================
   COMPONENT
========================================================= */

const LandlordProfile = () => {
  const imageInputRef =
    useRef(null);

  const aadhaarInputRef =
    useRef(null);

  const panInputRef =
    useRef(null);

  const bankProofInputRef =
    useRef(null);

  const [
    profile,
    setProfile,
  ] = useState(
    () =>
      readLandlordProfile()
  );

  const [
    formData,
    setFormData,
  ] = useState(
    () =>
      readLandlordProfile()
  );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    properties,
    setProperties,
  ] = useState([]);

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    loadingData,
    setLoadingData,
  ] = useState(true);

  /* =========================================================
     LOAD BACKEND DATA
  ========================================================= */

  useEffect(() => {
    const loadLandlordData =
      async () => {
        try {
          setLoadingData(
            true
          );

          const landlord =
            getLandlordUser();

          const landlordId =
            landlord.email ||
            landlord.id;

          if (!landlordId) {
            throw new Error(
              "Landlord ID was not found."
            );
          }

          console.log(
            "LANDLORD PROFILE ID:",
            landlordId
          );

          const [
            propertyResponse,
            bookingResponse,
          ] =
            await Promise.all([
              getLandlordProperties(
                landlordId
              ),

              getLandlordBookings(
                landlordId
              ),
            ]);

          setProperties(
            Array.isArray(
              propertyResponse
            )
              ? propertyResponse
              : []
          );

          setBookings(
            Array.isArray(
              bookingResponse
            )
              ? bookingResponse
              : []
          );
        } catch (
          error
        ) {
          console.error(
            "Unable to load landlord profile statistics:",
            error
          );

          /*
           * Profile page should still
           * open even if stats fail.
           */
          setProperties([]);
          setBookings([]);
        } finally {
          setLoadingData(
            false
          );
        }
      };

    loadLandlordData();
  }, []);

  /* =========================================================
     PROPERTY STATISTICS
  ========================================================= */

  const approvedProperties =
    useMemo(
      () =>
        properties.filter(
          (property) =>
            String(
              property.approvalStatus ||
                ""
            ).toUpperCase() ===
            "APPROVED"
        ),
      [
        properties,
      ]
    );

  const pendingProperties =
    useMemo(
      () =>
        properties.filter(
          (property) =>
            String(
              property.approvalStatus ||
                ""
            ).toUpperCase() ===
            "PENDING"
        ),
      [
        properties,
      ]
    );

  const availableProperties =
    useMemo(
      () =>
        properties.filter(
          (property) =>
            String(
              property.rentalStatus ||
                ""
            ).toUpperCase() ===
            "AVAILABLE"
        ),
      [
        properties,
      ]
    );

  const occupiedProperties =
    useMemo(
      () =>
        properties.filter(
          (property) =>
            [
              "BOOKED",
              "LEASE_ACTIVE",
            ].includes(
              String(
                property.rentalStatus ||
                  ""
              ).toUpperCase()
            )
        ),
      [
        properties,
      ]
    );

  const recentProperties =
    useMemo(
      () =>
        [
          ...properties,
        ].slice(
          0,
          3
        ),
      [
        properties,
      ]
    );

  const getPropertyRent = (property) => {
    const category = String(property?.category || "").toUpperCase();
    const pricingType = String(property?.pricingType || "").toUpperCase();
    if (category === "PG" || pricingType === "PER_BED_MONTHLY") return Number(property?.rentPerBed || property?.monthlyRent || 0);
    if (category === "VILLA" || pricingType === "DAILY") return Number(property?.dailyRent || property?.monthlyRent || 0);
    return Number(property?.monthlyRent || property?.rentPerBed || property?.dailyRent || 0);
  };

  const getPropertyRentSuffix = (property) => {
    const category = String(property?.category || "").toUpperCase();
    const pricingType = String(property?.pricingType || "").toUpperCase();
    if (category === "PG" || pricingType === "PER_BED_MONTHLY") return "/bed/month";
    if (category === "VILLA" || pricingType === "DAILY") return "/day";
    return "/month";
  };

  /* =========================================================
     BOOKING / REVENUE STATISTICS
  ========================================================= */

  const paidBookings =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            String(
              booking.paymentStatus ||
                ""
            ).toUpperCase() ===
              "PAID" ||
            String(
              booking.status ||
                ""
            ).toUpperCase() ===
              "LEASE_ACTIVE" ||
            String(
              booking.status ||
                ""
            ).toUpperCase() ===
              "COMPLETED"
        ),
      [
        bookings,
      ]
    );

  const activeRentals =
    useMemo(
      () =>
        bookings.filter(
          (booking) =>
            [
              "LEASE_ACTIVE",
              "BOOKED",
              "COMPLETED",
            ].includes(
              String(
                booking.status ||
                  ""
              ).toUpperCase()
            )
        ),
      [
        bookings,
      ]
    );

  const totalRevenue =
    useMemo(
      () =>
        paidBookings.reduce(
          (
            total,
            booking
          ) =>
            total +
            Number(
              booking.paymentAmount ||
                booking.totalAmount ||
                booking.approvedMonthlyRent ||
                0
            ),
          0
        ),
      [
        paidBookings,
      ]
    );

  const monthlyRentValue =
    useMemo(
      () =>
        activeRentals.reduce(
          (
            total,
            booking
          ) =>
            total +
            Number(
              booking.approvedMonthlyRent ||
                booking.requestedMonthlyRent ||
                0
            ),
          0
        ),
      [
        activeRentals,
      ]
    );

  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

  const profileCompletion =
    useMemo(
      () => {
        const requiredFields =
          [
            profile.fullName,
            profile.email,
            profile.phone,
            profile.businessName,
            profile.panNumber,
            profile.addressLine,
            profile.city,
            profile.state,
            profile.postalCode,
            profile.bankAccountHolder,
            profile.bankName,
            profile.accountNumber,
            profile.ifscCode,
          ];

        const completed =
          requiredFields.filter(
            Boolean
          ).length;

        return Math.round(
          (
            completed /
            requiredFields.length
          ) *
            100
        );
      },
      [
        profile,
      ]
    );

  /* =========================================================
     CHANGE HANDLER
  ========================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } =
      event.target;

    setFormData(
      (
        current
      ) => ({
        ...current,
        [name]:
          value,
      })
    );

    setErrors(
      (
        current
      ) => ({
        ...current,
        [name]:
          "",
      })
    );
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm =
    () => {
      const nextErrors =
        {};

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

      if (
        !formData.businessName.trim()
      ) {
        nextErrors.businessName =
          "Business or owner name is required.";
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
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
          formData.panNumber
            .toUpperCase()
        )
      ) {
        nextErrors.panNumber =
          "Enter a valid PAN number.";
      }

      if (
        formData.gstNumber &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
          formData.gstNumber
            .toUpperCase()
        )
      ) {
        nextErrors.gstNumber =
          "Enter a valid GST number.";
      }

      if (
        !formData.addressLine.trim()
      ) {
        nextErrors.addressLine =
          "Address is required.";
      }

      if (
        !formData.city.trim()
      ) {
        nextErrors.city =
          "City is required.";
      }

      if (
        !formData.state.trim()
      ) {
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
        !formData.bankAccountHolder.trim()
      ) {
        nextErrors.bankAccountHolder =
          "Account holder name is required.";
      }

      if (
        !formData.bankName.trim()
      ) {
        nextErrors.bankName =
          "Bank name is required.";
      }

      if (
        !/^\d{9,18}$/.test(
          formData.accountNumber
        )
      ) {
        nextErrors.accountNumber =
          "Enter a valid bank account number.";
      }

      if (
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
          formData.ifscCode
            .toUpperCase()
        )
      ) {
        nextErrors.ifscCode =
          "Enter a valid IFSC code.";
      }

      if (
        formData.upiId &&
        !/^[\w.-]+@[\w.-]+$/.test(
          formData.upiId
        )
      ) {
        nextErrors.upiId =
          "Enter a valid UPI ID.";
      }

      setErrors(
        nextErrors
      );

      return (
        Object.keys(
          nextErrors
        ).length === 0
      );
    };

  /* =========================================================
     EDIT
  ========================================================= */

  const startEditing =
    () => {
      setFormData({
        ...profile,
      });

      setErrors({});

      setIsEditing(
        true
      );
    };

  const cancelEditing =
    () => {
      setFormData({
        ...profile,
      });

      setErrors({});

      setIsEditing(
        false
      );
    };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave =
    () => {
      if (
        !validateForm()
      ) {
        toast.error(
          "Please correct the highlighted profile details."
        );

        return;
      }

      const updatedProfile =
        {
          ...formData,

          panNumber:
            formData.panNumber
              .toUpperCase(),

          gstNumber:
            formData.gstNumber
              .toUpperCase(),

          ifscCode:
            formData.ifscCode
              .toUpperCase(),

          profileCompleted:
            true,

          updatedOn:
            new Date()
              .toLocaleString(
                "en-IN"
              ),
        };

      saveLandlordProfile(
        updatedProfile
      );

      setProfile(
        updatedProfile
      );

      setFormData(
        updatedProfile
      );

      setIsEditing(
        false
      );

      toast.success(
        "Landlord profile updated successfully."
      );
    };

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const handleProfileImage =
    async (
      event
    ) => {
      const file =
        event.target
          .files?.[0];

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

      try {
        const imageUrl =
          await fileToDataUrl(
            file
          );

        setFormData(
          (
            current
          ) => ({
            ...current,
            profileImage:
              imageUrl,
          })
        );

        if (!isEditing) {
          const updated = {
            ...profile,
            profileImage:
              imageUrl,
          };

          setProfile(
            updated
          );

          saveLandlordProfile(
            updated
          );
        }
      } catch (error) {
        toast.error(
          "Unable to read profile image."
        );
      }
    };

  /* =========================================================
     DOCUMENT UPLOAD
  ========================================================= */

  const handleDocument =
    (
      event,
      fieldName
    ) => {
      const file =
        event.target
          .files?.[0];

      if (!file) {
        return;
      }

      setFormData(
        (
          current
        ) => ({
          ...current,
          [fieldName]:
            file.name,
        })
      );
    };

  /* =========================================================
     REMOVE DOCUMENT
  ========================================================= */

  const removeDocument =
    (
      fieldName
    ) => {
      setFormData(
        (
          current
        ) => ({
          ...current,
          [fieldName]:
            "",
        })
      );
    };

  /* =========================================================
     FIELD COMPONENT
  ========================================================= */

  const renderField = (
    label,
    name,
    type = "text",
    placeholder = ""
  ) => (
    <label className="landlord-profile-field">

      <span>
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={
          formData[name] ||
          ""
        }
        onChange={
          handleChange
        }
        placeholder={
          placeholder
        }
        disabled={
          !isEditing
        }
      />

      {errors[name] && (
        <small className="landlord-profile-error">
          {
            errors[name]
          }
        </small>
      )}

    </label>
  );

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="landlord-profile-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="landlord-profile-header">

        <div>
          <span>
            LANDLORD ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your personal,
            business, verification and
            payment information.
          </p>
        </div>

        <div className="landlord-profile-header-actions">

          {!isEditing ? (
            <button
              type="button"
              onClick={
                startEditing
              }
            >
              <FaEdit />

              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                className="secondary"
                onClick={
                  cancelEditing
                }
              >
                <FaTimes />

                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
              >
                <FaSave />

                Save Changes
              </button>
            </>
          )}

        </div>

      </section>

      {/* =====================================================
          PROFILE SUMMARY
      ====================================================== */}

      <section className="landlord-profile-summary-card">

        <div className="landlord-profile-avatar">

          {formData.profileImage ||
          profile.profileImage ? (
            <img
              src={
                formData.profileImage ||
                profile.profileImage
              }
              alt={
                profile.fullName
              }
            />
          ) : (
            <FaUser />
          )}

          <button
            type="button"
            onClick={() =>
              imageInputRef
                .current
                ?.click()
            }
          >
            <FaCamera />
          </button>

          <input
            ref={
              imageInputRef
            }
            type="file"
            accept="image/*"
            hidden
            onChange={
              handleProfileImage
            }
          />

        </div>

        <div className="landlord-profile-summary-details">

          <span>
            VERIFIED LANDLORD
          </span>

          <h2>
            {profile.fullName ||
              "RentSphere Landlord"}
          </h2>

          <p>
            <FaEnvelope />

            {profile.email ||
              "Email not provided"}
          </p>

          <p>
            <FaPhoneAlt />

            {profile.phone ||
              "Phone not provided"}
          </p>

        </div>

        <div className="landlord-profile-completion">

          <strong>
            {profileCompletion}%
          </strong>

          <span>
            Profile completed
          </span>

          <div>
            <span
              style={{
                width:
                  `${profileCompletion}%`,
              }}
            />
          </div>

        </div>

      </section>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="landlord-profile-stats">

        <article>
          <FaBuilding />

          <span>
            Total Properties
          </span>

          <strong>
            {loadingData
              ? "..."
              : properties.length}
          </strong>
        </article>

        <article>
          <FaCheckCircle />

          <span>
            Approved
          </span>

          <strong>
            {loadingData
              ? "..."
              : approvedProperties.length}
          </strong>
        </article>

        <article>
          <FaHome />

          <span>
            Available
          </span>

          <strong>
            {loadingData
              ? "..."
              : availableProperties.length}
          </strong>
        </article>

        <article>
          <FaBuilding />

          <span>
            Occupied
          </span>

          <strong>
            {loadingData
              ? "..."
              : occupiedProperties.length}
          </strong>
        </article>

        <article>
          <FaMoneyBillWave />

          <span>
            Monthly Rent Value
          </span>

          <strong>
            {loadingData
              ? "..."
              : formatCurrency(
                  monthlyRentValue
                )}
          </strong>
        </article>

        <article>
          <FaCreditCard />

          <span>
            Total Revenue
          </span>

          <strong>
            {loadingData
              ? "..."
              : formatCurrency(
                  totalRevenue
                )}
          </strong>
        </article>

      </section>

      {/* =====================================================
          PERSONAL INFORMATION
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaAddressCard />

          <div>
            <span>
              PERSONAL INFORMATION
            </span>

            <h2>
              Personal Details
            </h2>
          </div>

        </div>

        <div className="landlord-profile-grid">

          {renderField(
            "Full Name",
            "fullName",
            "text",
            "Enter full name"
          )}

          {renderField(
            "Email",
            "email",
            "email",
            "Enter email"
          )}

          {renderField(
            "Phone",
            "phone",
            "tel",
            "10-digit mobile number"
          )}

          {renderField(
            "Date of Birth",
            "dateOfBirth",
            "date"
          )}

          <label className="landlord-profile-field">

            <span>
              Gender
            </span>

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
                Select
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>

          </label>

        </div>

      </section>

      {/* =====================================================
          BUSINESS INFORMATION
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaBuilding />

          <div>
            <span>
              LANDLORD INFORMATION
            </span>

            <h2>
              Business Details
            </h2>
          </div>

        </div>

        <div className="landlord-profile-grid">

          {renderField(
            "Business / Owner Name",
            "businessName"
          )}

          <label className="landlord-profile-field">

            <span>
              Business Type
            </span>

            <select
              name="businessType"
              value={
                formData.businessType
              }
              onChange={
                handleChange
              }
              disabled={
                !isEditing
              }
            >
              <option value="">
                Select type
              </option>

              <option value="Individual">
                Individual Owner
              </option>

              <option value="Company">
                Company
              </option>

              <option value="Partnership">
                Partnership
              </option>

              <option value="Agency">
                Property Agency
              </option>
            </select>

          </label>

          {renderField(
            "GST Number",
            "gstNumber",
            "text",
            "Optional"
          )}

        </div>

      </section>

      {/* =====================================================
          IDENTITY
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaShieldAlt />

          <div>
            <span>
              IDENTITY VERIFICATION
            </span>

            <h2>
              KYC Details
            </h2>
          </div>

        </div>

        {!isEditing && (
          <div className="landlord-profile-kyc-summary">

            <div>
              <FaIdCard />

              <span>
                Aadhaar
              </span>

              <strong>
                {maskAadhaar(
                  profile.aadhaarNumber
                )}
              </strong>
            </div>

            <div>
              <FaIdCard />

              <span>
                PAN
              </span>

              <strong>
                {maskPan(
                  profile.panNumber
                )}
              </strong>
            </div>

          </div>
        )}

        {isEditing && (
          <div className="landlord-profile-grid">

            {renderField(
              "Aadhaar Number",
              "aadhaarNumber",
              "text",
              "12-digit Aadhaar"
            )}

            {renderField(
              "PAN Number",
              "panNumber",
              "text",
              "ABCDE1234F"
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          ADDRESS
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaMapMarkerAlt />

          <div>
            <span>
              ADDRESS
            </span>

            <h2>
              Contact Address
            </h2>
          </div>

        </div>

        <div className="landlord-profile-grid">

          {renderField(
            "Address",
            "addressLine"
          )}

          {renderField(
            "City",
            "city"
          )}

          {renderField(
            "State",
            "state"
          )}

          {renderField(
            "Postal Code",
            "postalCode"
          )}

        </div>

      </section>

      {/* =====================================================
          BANK DETAILS
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaUniversity />

          <div>
            <span>
              PAYMENT INFORMATION
            </span>

            <h2>
              Bank Details
            </h2>
          </div>

        </div>

        {!isEditing && (
          <div className="landlord-profile-bank-summary">

            <div>
              <span>
                Account Holder
              </span>

              <strong>
                {profile.bankAccountHolder ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Bank
              </span>

              <strong>
                {profile.bankName ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Account
              </span>

              <strong>
                {maskAccountNumber(
                  profile.accountNumber
                )}
              </strong>
            </div>

            <div>
              <span>
                IFSC
              </span>

              <strong>
                {profile.ifscCode ||
                  "Not provided"}
              </strong>
            </div>

          </div>
        )}

        {isEditing && (
          <div className="landlord-profile-grid">

            {renderField(
              "Account Holder",
              "bankAccountHolder"
            )}

            {renderField(
              "Bank Name",
              "bankName"
            )}

            {renderField(
              "Account Number",
              "accountNumber"
            )}

            {renderField(
              "IFSC Code",
              "ifscCode"
            )}

            {renderField(
              "UPI ID",
              "upiId"
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          DOCUMENTS
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaFileAlt />

          <div>
            <span>
              DOCUMENTS
            </span>

            <h2>
              Verification Documents
            </h2>
          </div>

        </div>

        <div className="landlord-profile-documents">

          {/* AADHAAR */}

          <article>

            <FaIdCard />

            <div>
              <strong>
                Aadhaar Document
              </strong>

              <span>
                {formData.aadhaarDocumentName ||
                  "Not uploaded"}
              </span>
            </div>

            {isEditing && (
              <>

                <button
                  type="button"
                  onClick={() =>
                    aadhaarInputRef
                      .current
                      ?.click()
                  }
                >
                  Upload
                </button>

                {formData.aadhaarDocumentName && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      removeDocument(
                        "aadhaarDocumentName"
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                )}

              </>
            )}

            <input
              ref={
                aadhaarInputRef
              }
              type="file"
              accept=".pdf,image/*"
              hidden
              onChange={(
                event
              ) =>
                handleDocument(
                  event,
                  "aadhaarDocumentName"
                )
              }
            />

          </article>

          {/* PAN */}

          <article>

            <FaIdCard />

            <div>
              <strong>
                PAN Document
              </strong>

              <span>
                {formData.panDocumentName ||
                  "Not uploaded"}
              </span>
            </div>

            {isEditing && (
              <>

                <button
                  type="button"
                  onClick={() =>
                    panInputRef
                      .current
                      ?.click()
                  }
                >
                  Upload
                </button>

                {formData.panDocumentName && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      removeDocument(
                        "panDocumentName"
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                )}

              </>
            )}

            <input
              ref={
                panInputRef
              }
              type="file"
              accept=".pdf,image/*"
              hidden
              onChange={(
                event
              ) =>
                handleDocument(
                  event,
                  "panDocumentName"
                )
              }
            />

          </article>

          {/* BANK PROOF */}

          <article>

            <FaCreditCard />

            <div>
              <strong>
                Bank Proof
              </strong>

              <span>
                {formData.bankProofDocumentName ||
                  "Not uploaded"}
              </span>
            </div>

            {isEditing && (
              <>

                <button
                  type="button"
                  onClick={() =>
                    bankProofInputRef
                      .current
                      ?.click()
                  }
                >
                  Upload
                </button>

                {formData.bankProofDocumentName && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      removeDocument(
                        "bankProofDocumentName"
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                )}

              </>
            )}

            <input
              ref={
                bankProofInputRef
              }
              type="file"
              accept=".pdf,image/*"
              hidden
              onChange={(
                event
              ) =>
                handleDocument(
                  event,
                  "bankProofDocumentName"
                )
              }
            />

          </article>

        </div>

      </section>

      {/* =====================================================
          PROPERTY SUMMARY
      ====================================================== */}

      <section className="landlord-profile-panel">

        <div className="landlord-profile-panel-heading">

          <FaHome />

          <div>
            <span>
              PROPERTY PORTFOLIO
            </span>

            <h2>
              Recent Properties
            </h2>
          </div>

          <Link
            to="/landlord/properties"
          >
            View All
          </Link>

        </div>

        {loadingData ? (
          <p>
            Loading properties...
          </p>
        ) : recentProperties.length >
          0 ? (
          <div className="landlord-profile-properties">

            {recentProperties.map(
              (
                property
              ) => {
                const image =
                  property.image ||
                  property.images?.[0] ||
                  "";

                return (
                  <article
                    key={
                      property.id
                    }
                  >

                    {image ? (
                      <img
                        src={
                          image
                        }
                        alt={
                          property.title
                        }
                      />
                    ) : (
                      <div className="landlord-profile-property-placeholder">
                        <FaBuilding />
                      </div>
                    )}

                    <div>

                      <span>
                        PROPERTY #
                        {
                          property.id
                        }
                      </span>

                      <h3>
                        {property.title ||
                          "Rental Property"}
                      </h3>

                      <p>
                        <FaMapMarkerAlt />

                        {property.area}

                        {property.area &&
                        property.city
                          ? ", "
                          : ""}

                        {property.city}
                      </p>

                      <strong>
                        {formatCurrency(
                          getPropertyRent(property)
                        )}
                        {getPropertyRentSuffix(property)}
                      </strong>

                      <small>
                        {String(
                          property.approvalStatus ||
                            "PENDING"
                        ).replaceAll(
                          "_",
                          " "
                        )}
                      </small>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        ) : (
          <div className="landlord-profile-empty">

            <FaExclamationTriangle />

            <h3>
              No properties added yet
            </h3>

            <p>
              Add your first rental
              property to start
              building your portfolio.
            </p>

            <Link
              to="/landlord/add-property"
            >
              Add Property
            </Link>

          </div>
        )}

      </section>

      {/* =====================================================
          PENDING PROPERTY NOTICE
      ====================================================== */}

      {pendingProperties.length >
        0 && (
        <section className="landlord-profile-notice">

          <FaExclamationTriangle />

          <div>
            <strong>
              {
                pendingProperties.length
              }{" "}
              propert
              {pendingProperties.length ===
              1
                ? "y is"
                : "ies are"}{" "}
              awaiting admin approval.
            </strong>

            <p>
              Pending properties will
              become available to
              tenants after approval.
            </p>
          </div>

          <Link
            to="/landlord/properties"
          >
            View Properties
          </Link>

        </section>
      )}

    </div>
  );
};

export default LandlordProfile;
