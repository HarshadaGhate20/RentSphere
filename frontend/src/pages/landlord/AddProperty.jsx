import React, {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";

import {
  createProperty,
} from "../../services/propertyApi";

import {
  getLandlordUser,
} from "../../utils/sessionUser";

import "../../assets/css/addProperty.css";

/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_FORM = {
  title: "",
  category: "",
  description: "",

  pricingType: "MONTHLY",

  /* Monthly */
  monthlyRent: "",

  /* Common */
  securityDeposit: "",
  maintenanceCharge: "",

  /* Villa */
  dailyRent: "",
  minimumStayDays: 1,
  maximumStayDays: 30,
  maximumGuests: "",
  checkInTime: "14:00",
  checkOutTime: "11:00",

  /* PG */
  totalRooms: "",
  totalBeds: "",
  availableBeds: "",
  sharingType: "",
  genderPreference: "ANY",
  roomType: "SHARED",
  rentPerBed: "",
  depositPerBed: "",

  foodIncluded: false,
  wifiAvailable: false,
  laundryAvailable: false,
  housekeepingAvailable: false,
  attachedBathroom: false,

  /* Property */
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  areaSqft: "",

  furnishingStatus: "",
  floorNumber: "",
  totalFloors: "",
  parkingAvailable: false,

  /* Address */
  addressLine1: "",
  addressLine2: "",
  area: "",
  city: "",
  state: "",
  pincode: "",

  /* Availability */
  availabilityType:
    "Immediately Available",

  availableFrom: "",
};

const PROPERTY_CATEGORIES = [
  "Apartment",
  "House",
  "Villa",
  "PG",
  "Penthouse",
];

const FURNISHING_OPTIONS = [
  "Unfurnished",
  "Semi Furnished",
  "Fully Furnished",
];

const AVAILABILITY_OPTIONS = [
  "Immediately Available",
  "Available From Date",
];

const AMENITY_OPTIONS = [
  "Lift",
  "Security",
  "Power Backup",
  "Parking",
  "CCTV",
  "Gym",
  "Swimming Pool",
  "Garden",
  "Club House",
  "WiFi",
  "Air Conditioning",
  "Water Supply",
  "Gas Pipeline",
  "Intercom",
  "Fire Safety",
  "Pet Friendly",
  "Food",
  "Laundry",
  "Housekeeping",
];

const AddProperty = () => {
  const navigate =
    useNavigate();

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    formData,
    setFormData,
  ] = useState(
    INITIAL_FORM
  );

  const [
    selectedAmenities,
    setSelectedAmenities,
  ] = useState([]);

  const [
    propertyImages,
    setPropertyImages,
  ] = useState([]);

  const [
    imagePreviews,
    setImagePreviews,
  ] = useState([]);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const totalSteps = 4;

  const progressPercentage =
    useMemo(
      () =>
        Math.round(
          (
            currentStep /
            totalSteps
          ) *
            100
        ),
      [currentStep]
    );

  const isVilla =
    formData.pricingType ===
    "DAILY";

  const isPG =
    formData.pricingType ===
    "PER_BED_MONTHLY";

  const isMonthly =
    formData.pricingType ===
    "MONTHLY";

  /* =========================================================
     GENERAL INPUT CHANGE
  ========================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } =
      event.target;

    setFormData(
      (current) => ({
        ...current,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  };

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (
    event
  ) => {
    const category =
      event.target.value;

    let pricingType =
      "MONTHLY";

    if (
      category ===
      "Villa"
    ) {
      pricingType =
        "DAILY";
    }

    if (
      category ===
      "PG"
    ) {
      pricingType =
        "PER_BED_MONTHLY";
    }

    setFormData(
      (current) => ({
        ...current,

        category,
        pricingType,

        monthlyRent:
          pricingType ===
          "MONTHLY"
            ? current.monthlyRent
            : "",

        dailyRent:
          pricingType ===
          "DAILY"
            ? current.dailyRent
            : "",

        rentPerBed:
          pricingType ===
          "PER_BED_MONTHLY"
            ? current.rentPerBed
            : "",
      })
    );
  };

  /* =========================================================
     AMENITIES
  ========================================================= */

  const toggleAmenity = (
    amenity
  ) => {
    setSelectedAmenities(
      (current) =>
        current.includes(
          amenity
        )
          ? current.filter(
              (item) =>
                item !==
                amenity
            )
          : [
              ...current,
              amenity,
            ]
    );
  };

  /* =========================================================
     IMAGES
  ========================================================= */

  const handleImageChange = (
    event
  ) => {
    const files =
      Array.from(
        event.target
          .files || []
      );

    if (!files.length) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalid =
      files.find(
        (file) =>
          !allowedTypes.includes(
            file.type
          )
      );

    if (invalid) {
      toast.error(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value =
        "";

      return;
    }

    const tooLarge =
      files.find(
        (file) =>
          file.size >
          5 *
            1024 *
            1024
      );

    if (tooLarge) {
      toast.error(
        "Each image must be smaller than 5 MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      propertyImages.length +
        files.length >
      8
    ) {
      toast.error(
        "Maximum 8 images are allowed."
      );

      return;
    }

    const previews =
      files.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      );

    setPropertyImages(
      (current) => [
        ...current,
        ...files,
      ]
    );

    setImagePreviews(
      (current) => [
        ...current,
        ...previews,
      ]
    );

    event.target.value =
      "";
  };

  const removeImage = (
    index
  ) => {
    URL.revokeObjectURL(
      imagePreviews[index]
    );

    setPropertyImages(
      (current) =>
        current.filter(
          (_, i) =>
            i !== index
        )
    );

    setImagePreviews(
      (current) =>
        current.filter(
          (_, i) =>
            i !== index
        )
    );
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateStepOne =
    () => {
      if (
        !formData.title.trim()
      ) {
        toast.error(
          "Property title is required."
        );

        return false;
      }

      if (
        !formData.category
      ) {
        toast.error(
          "Select property category."
        );

        return false;
      }

      if (
        formData.description
          .trim()
          .length < 30
      ) {
        toast.error(
          "Description must contain at least 30 characters."
        );

        return false;
      }

      return true;
    };

  const validateStepTwo =
    () => {
      if (
        isMonthly &&
        Number(
          formData.monthlyRent
        ) <= 0
      ) {
        toast.error(
          "Enter valid monthly rent."
        );

        return false;
      }

      if (isVilla) {
        if (
          Number(
            formData.dailyRent
          ) <= 0
        ) {
          toast.error(
            "Enter valid daily rent."
          );

          return false;
        }

        if (
          Number(
            formData.minimumStayDays
          ) < 1
        ) {
          toast.error(
            "Minimum stay must be at least 1 day."
          );

          return false;
        }

        if (
          Number(
            formData.maximumStayDays
          ) <
          Number(
            formData.minimumStayDays
          )
        ) {
          toast.error(
            "Maximum stay cannot be less than minimum stay."
          );

          return false;
        }

        if (
          Number(
            formData.maximumGuests
          ) < 1
        ) {
          toast.error(
            "Enter maximum guests."
          );

          return false;
        }
      }

      if (isPG) {
        if (
          Number(
            formData.totalRooms
          ) < 1
        ) {
          toast.error(
            "Enter total rooms."
          );

          return false;
        }

        if (
          Number(
            formData.totalBeds
          ) < 1
        ) {
          toast.error(
            "Enter total beds."
          );

          return false;
        }

        if (
          Number(
            formData.availableBeds
          ) < 0
        ) {
          toast.error(
            "Enter available beds."
          );

          return false;
        }

        if (
          Number(
            formData.availableBeds
          ) >
          Number(
            formData.totalBeds
          )
        ) {
          toast.error(
            "Available beds cannot exceed total beds."
          );

          return false;
        }

        if (
          Number(
            formData.rentPerBed
          ) <= 0
        ) {
          toast.error(
            "Enter rent per bed."
          );

          return false;
        }
      }

      if (
        Number(
          formData.areaSqft
        ) <= 0
      ) {
        toast.error(
          "Enter property area."
        );

        return false;
      }

      if (
        !formData.furnishingStatus
      ) {
        toast.error(
          "Select furnishing status."
        );

        return false;
      }

      return true;
    };

  const validateStepThree =
    () => {
      if (
        !formData.addressLine1.trim()
      ) {
        toast.error(
          "Address is required."
        );

        return false;
      }

      if (
        !formData.area.trim()
      ) {
        toast.error(
          "Area is required."
        );

        return false;
      }

      if (
        !formData.city.trim()
      ) {
        toast.error(
          "City is required."
        );

        return false;
      }

      if (
        !formData.state.trim()
      ) {
        toast.error(
          "State is required."
        );

        return false;
      }

      if (
        !/^[1-9][0-9]{5}$/.test(
          formData.pincode
        )
      ) {
        toast.error(
          "Enter valid pincode."
        );

        return false;
      }

      if (
        formData.availabilityType ===
          "Available From Date" &&
        !formData.availableFrom
      ) {
        toast.error(
          "Select available date."
        );

        return false;
      }

      return true;
    };

  const validateStepFour =
    () => {
      if (
        propertyImages.length ===
        0
      ) {
        toast.error(
          "Upload at least one property image."
        );

        return false;
      }

      return true;
    };

  const validateCurrentStep =
    () => {
      if (
        currentStep === 1
      ) {
        return validateStepOne();
      }

      if (
        currentStep === 2
      ) {
        return validateStepTwo();
      }

      if (
        currentStep === 3
      ) {
        return validateStepThree();
      }

      return validateStepFour();
    };

  /* =========================================================
     NEXT / PREVIOUS
  ========================================================= */

  const handleNext =
    () => {
      if (
        !validateCurrentStep()
      ) {
        return;
      }

      setCurrentStep(
        (current) =>
          Math.min(
            current + 1,
            totalSteps
          )
      );
    };

  const handlePrevious =
    () => {
      setCurrentStep(
        (current) =>
          Math.max(
            current - 1,
            1
          )
      );
    };

  /* =========================================================
     SUBMIT PROPERTY
  ========================================================= */

  const submitProperty =
    async () => {
      if (
        !validateStepFour()
      ) {
        return;
      }

      try {
        setIsSubmitting(
          true
        );

        const landlord =
          getLandlordUser();

        const landlordId =
          landlord?.id ||
          landlord?.email;

        if (!landlordId) {
          throw new Error(
            "Landlord session not found."
          );
        }

        const propertyData =
          {
            title:
              formData.title.trim(),

            category:
              formData.category,

            description:
              formData.description.trim(),

            pricingType:
              formData.pricingType,

            /* Monthly */

            monthlyRent:
              isMonthly
                ? Number(
                    formData.monthlyRent
                  )
                : null,

            /* Common */

            securityDeposit:
              Number(
                formData.securityDeposit ||
                  0
              ),

            maintenanceCharge:
              Number(
                formData.maintenanceCharge ||
                  0
              ),

            /* Villa */

            dailyRent:
              isVilla
                ? Number(
                    formData.dailyRent
                  )
                : null,

            minimumStayDays:
              isVilla
                ? Number(
                    formData.minimumStayDays
                  )
                : null,

            maximumStayDays:
              isVilla
                ? Number(
                    formData.maximumStayDays
                  )
                : null,

            maximumGuests:
              isVilla
                ? Number(
                    formData.maximumGuests
                  )
                : null,

            checkInTime:
              isVilla
                ? formData.checkInTime
                : null,

            checkOutTime:
              isVilla
                ? formData.checkOutTime
                : null,

            /* PG */

            totalRooms:
              isPG
                ? Number(
                    formData.totalRooms
                  )
                : null,

            totalBeds:
              isPG
                ? Number(
                    formData.totalBeds
                  )
                : null,

            availableBeds:
              isPG
                ? Number(
                    formData.availableBeds
                  )
                : null,

            sharingType:
              isPG
                ? formData.sharingType
                : null,

            genderPreference:
              isPG
                ? formData.genderPreference
                : null,

            roomType:
              isPG
                ? formData.roomType
                : null,

            rentPerBed:
              isPG
                ? Number(
                    formData.rentPerBed
                  )
                : null,

            depositPerBed:
              isPG
                ? Number(
                    formData.depositPerBed ||
                      0
                  )
                : null,

            foodIncluded:
              isPG
                ? formData.foodIncluded
                : false,

            wifiAvailable:
              isPG
                ? formData.wifiAvailable
                : false,

            laundryAvailable:
              isPG
                ? formData.laundryAvailable
                : false,

            housekeepingAvailable:
              isPG
                ? formData.housekeepingAvailable
                : false,

            attachedBathroom:
              isPG
                ? formData.attachedBathroom
                : false,

            /* Features */

            bedrooms:
              Number(
                formData.bedrooms ||
                  0
              ),

            bathrooms:
              Number(
                formData.bathrooms ||
                  0
              ),

            balconies:
              Number(
                formData.balconies ||
                  0
              ),

            areaSqft:
              Number(
                formData.areaSqft
              ),

            furnishingStatus:
              formData.furnishingStatus,

            floorNumber:
              formData.floorNumber ===
              ""
                ? null
                : Number(
                    formData.floorNumber
                  ),

            totalFloors:
              formData.totalFloors ===
              ""
                ? null
                : Number(
                    formData.totalFloors
                  ),

            parkingAvailable:
              formData.parkingAvailable,

            /* Address */

            addressLine1:
              formData.addressLine1.trim(),

            addressLine2:
              formData.addressLine2.trim(),

            area:
              formData.area.trim(),

            city:
              formData.city.trim(),

            state:
              formData.state.trim(),

            pincode:
              formData.pincode.trim(),

            /* Availability */

            availabilityType:
              formData.availabilityType,

            availableFrom:
              formData.availabilityType ===
              "Available From Date"
                ? formData.availableFrom
                : null,

            amenities:
              selectedAmenities,
          };

        console.log(
          "CREATE PROPERTY PAYLOAD:",
          propertyData
        );

        await createProperty(
          propertyData,
          propertyImages,
          landlordId,
          landlord?.name ||
            "RentSphere Landlord"
        );

        toast.success(
          "Property submitted successfully."
        );

        navigate(
          "/landlord/properties"
        );
      } catch (error) {
        console.error(
          "CREATE PROPERTY ERROR:",
          error
        );

        toast.error(
          error.message ||
            "Unable to create property."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  /* =========================================================
     STEP 1
  ========================================================= */

  const renderStepOne =
    () => (
      <div>

        <h3 className="mb-4">
          Basic Details
        </h3>

        <div className="row g-3">

          <div className="col-md-8">

            <label className="form-label">
              Property Title *
            </label>

            <input
              className="form-control"
              name="title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Category *
            </label>

            <select
              className="form-select"
              name="category"
              value={
                formData.category
              }
              onChange={
                handleCategoryChange
              }
            >
              <option value="">
                Select Category
              </option>

              {PROPERTY_CATEGORIES.map(
                (category) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
                  </option>
                )
              )}

            </select>

          </div>

          <div className="col-12">

            <label className="form-label">
              Description *
            </label>

            <textarea
              className="form-control"
              rows="5"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
            />

          </div>

        </div>

      </div>
    );

  /* =========================================================
     STEP 2
  ========================================================= */

  const renderStepTwo =
    () => (
      <div>

        <h3 className="mb-4">
          Pricing and Property Features
        </h3>

        <div className="row g-3">

          {isMonthly && (
            <div className="col-md-6">

              <label className="form-label">
                Monthly Rent *
              </label>

              <input
                type="number"
                className="form-control"
                name="monthlyRent"
                value={
                  formData.monthlyRent
                }
                onChange={
                  handleChange
                }
              />

            </div>
          )}

          {isVilla && (
            <>
              <div className="col-md-4">

                <label className="form-label">
                  Rent Per Day *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="dailyRent"
                  value={
                    formData.dailyRent
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Minimum Stay Days *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="minimumStayDays"
                  value={
                    formData.minimumStayDays
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Maximum Stay Days
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="maximumStayDays"
                  value={
                    formData.maximumStayDays
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Maximum Guests *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="maximumGuests"
                  value={
                    formData.maximumGuests
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Check-in Time
                </label>

                <input
                  type="time"
                  className="form-control"
                  name="checkInTime"
                  value={
                    formData.checkInTime
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Check-out Time
                </label>

                <input
                  type="time"
                  className="form-control"
                  name="checkOutTime"
                  value={
                    formData.checkOutTime
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>
            </>
          )}

          {isPG && (
            <>
              <div className="col-md-4">

                <label className="form-label">
                  Total Rooms *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="totalRooms"
                  value={
                    formData.totalRooms
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Total Beds *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="totalBeds"
                  value={
                    formData.totalBeds
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Available Beds *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="availableBeds"
                  value={
                    formData.availableBeds
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Sharing Type
                </label>

                <select
                  className="form-select"
                  name="sharingType"
                  value={
                    formData.sharingType
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="">
                    Select
                  </option>

                  <option value="SINGLE">
                    Single
                  </option>

                  <option value="DOUBLE">
                    Double
                  </option>

                  <option value="TRIPLE">
                    Triple
                  </option>

                  <option value="FOUR">
                    Four Sharing
                  </option>
                </select>

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Gender Preference
                </label>

                <select
                  className="form-select"
                  name="genderPreference"
                  value={
                    formData.genderPreference
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="ANY">
                    Any
                  </option>

                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>
                </select>

              </div>

              <div className="col-md-4">

                <label className="form-label">
                  Room Type
                </label>

                <select
                  className="form-select"
                  name="roomType"
                  value={
                    formData.roomType
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="SHARED">
                    Shared
                  </option>

                  <option value="PRIVATE">
                    Private
                  </option>
                </select>

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Rent Per Bed *
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="rentPerBed"
                  value={
                    formData.rentPerBed
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="col-md-6">

                <label className="form-label">
                  Deposit Per Bed
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="depositPerBed"
                  value={
                    formData.depositPerBed
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>
            </>
          )}

          <div className="col-md-6">

            <label className="form-label">
              Security Deposit
            </label>

            <input
              type="number"
              className="form-control"
              name="securityDeposit"
              value={
                formData.securityDeposit
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-6">

            <label className="form-label">
              Maintenance Charge
            </label>

            <input
              type="number"
              className="form-control"
              name="maintenanceCharge"
              value={
                formData.maintenanceCharge
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Bedrooms
            </label>

            <input
              type="number"
              className="form-control"
              name="bedrooms"
              value={
                formData.bedrooms
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Bathrooms
            </label>

            <input
              type="number"
              className="form-control"
              name="bathrooms"
              value={
                formData.bathrooms
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Balconies
            </label>

            <input
              type="number"
              className="form-control"
              name="balconies"
              value={
                formData.balconies
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Area Sq. Ft. *
            </label>

            <input
              type="number"
              className="form-control"
              name="areaSqft"
              value={
                formData.areaSqft
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Furnishing *
            </label>

            <select
              className="form-select"
              name="furnishingStatus"
              value={
                formData.furnishingStatus
              }
              onChange={
                handleChange
              }
            >
              <option value="">
                Select
              </option>

              {FURNISHING_OPTIONS.map(
                (option) => (
                  <option
                    value={
                      option
                    }
                    key={
                      option
                    }
                  >
                    {option}
                  </option>
                )
              )}

            </select>

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Floor Number
            </label>

            <input
              type="number"
              className="form-control"
              name="floorNumber"
              value={
                formData.floorNumber
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-4">

            <label className="form-label">
              Total Floors
            </label>

            <input
              type="number"
              className="form-control"
              name="totalFloors"
              value={
                formData.totalFloors
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-12">

            <label className="form-check">

              <input
                type="checkbox"
                className="form-check-input"
                name="parkingAvailable"
                checked={
                  formData.parkingAvailable
                }
                onChange={
                  handleChange
                }
              />

              <span className="form-check-label">
                Parking Available
              </span>

            </label>

          </div>

        </div>

      </div>
    );

  /* =========================================================
     STEP 3
  ========================================================= */

  const renderStepThree =
    () => (
      <div>

        <h3 className="mb-4">
          Location
        </h3>

        <div className="row g-3">

          <div className="col-md-6">

            <label className="form-label">
              Address Line 1 *
            </label>

            <input
              className="form-control"
              name="addressLine1"
              value={
                formData.addressLine1
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-6">

            <label className="form-label">
              Address Line 2
            </label>

            <input
              className="form-control"
              name="addressLine2"
              value={
                formData.addressLine2
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-3">

            <label className="form-label">
              Area *
            </label>

            <input
              className="form-control"
              name="area"
              value={
                formData.area
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-3">

            <label className="form-label">
              City *
            </label>

            <input
              className="form-control"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-3">

            <label className="form-label">
              State *
            </label>

            <input
              className="form-control"
              name="state"
              value={
                formData.state
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-3">

            <label className="form-label">
              Pincode *
            </label>

            <input
              className="form-control"
              name="pincode"
              maxLength="6"
              value={
                formData.pincode
              }
              onChange={
                handleChange
              }
            />

          </div>

          <div className="col-md-6">

            <label className="form-label">
              Availability
            </label>

            <select
              className="form-select"
              name="availabilityType"
              value={
                formData.availabilityType
              }
              onChange={
                handleChange
              }
            >
              {AVAILABILITY_OPTIONS.map(
                (option) => (
                  <option
                    value={
                      option
                    }
                    key={
                      option
                    }
                  >
                    {option}
                  </option>
                )
              )}

            </select>

          </div>

          {formData.availabilityType ===
            "Available From Date" && (
            <div className="col-md-6">

              <label className="form-label">
                Available From
              </label>

              <input
                type="date"
                className="form-control"
                name="availableFrom"
                value={
                  formData.availableFrom
                }
                onChange={
                  handleChange
                }
              />

            </div>
          )}

          <div className="col-12">

            <label className="form-label">
              Amenities
            </label>

            <div className="d-flex flex-wrap gap-2">

              {AMENITY_OPTIONS.map(
                (amenity) => (
                  <button
                    type="button"
                    key={
                      amenity
                    }
                    className={
                      selectedAmenities.includes(
                        amenity
                      )
                        ? "btn btn-primary"
                        : "btn btn-outline-secondary"
                    }
                    onClick={() =>
                      toggleAmenity(
                        amenity
                      )
                    }
                  >
                    {amenity}
                  </button>
                )
              )}

            </div>

          </div>

        </div>

      </div>
    );

  /* =========================================================
     STEP 4
  ========================================================= */

  const renderStepFour =
    () => (
      <div>

        <h3 className="mb-4">
          Images & Review
        </h3>

        <div className="mb-4">

          <label className="form-label">
            Property Images *
          </label>

          <input
            type="file"
            className="form-control"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleImageChange
            }
          />

        </div>

        <div className="row g-3">

          {imagePreviews.map(
            (
              preview,
              index
            ) => (
              <div
                className="col-md-3"
                key={
                  preview
                }
              >

                <div className="position-relative">

                  <img
                    src={
                      preview
                    }
                    alt="Property"
                    className="img-fluid rounded"
                    style={{
                      height:
                        "160px",
                      width:
                        "100%",
                      objectFit:
                        "cover",
                    }}
                  />

                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                    onClick={() =>
                      removeImage(
                        index
                      )
                    }
                  >
                    <FaTimes />
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>
    );

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="add-property-page">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <small className="text-primary fw-bold">
            PROPERTY LISTING
          </small>

          <h1>
            Add Property
          </h1>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate(
              "/landlord/properties"
            )
          }
        >
          <FaArrowLeft className="me-2" />
          My Properties
        </button>

      </div>

      <div className="progress mb-4">

        <div
          className="progress-bar"
          style={{
            width:
              `${progressPercentage}%`,
          }}
        />

      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">

        {currentStep ===
          1 &&
          renderStepOne()}

        {currentStep ===
          2 &&
          renderStepTwo()}

        {currentStep ===
          3 &&
          renderStepThree()}

        {currentStep ===
          4 &&
          renderStepFour()}

        <div className="d-flex justify-content-between mt-4">

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={
              currentStep === 1 ||
              isSubmitting
            }
            onClick={
              handlePrevious
            }
          >
            <FaArrowLeft className="me-2" />
            Previous
          </button>

          {currentStep <
          totalSteps ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={
                handleNext
              }
            >
              Next
              <FaArrowRight className="ms-2" />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={
                isSubmitting
              }
              onClick={
                submitProperty
              }
            >
              <FaCheck className="me-2" />

              {isSubmitting
                ? "Submitting..."
                : "Submit Property"}
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default AddProperty;