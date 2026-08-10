import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/product/p1.jpg";
import img2 from "../assets/product/p2.jpg";
import img3 from "../assets/product/p3.jpg";
import img4 from "../assets/product/p5.jpg";

import "../Components/Hero.css";

export default function Hero() {
  const ads = [
    { id: 1, image: img1 },
    { id: 2, image: img2 },
    { id: 3, image: img3 },
    { id: 4, image: img4 },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">

      <div className="hero-container">

        {/* LEFT - TEXT */}
        <div className="hero-content">

          <p className="hero-small-title">
            WELCOME TO GENBETACARE
          </p>

          <h1>
            Trusted Babycare Products
          </h1>

          <p className="hero-description">
            From first smiles to every mile, Caring for your little one
            with a gentle smile.
          </p>

          <div className="hero-buttons">

            <Link to="/products">
              <button className="shop-btn">
                Shop Now
              </button>
            </Link>

            <Link to="/about">
              <button className="learn-btn">
                Learn More
              </button>
            </Link>

          </div>

        </div>


        {/* RIGHT - IMAGE */}
        <div className="hero-image-area">

          <Link to={`/product/${ads[current].id}`}>

            <img
              src={ads[current].image}
              alt="GenBetaCare Product"
              className="hero-product-image"
            />

          </Link>

          {/* DOTS */}
          <div className="hero-dots">

            {ads.map((_, index) => (
              <span
                key={index}
                className={
                  current === index
                    ? "hero-dot active"
                    : "hero-dot"
                }
              ></span>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}