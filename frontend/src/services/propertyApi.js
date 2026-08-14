import {
  API_BASE_URLS,
  resolvePropertyImage,
} from "../config/api";

import {
  apiRequest,
} from "./apiClient";

const PROPERTY_API =
  `${API_BASE_URLS.property}/properties`;

/* =========================================================
   ID VALIDATION
========================================================= */

const requirePropertyId = (
  propertyId
) => {
  if (
    propertyId === undefined ||
    propertyId === null ||
    String(propertyId).trim() === "" ||
    String(propertyId) ===
      "undefined"
  ) {
    throw new Error(
      "Property ID is required."
    );
  }

  return String(
    propertyId
  );
};

const requireLandlordId = (
  landlordId
) => {
  if (
    landlordId === undefined ||
    landlordId === null ||
    String(landlordId).trim() === ""
  ) {
    throw new Error(
      "Landlord ID is required."
    );
  }

  return String(
    landlordId
  );
};

/* =========================================================
   IMAGE HELPERS
========================================================= */

const getPhotoPath = (
  photo
) => {
  if (!photo) {
    return "";
  }

  if (
    typeof photo ===
    "string"
  ) {
    return photo;
  }

  return (
    photo.photoUrl ||
    photo.imageUrl ||
    photo.url ||
    photo.path ||
    photo.filePath ||
    ""
  );
};

/* =========================================================
   NORMALIZE PROPERTY
========================================================= */

export const normalizeProperty = (
  property
) => {
  if (!property) {
    return null;
  }

  let images = [];

  if (
    Array.isArray(
      property.photos
    )
  ) {
    images =
      property.photos
        .map(
          getPhotoPath
        )
        .filter(
          Boolean
        );
  }

  if (
    images.length === 0 &&
    Array.isArray(
      property.images
    )
  ) {
    images =
      property.images
        .map(
          getPhotoPath
        )
        .filter(
          Boolean
        );
  }

  if (
    images.length === 0 &&
    (property.image || property.imageUrl)
  ) {
    images = [
      property.image || property.imageUrl,
    ];
  }

  const resolvedImages =
    images.map(
      resolvePropertyImage
    );

  return {
    ...property,

    images:
      resolvedImages,

    image:
      resolvedImages[0] ||
      "",
  };
};

export const normalizeProperties = (
  values
) => {
  if (
    !Array.isArray(
      values
    )
  ) {
    return [];
  }

  return values
    .map(
      normalizeProperty
    )
    .filter(
      Boolean
    );
};

/* =========================================================
   CREATE
========================================================= */

export const createProperty =
  async (
    propertyData,
    images = [],
    landlordId,
    landlordName
  ) => {
    requireLandlordId(
      landlordId
    );

    const formData =
      new FormData();

    formData.append(
      "property",
      new Blob(
        [
          JSON.stringify(
            propertyData
          ),
        ],
        {
          type:
            "application/json",
        }
      )
    );

    images.forEach(
      (image) => {
        if (image) {
          formData.append(
            "images",
            image
          );
        }
      }
    );

    formData.append("landlordId", String(landlordId));
    formData.append("landlordName", landlordName || "RentSphere Landlord");

    const response =
      await apiRequest(
        PROPERTY_API,
        {
          method:
            "POST",

          headers: {
            /*
             * Do NOT add multipart
             * Content-Type manually.
             */

            "X-Landlord-Id":
              String(
                landlordId
              ),

            "X-Landlord-Name":
              landlordName ||
              "RentSphere Landlord",
          },

          body:
            formData,
        }
      );

    return normalizeProperty(
      response
    );
  };

/* =========================================================
   GET ONE
========================================================= */

export const getPropertyById =
  async (
    propertyId
  ) => {
    const validId =
      requirePropertyId(
        propertyId
      );

    const response =
      await apiRequest(
        `${PROPERTY_API}/${encodeURIComponent(
          validId
        )}`
      );

    return normalizeProperty(
      response
    );
  };

/* =========================================================
   PUBLIC
========================================================= */

export const getPublicProperties =
  async () => {
    const response =
      await apiRequest(
        `${PROPERTY_API}/public`
      );

    return normalizeProperties(
      response
    );
  };

/* =========================================================
   LANDLORD
========================================================= */

export const getLandlordProperties =
  async (
    landlordId
  ) => {
    const validId =
      requireLandlordId(
        landlordId
      );

    const response =
      await apiRequest(
        `${PROPERTY_API}/landlord/${encodeURIComponent(
          validId
        )}`
      );

    return normalizeProperties(
      response
    );
  };

/* =========================================================
   ADMIN
========================================================= */

export const getAllPropertiesForAdmin =
  async () => {
    const response =
      await apiRequest(
        `${PROPERTY_API}/admin/all`
      );

    return normalizeProperties(
      response
    );
  };

export const getAdminProperties =
  getAllPropertiesForAdmin;

/* =========================================================
   UPDATE
========================================================= */

export const updateProperty =
  async (
    propertyId,
    propertyData,
    images = [],
    keepImageUrls = null
  ) => {
    const validId =
      requirePropertyId(
        propertyId
      );

    const validImages = images.filter(Boolean);
    const requestOptions = validImages.length > 0 || Array.isArray(keepImageUrls)
      ? (() => {
          const formData = new FormData();
          formData.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
          validImages.forEach((image) => formData.append("images", image));
          (keepImageUrls || []).forEach((imageUrl) => {
            let storedPath = imageUrl;
            try { storedPath = new URL(imageUrl).pathname; } catch { /* already relative */ }
            formData.append("keepImageUrls", storedPath);
          });
          return { method: "PUT", body: formData };
        })()
      : {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        };

    const response =
      await apiRequest(
        `${PROPERTY_API}/${encodeURIComponent(
          validId
        )}`,
        requestOptions
      );

    return normalizeProperty(
      response
    );
  };

/* =========================================================
   APPROVE
========================================================= */

export const approveProperty =
  async (
    propertyId
  ) => {
    const validId =
      requirePropertyId(
        propertyId
      );

    const response =
      await apiRequest(
        `${PROPERTY_API}/${encodeURIComponent(
          validId
        )}/approve`,
        {
          method:
            "PATCH",
        }
      );

    return normalizeProperty(
      response
    );
  };

/* =========================================================
   REJECT
========================================================= */

export const rejectProperty =
  async (
    propertyId,
    rejectionReason
  ) => {
    const validId =
      requirePropertyId(
        propertyId
      );

    const response =
      await apiRequest(
        `${PROPERTY_API}/${encodeURIComponent(
          validId
        )}/reject`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              reason: rejectionReason,
            }),
        }
      );

    return normalizeProperty(
      response
    );
  };

/* =========================================================
   RENTAL STATUS
========================================================= */

export const updateRentalStatus =
  async (
    propertyId,
    rentalStatus
  ) => {
    const validId =
      requirePropertyId(
        propertyId
      );

    const response =
      await apiRequest(
        `${PROPERTY_API}/${encodeURIComponent(
          validId
        )}/rental-status`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              rentalStatus,
            }),
        }
      );

    return normalizeProperty(
      response
    );
  };

export const getTenantVisiblePropertyById = async (propertyId) => {
  try {
    return await getPropertyById(propertyId);
  } catch (error) {
    const properties = await getPublicProperties();
    const property = properties.find((item) => String(item.id) === String(propertyId));
    if (!property) throw error;
    return property;
  }
};
