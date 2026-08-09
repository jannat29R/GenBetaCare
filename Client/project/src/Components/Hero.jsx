import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/product/p1.jpg";
import img2 from "../assets/product/p2.jpg";
import img3 from "../assets/product/p3.jpg";
import img4 from "../assets/product/p5.jpg";

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

    <section
      style={{
        background: "#f8f9fa",
        padding: "60px 8%",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "60px",
        }}
      >

        {/* Left */}

        <div style={{ flex: 1 }}>

          <p
            style={{
              color: "#2E8B57",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            WELCOME TO GENBETACARE
          </p>

          <h1
            style={{
              fontSize: "52px",
              margin: "20px 0",
              color: "#222",
            }}
          >
            Trusted Babycare Products
          </h1>

          <p
            style={{
              color: "#666",
              lineHeight: "30px",
              marginBottom: "30px",
            }}
          >
            From first smiles to every mile, Caring for your little one with a gentle smile.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >

            <Link to="/products">
              <button
                style={{
                  padding: "14px 28px",
                  background: "#2E8B57",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Shop Now
              </button>
            </Link>

            <Link to="/about">
              <button
                style={{
                  padding: "14px 28px",
                  background: "#d4b07d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Learn More
              </button>
            </Link>

          </div>

        </div>

        {/* Right */}

        <div
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >

          <Link to={`/product/${ads[current].id}`}>

            <img
              src={ads[current].image}
              alt="Advertisement"
              style={{
                width: "450px",
                height: "450px",
                objectFit: "contain",
                cursor: "pointer",
                transition: ".4s",
              }}
            />

          </Link>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >

            {ads.map((_, index) => (

              <span
                key={index}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background:
                    current === index ? "#2E8B57" : "#ccc",
                }}
              ></span>

            ))}

          </div>

        </div>

      </div>

    </section>

  );
}