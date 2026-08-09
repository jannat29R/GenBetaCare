import { Link } from "react-router-dom";
import React, { useState } from "react";
import Logo from "../assets/img/GenBetaLogo.jpg";

import "../Components/Navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">

        <img
          src={GenBetaCareLogo}
          alt="GenBetaCare Logo"
          onClick={() => window.location.href = "/"}
        />

        <h2
          onClick={() => window.location.href = "/"}
        >
          GenBetaCare
        </h2>

      </div>


      {/* Desktop Navigation */}
      <div className="nav-links">

        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/wishlist">Wishlist ❤️</Link>
        <Link to="/cart">Cart 🛒</Link>
        <Link to="/checkout">Checkout</Link>

      </div>


      {/* Mobile 3 Dot */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ⋮
      </button>


      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist ❤️
          </Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart 🛒
          </Link>

          <Link to="/checkout" onClick={() => setMenuOpen(false)}>
            Checkout
          </Link>

        </div>
      )}

    </nav>
  );
}

export default Navbar;