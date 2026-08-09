import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "adminToken",
          res.data.token
        );

        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );

        alert(`Welcome ${res.data.admin.name}!`);

        navigate("/admin");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-form">

        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="box">

            <label htmlFor="email">
              Email:
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter admin email"
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="box">

            <label htmlFor="password">
              Password:
            </label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEye />
                  
                ) : (
                  <FaEyeSlash />
                )}
              </button>

            </div>

          </div>

          <br />

          {/* LOGIN */}
          <div className="btn">

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}