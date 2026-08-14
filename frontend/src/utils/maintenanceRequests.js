const MAINTENANCE_STORAGE_KEY =
  "rentsphere_maintenance_requests";

export const MAINTENANCE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

export const MAINTENANCE_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
};

export const getMaintenanceRequests = () => {
  try {
    const stored = localStorage.getItem(
      MAINTENANCE_STORAGE_KEY
    );

    return stored
      ? JSON.parse(stored)
      : [];
  } catch (error) {
    console.error(
      "Unable to read maintenance requests:",
      error
    );

    return [];
  }
};

export const saveMaintenanceRequests = (
  requests
) => {
  localStorage.setItem(
    MAINTENANCE_STORAGE_KEY,
    JSON.stringify(requests)
  );
};

export const addMaintenanceRequest = (
  request
) => {
  const currentRequests =
    getMaintenanceRequests();

  const updatedRequests = [
    request,
    ...currentRequests,
  ];

  saveMaintenanceRequests(
    updatedRequests
  );

  return updatedRequests;
};

export const updateMaintenanceRequest = (
  requestId,
  updates
) => {
  const updatedRequests =
    getMaintenanceRequests().map(
      (request) =>
        request.id === requestId
          ? {
              ...request,
              ...updates,
              updatedOn:
                new Date().toLocaleString(
                  "en-IN"
                ),
            }
          : request
    );

  saveMaintenanceRequests(
    updatedRequests
  );

  return updatedRequests;
};

export const cancelMaintenanceRequest = (
  requestId
) => {
  return updateMaintenanceRequest(
    requestId,
    {
      status:
        MAINTENANCE_STATUS.CANCELLED,

      cancelledOn:
        new Date().toLocaleString(
          "en-IN"
        ),
    }
  );
};