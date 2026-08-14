const KEY = "rentsphere_in_app_notifications";

export const getNotifications = () => {
  try {
    const notifications = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = notifications.filter((item) =>
      !`${item?.title || ""} ${item?.message || ""}`.toLowerCase().includes("maintenance")
    ).map((item) => {
      if (!/\b(GET|POST|PUT|PATCH|DELETE) operation completed successfully/i.test(item?.message || "")) {
        return item;
      }
      const title = String(item.title || "Update");
      const message = title.toLowerCase().includes("payment")
        ? "Your payment information has been updated."
        : title.toLowerCase().includes("booking")
          ? "The booking status has been updated."
          : title.toLowerCase().includes("property")
            ? "The property information has been saved."
            : "Your changes have been saved.";
      const friendlyTitle = title.toLowerCase().includes("payment")
        ? "Payment successful"
        : title.toLowerCase().includes("booking")
          ? "Booking updated"
          : title.toLowerCase().includes("property")
            ? "Property updated"
            : "Update completed";
      return { ...item, title: friendlyTitle, message };
    });
    if (JSON.stringify(filtered) !== JSON.stringify(notifications)) {
      localStorage.setItem(KEY, JSON.stringify(filtered));
    }
    return filtered;
  }
  catch { return []; }
};

export const addNotification = (title, message, type = "INFO") => {
  const item = { id: `${Date.now()}-${Math.random()}`, title, message, type, createdAt: new Date().toISOString(), read: false };
  localStorage.setItem(KEY, JSON.stringify([item, ...getNotifications()].slice(0, 50)));
  window.dispatchEvent(new Event("rentsphere-notifications"));
  return item;
};

export const markAllNotificationsRead = () => {
  localStorage.setItem(KEY, JSON.stringify(getNotifications().map((item) => ({ ...item, read: true }))));
  window.dispatchEvent(new Event("rentsphere-notifications"));
};

export const clearNotifications = () => {
  localStorage.setItem(KEY, "[]");
  window.dispatchEvent(new Event("rentsphere-notifications"));
};
