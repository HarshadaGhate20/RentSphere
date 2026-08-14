// src/utils/sessionUser.js

export const getAuthenticatedUser = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("_token");

  const name =
    localStorage.getItem("name") || "";

  const email =
    localStorage.getItem("email") || "";

  const role =
    String(
      localStorage.getItem("role") || ""
    ).toUpperCase();

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("id") ||
    email;

  if (!token) {
    throw new Error(
      "Authentication token was not found."
    );
  }

  if (!role) {
    throw new Error(
      "Authenticated user role was not found."
    );
  }

  return {
    id: String(userId),
    name,
    email,
    role,
    token,

    phone:
      localStorage.getItem("phone") || "",

    occupation:
      localStorage.getItem("occupation") || "",
  };
};

export const getTenantUser = () => {
  const user =
    getAuthenticatedUser();

  if (user.role !== "TENANT") {
    throw new Error(
      "Only a tenant can perform this action."
    );
  }

  return user;
};

export const getLandlordUser = () => {
  const user =
    getAuthenticatedUser();

  if (user.role !== "LANDLORD") {
    throw new Error(
      "Only a landlord can perform this action."
    );
  }

  return user;
};