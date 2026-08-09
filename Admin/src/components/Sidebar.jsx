import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaEnvelope,
} from "react-icons/fa";

import Logo from "../assets/img/GenBetaLogo.jpg";
import "../styles/Sidebar.css";

export default function Sidebar() {

  const location = useLocation();
  const [open, setOpen] = useState(false);

  // lock body scroll whenever the mobile sidebar is open
  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  const closeSidebar = () => setOpen(false);

  return (
    <>

      {/* 3 Dot Button - Mobile */}
      <button
        className="sidebar-menu-btn"
        onClick={() => setOpen(!open)}
      >
        ⋮
      </button>


      {/* Backdrop - click to close on mobile */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={closeSidebar}
      />


      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>

        <div className="sidebar-brand">

          <img
            src={Logo}
            alt="GenBetaCare Logo"
            className="sidebar-logo-img"
          />

          <h2 className="sidebar-logo">
            Admin Panel
          </h2>

        </div>


        <nav>

          <Link
            to="/admin"
            className={
              location.pathname === "/admin"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            <FaHome />
            Dashboard
          </Link>


          <Link
            to="/admin/products"
            className={
              location.pathname === "/admin/products"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            <FaBox />
            Products
          </Link>


          <Link
            to="/admin/orders"
            className={
              location.pathname === "/admin/orders"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            <FaShoppingCart />
            Orders
          </Link>


          <Link
            to="/admin/messages"
            className={
              location.pathname === "/admin/messages"
                ? "active"
                : ""
            }
            onClick={closeSidebar}
          >
            <FaEnvelope />
            Messages
          </Link>
          <div>
            <button className="logout-btn" onClick={() => {
              window.location.href = "/admin/login";
            }}>
              Logout  
            </button>
          </div>

        </nav>

      </div>

    </>
  );
}