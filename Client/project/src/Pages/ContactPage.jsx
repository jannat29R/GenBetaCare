import React, { useState } from "react";
import axios from "axios";
import Logo from "../Assets/img/GenBetaLogo.jpg";
import "../Pages/ContactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // Empty field check
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      if (res.data.success) {
        setSuccess("Your message has been sent successfully!");

        // Clear form
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* LEFT SIDE - CONTACT INFO */}
        <div className="contact-info">
          <h1>Contact Us</h1>

          <p>
            Have any questions or need help? Feel free to contact us.
            We are always happy to hear from you and assist you with
            any queries regarding GenBetaCare products.
          </p>
        </div>

        {/* FORM */}
        <div className="contact-form-box">
          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="contact-field">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            {/* EMAIL */}
            <div className="contact-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            {/* MESSAGE */}
            <div className="contact-field">
              <label>Message</label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Enter your message"
              ></textarea>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
              <p className="contact-success">
                {success}
              </p>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <p className="contact-error">
                {error}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="contact-submit-btn"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - LOGO */}
        <div>
          <img
            className="contact-logo"
            src={Logo}
            alt="GenBetaCare Logo"
          />
        </div>

      </div>
    </div>
  );
}