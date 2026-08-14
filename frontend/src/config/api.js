export const API_BASE_URLS = {
  auth: "http://localhost:5279/api",

  property: "http://localhost:8081/api",

  booking: "http://localhost:8082/api",

  payment: "http://localhost:8083/api",
};

export const FILE_BASE_URL =
  "http://localhost:8081";

export const resolvePropertyImage = (
  imagePath
) => {
  if (!imagePath) {
    return "";
  }

  let value =
    String(imagePath).trim().replaceAll("\\", "/");

  if (!value) {
    return "";
  }

  if (value.startsWith("blob:") || value.startsWith("data:")) {
    return value;
  }

  const uploadsIndex = value.toLowerCase().indexOf("/uploads/");
  if (uploadsIndex >= 0) {
    return `${FILE_BASE_URL}${value.slice(uploadsIndex)}`;
  }

  if (value.toLowerCase().startsWith("uploads/")) {
    return `${FILE_BASE_URL}/${value}`;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (
    value.startsWith("/")
  ) {
    return `${FILE_BASE_URL}${value}`;
  }

  return `${FILE_BASE_URL}/${value}`;
};
