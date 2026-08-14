const NEGOTIATION_STORAGE_KEY =
  "rentsphere_tenant_negotiations";

export const getNegotiations = () => {
  try {
    const stored = localStorage.getItem(
      NEGOTIATION_STORAGE_KEY
    );

    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(
      "Unable to read negotiations:",
      error
    );

    return [];
  }
};

export const saveNegotiations = (
  negotiations
) => {
  localStorage.setItem(
    NEGOTIATION_STORAGE_KEY,
    JSON.stringify(negotiations)
  );
};

export const getNegotiationForProperty = (
  propertyId
) => {
  const negotiations = getNegotiations();

  return (
    negotiations.find(
      (negotiation) =>
        String(negotiation.propertyId) ===
        String(propertyId)
    ) || null
  );
};

export const getApprovedRentForProperty = (
  propertyId,
  listedRent
) => {
  const negotiation =
    getNegotiationForProperty(propertyId);

  const acceptedStatuses = [
    "ACCEPTED",
    "TENANT_ACCEPTED",
  ];

  if (
    negotiation &&
    acceptedStatuses.includes(
      negotiation.status
    ) &&
    Number(negotiation.approvedRent) > 0
  ) {
    return Number(
      negotiation.approvedRent
    );
  }

  return Number(listedRent || 0);
};