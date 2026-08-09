import { FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer
      style={{
        background: "#dbb989",
        color: "white",
        padding: "30px 40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side */}
        <div>
          <h2 style={{ marginBottom: "10px" }}>GenBetaCare</h2>

          <p>📍 Dhaka, Bangladesh - 1207</p>
          <p>🕒 Open 24/7</p>
          <p>📞 01863-823844</p>
          <p>✉️ genbetacare@gmail.com</p>
        </div>

        {/* Right Side */}
        <div style={{ textAlign: "center" }}>
          <h3>Follow Us</h3>

          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <a
              href="https://www.facebook.com/Genbetacare"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", fontSize: "28px" }}
            >
              <FaFacebook />
            </a>

            <a
              href="https://www.instagram.com/gen.betacare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", fontSize: "28px" }}
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <hr
        style={{
          margin: "20px 0",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      />

      <p style={{ textAlign: "center", margin: 0 }}>
        © 2026 GenBetaCare. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;