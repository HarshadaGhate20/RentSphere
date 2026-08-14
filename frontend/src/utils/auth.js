const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const NAME_KEY = "name";
const EMAIL_KEY = "email";
const PHONE_KEY = "phone";

export const saveAuthData = (authData) => {
  if (!authData) {
    return;
  }

  const token =
    authData.token || authData.accessToken;

  const role = authData.role
    ? String(authData.role).toUpperCase()
    : "";

  const name =
    authData.name ||
    authData.fullName ||
    authData.userName ||
    "RentSphere User";

  const email = authData.email || "";
  const phone = authData.phone || "";

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }

  if (name) {
    localStorage.setItem(NAME_KEY, name);
  }

  if (email) {
    localStorage.setItem(EMAIL_KEY, email);
  }

  if (phone) {
    localStorage.setItem(PHONE_KEY, phone);
  }

  // Inform open components that login information changed.
  window.dispatchEvent(
    new Event("rentsphere-auth-change")
  );
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  const role =
    localStorage.getItem(ROLE_KEY) ||
    localStorage.getItem("userRole");

  return role
    ? String(role).toUpperCase()
    : null;
};

export const getName = () => {
  return localStorage.getItem(NAME_KEY);
};

export const getEmail = () => {
  return localStorage.getItem(EMAIL_KEY);
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const getDashboardPath = () => {
  const role = getRole();

  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "LANDLORD") {
    return "/landlord";
  }

  if (role === "TENANT") {
    return "/tenant";
  }

  return "/";
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem("userRole");
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(PHONE_KEY);

  window.dispatchEvent(
    new Event("rentsphere-auth-change")
  );
};
