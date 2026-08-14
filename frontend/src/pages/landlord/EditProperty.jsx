import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  FaArrowLeft,
  FaImage,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import {
  getPropertyById,
  updateProperty,
} from "../../services/propertyApi";

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

  /* Common charges */
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

  /* Features */
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

  amenities: [],
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

const EditProperty = () => {
  const {
    id,
  } =
    useParams();

  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] =
    useState(
      INITIAL_FORM
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /* =========================================================
     TYPE HELPERS
  ========================================================= */

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
     LOAD PROPERTY
  ========================================================= */

  useEffect(() => {
    const loadProperty =
      async () => {
        /*
         * IMPORTANT:
         *
         * Never call:
         *
         * getPropertyById(undefined)
         */
        if (
          !id ||
          id === "undefined"
        ) {
          setError(
            "Property ID is missing."
          );

          setLoading(
            false
          );

          return;
        }

        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const property =
            await getPropertyById(
              id
            );

          setCurrentImages(property.images || (property.image ? [property.image] : []));

          console.log(
            "EDIT PROPERTY:",
            property
          );

          const category =
            property.category ||
            "";

          let pricingType =
            property.pricingType ||
            "";

          /*
           * Backward compatibility
           * for older records.
           */
          if (!pricingType) {
            const normalizedCategory =
              String(
                category
              ).toUpperCase();

            if (
              normalizedCategory ===
              "VILLA"
            ) {
              pricingType =
                "DAILY";
            } else if (
              normalizedCategory ===
              "PG" ||
              normalizedCategory ===
              "HOSTEL"
            ) {
              pricingType =
                "PER_BED_MONTHLY";
            } else {
              pricingType =
                "MONTHLY";
            }
          }

          setFormData({
            title:
              property.title ||
              "",

            category,

            description:
              property.description ||
              "",

            pricingType,

            /* Monthly */

            monthlyRent:
              property.monthlyRent ??
              "",

            /* Common */

            securityDeposit:
              property.securityDeposit ??
              "",

            maintenanceCharge:
              property.maintenanceCharge ??
              "",

            /* Villa */

            dailyRent:
              property.dailyRent ??
              "",

            minimumStayDays:
              property.minimumStayDays ??
              1,

            maximumStayDays:
              property.maximumStayDays ??
              30,

            maximumGuests:
              property.maximumGuests ??
              "",

            checkInTime:
              property.checkInTime ||
              "14:00",

            checkOutTime:
              property.checkOutTime ||
              "11:00",

            /* PG */

            totalRooms:
              property.totalRooms ??
              "",

            totalBeds:
              property.totalBeds ??
              "",

            availableBeds:
              property.availableBeds ??
              "",

            sharingType:
              property.sharingType ||
              "",

            genderPreference:
              property.genderPreference ||
              "ANY",

            roomType:
              property.roomType ||
              "SHARED",

            rentPerBed:
              property.rentPerBed ??
              "",

            depositPerBed:
              property.depositPerBed ??
              "",

            foodIncluded:
              Boolean(
                property.foodIncluded
              ),

            wifiAvailable:
              Boolean(
                property.wifiAvailable
              ),

            laundryAvailable:
              Boolean(
                property.laundryAvailable
              ),

            housekeepingAvailable:
              Boolean(
                property.housekeepingAvailable
              ),

            attachedBathroom:
              Boolean(
                property.attachedBathroom
              ),

            /* Features */

            bedrooms:
              property.bedrooms ??
              "",

            bathrooms:
              property.bathrooms ??
              "",

            balconies:
              property.balconies ??
              "",

            areaSqft:
              property.areaSqft ??
              "",

            furnishingStatus:
              property.furnishingStatus ||
              "",

            floorNumber:
              property.floorNumber ??
              "",

            totalFloors:
              property.totalFloors ??
              "",

            parkingAvailable:
              Boolean(
                property.parkingAvailable
              ),

            /* Address */

            addressLine1:
              property.addressLine1 ||
              "",

            addressLine2:
              property.addressLine2 ||
              "",

            area:
              property.area ||
              "",

            city:
              property.city ||
              "",

            state:
              property.state ||
              "",

            pincode:
              property.pincode ||
              "",

            /* Availability */

            availabilityType:
              property.availabilityType ||
              "Immediately Available",

            availableFrom:
              property.availableFrom ||
              "",

            amenities:
              Array.isArray(
                property.amenities
              )
                ? property.amenities
                : [],
          });
        } catch (
          loadError
        ) {
          console.error(
            "EDIT PROPERTY LOAD ERROR:",
            loadError
          );

          setError(
            loadError.message ||
            "Property could not be loaded."
          );

          toast.error(
            loadError.message ||
            "Property could not be loaded."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadProperty();
  }, [id]);

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
      })
    );
  };

  /* =========================================================
     AMENITY CHANGE
  ========================================================= */

  const toggleAmenity = (
    amenity
  ) => {
    setFormData(
      (current) => {
        const currentAmenities =
          Array.isArray(
            current.amenities
          )
            ? current.amenities
            : [];

        const alreadyAdded =
          currentAmenities.includes(
            amenity
          );

        return {
          ...current,

          amenities:
            alreadyAdded
              ? currentAmenities.filter(
                  (item) =>
                    item !==
                    amenity
                )
              : [
                  ...currentAmenities,
                  amenity,
                ],
        };
      }
    );
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validate =
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
          "Property category is required."
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
            "Enter valid rent per bed."
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
          "Enter valid area."
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

      if (
        !formData.addressLine1.trim()
      ) {
        toast.error(
          "Address is required."
        );

        return false;
      }

      if (
        !formData.area.trim() ||
        !formData.city.trim() ||
        !formData.state.trim()
      ) {
        toast.error(
          "Area, city and state are required."
        );

        return false;
      }

      if (
        !/^[1-9][0-9]{5}$/.test(
          formData.pincode
        )
      ) {
        toast.error(
          "Enter valid 6-digit pincode."
        );

        return false;
      }

      return true;
    };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
    }

    const availableSlots = Math.max(0, 8 - currentImages.length);
    if (validFiles.length > availableSlots) {
      toast.error("A maximum of 8 property images is allowed.");
      setNewImages(validFiles.slice(0, availableSlots));
      return;
    }

    setNewImages(validFiles);
  };

  const removeNewImage = (index) => {
    setNewImages((images) => images.filter((_, imageIndex) => imageIndex !== index));
  };

  const removeCurrentImage = (index) => {
    setCurrentImages((images) => images.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (currentImages.length + newImages.length === 0) {
        toast.error("Keep or add at least one property image.");
        return;
      }

      if (!validate()) {
        return;
      }

      if (!id) {
        toast.error(
          "Property ID is missing."
        );

        return;
      }

      try {
        setSaving(
          true
        );

        const payload = {
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
            Boolean(
              formData.parkingAvailable
            ),

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
            formData.amenities,
        };

        console.log(
          "UPDATE PROPERTY:",
          payload
        );

        await updateProperty(
          id,
          payload,
          newImages,
          currentImages
        );

        toast.success(
          "Property updated successfully."
        );

        navigate(
          "/landlord/properties"
        );
      } catch (
        saveError
      ) {
        console.error(
          "UPDATE PROPERTY ERROR:",
          saveError
        );

        toast.error(
          saveError.message ||
          "Unable to update property."
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading property...
        </p>

      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/landlord/properties"
            )
          }
        >
          Back to My Properties
        </button>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="container-fluid py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <small className="text-primary fw-bold">
            PROPERTY MANAGEMENT
          </small>

          <h1>
            Edit Property
          </h1>

          <p className="text-muted mb-0">
            Property #{id}
          </p>
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

      <form
        onSubmit={
          handleSubmit
        }
      >

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h3 className="mb-2"><FaImage className="me-2 text-primary" />Property Images</h3>
          <p className="text-muted">
            Add new images or delete existing images. The first remaining image becomes the cover image.
          </p>

          <div className="row g-3 mb-3">
            {[...currentImages, ...newImages].map((image, index) => {
              const isExisting = index < currentImages.length;
              const preview = typeof image === "string" ? image : URL.createObjectURL(image);
              return (
                <div className="col-6 col-md-3" key={`${preview}-${index}`}>
                  <div className="position-relative">
                    <img src={preview} alt={`Property ${index + 1}`} className="img-fluid rounded-3 border" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                    <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" onClick={() => isExisting ? removeCurrentImage(index) : removeNewImage(index - currentImages.length)} aria-label="Delete property image">
                        <FaTimes />
                    </button>
                    {index === 0 && <span className="badge bg-primary position-absolute bottom-0 start-0 m-2">Cover</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <input className="form-control" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} />
          <small className="text-muted mt-2">Keep, delete, or add images up to a total of 8.</small>
        </div>

        {/* ===================================================
            BASIC DETAILS
        =================================================== */}

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

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
                  Select
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
                rows="5"
                className="form-control"
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

        {/* ===================================================
            PRICING
        =================================================== */}

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

          <h3 className="mb-4">
            Pricing
          </h3>

          <div className="row g-3">

            {isMonthly && (
              <div className="col-md-4">

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
                    Minimum Stay Days
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
                    Maximum Guests
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
                    Check-in
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
                    Check-out
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

                <div className="col-md-4">

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

              </>
            )}

            <div className="col-md-4">

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

            <div className="col-md-4">

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

          </div>

        </div>

        {/* ===================================================
            PROPERTY FEATURES
        =================================================== */}

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

          <h3 className="mb-4">
            Property Features
          </h3>

          <div className="row g-3">

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

        {/* ===================================================
            LOCATION
        =================================================== */}

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

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

          </div>

        </div>

        {/* ===================================================
            AVAILABILITY + AMENITIES
        =================================================== */}

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

          <h3 className="mb-4">
            Availability & Amenities
          </h3>

          <div className="row g-3">

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
                      key={
                        option
                      }
                      value={
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
                  (amenity) => {
                    const selected =
                      formData.amenities.includes(
                        amenity
                      );

                    return (
                      <button
                        type="button"
                        key={
                          amenity
                        }
                        className={
                          selected
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
                    );
                  }
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SAVE
        =================================================== */}

        <div className="d-flex justify-content-end">

          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={
              saving
            }
          >
            <FaSave className="me-2" />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditProperty;
