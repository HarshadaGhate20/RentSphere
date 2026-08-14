import React, { useEffect, useState } from "react";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";
import { clearNotifications, getNotifications, markAllNotificationsRead } from "../utils/notifications";
import "../assets/css/notificationCenter.css";

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(getNotifications());
  useEffect(() => {
    const refresh = () => setItems(getNotifications());
    window.addEventListener("storage", refresh);
    window.addEventListener("rentsphere-notifications", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("rentsphere-notifications", refresh); };
  }, []);
  const unread = items.filter((item) => !item.read).length;
  return <div className="notification-center">
    <button className="notification-bell" type="button" onClick={() => setOpen(!open)} aria-label="Notifications"><FaBell />{unread > 0 && <span>{unread}</span>}</button>
    {open && <section className="notification-panel">
      <header><div><strong>Notifications</strong><small>{unread} unread</small></div><button onClick={markAllNotificationsRead} title="Mark all read"><FaCheck /></button><button onClick={clearNotifications} title="Clear"><FaTrash /></button></header>
      <div>{items.length ? items.map((item) => <article className={item.read ? "" : "unread"} key={item.id}><strong>{item.title}</strong><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString("en-IN")}</small></article>) : <p className="notification-empty">No notifications yet.</p>}</div>
    </section>}
  </div>;
};
export default NotificationCenter;
