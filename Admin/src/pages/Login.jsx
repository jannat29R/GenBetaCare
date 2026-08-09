import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        "http://localhost:5000/api/admin/login",
        {
          email,
          password,
        }
      );


      if (res.data.success) {

        // Save token
        localStorage.setItem(
          "adminToken",
          res.data.token
        );


        // Save admin information
        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );


        alert(
          `Welcome ${res.data.admin.name}!`
        );


        // Go to admin dashboard
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

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              required
            />

          </div>
              <br />
              {/* <a className="forgotpass" href="">Forgot Password</a> */}
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