import { getTenantUser } from "./sessionUser";

const getWishlistStorageKey = () => {
  try {
    const tenant = getTenantUser();
    const identity = String(tenant.id || tenant.email).trim().toLowerCase();
    return `rentsphere_tenant_wishlist_${encodeURIComponent(identity)}`;
  } catch {
    return "rentsphere_tenant_wishlist_guest";
  }
};

export const getWishlist = () => {
  try {
    const storedWishlist =
      localStorage.getItem(
        getWishlistStorageKey()
      );

    return storedWishlist
      ? JSON.parse(storedWishlist)
      : [];
  } catch (error) {
    console.error(
      "Unable to read wishlist:",
      error
    );

    return [];
  }
};

export const saveWishlist = (
  wishlist
) => {
  localStorage.setItem(
    getWishlistStorageKey(),
    JSON.stringify(wishlist)
  );
};

export const removeFromWishlist = (
  propertyId
) => {
  const updatedWishlist =
    getWishlist().filter(
      (property) =>
        String(property.id) !==
        String(propertyId)
    );

  saveWishlist(
    updatedWishlist
  );

  return updatedWishlist;
};

export const toggleWishlist = (
  property
) => {
  const currentWishlist =
    getWishlist();

  const alreadySaved =
    currentWishlist.some(
      (item) =>
        String(item.id) ===
        String(property.id)
    );

  if (alreadySaved) {
    return {
      saved: false,

      wishlist:
        removeFromWishlist(
          property.id
        ),
    };
  }

  const updatedWishlist = [
    ...currentWishlist,

    {
      ...property,

      savedOn:
        new Date()
          .toLocaleDateString(
            "en-IN"
          ),
    },
  ];

  saveWishlist(
    updatedWishlist
  );

  return {
    saved: true,
    wishlist:
      updatedWishlist,
  };
};
