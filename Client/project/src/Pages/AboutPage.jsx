import { useEffect, useState } from "react";
import axios from "axios";

import Logo from "../Assets/img/GenBetaLogo.jpg";

import "./AboutPage.css";

export default function AboutPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reviews");
        setReviews(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    const interval = setInterval(() => {
      fetchReviews();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-page">

      {/* ================= ABOUT SECTION ================= */}

      <div className="about-main">

        <div className="about-text">
          <p>
            From first smiles to every mile,
            Caring for your little one with a gentle smile.
          </p>
        </div>

        <div className="about-logo">
          <img
            src={Logo}
            alt="GenBetaCare Logo"
          />
        </div>

      </div>


      {/* ================= REVIEWS ================= */}

      <div className="reviews-section">

        <h2>What Our Customers Say</h2>

        {loading ? (
          <p className="review-loading">
            Loading Reviews...
          </p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">
            No Reviews Yet
          </p>
        ) : (

          <div className="reviews-slider">

            <div className="reviews-track">

              {reviews.map((review) => (

                <a
                  key={review._id}
                  href="https://www.facebook.com/Genbetacare/reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="review-card"
                >

                  <h3>
                    {review.name}
                  </h3>

                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>

                  <p>
                    "{review.message}"
                  </p>

                </a>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}