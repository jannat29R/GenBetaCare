import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../models/Admin.js";


// =========================
// ADMIN LOGIN
// =========================

export const adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;


    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

    }


    const admin = await Admin.findOne({ email });


    // =========================
    // WRONG EMAIL
    // =========================

    if (!admin) {

      await sendSecurityMail(email);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }


    // =========================
    // CHECK PASSWORD
    // =========================

    const passwordMatch =
      await bcrypt.compare(
        password,
        admin.password
      );


    if (!passwordMatch) {

      await sendSecurityMail(email);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }


    // =========================
    // CREATE TOKEN
    // =========================

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    res.json({

      success: true,

      message: "Login successful",

      token,

      admin: {
        name: admin.name,
        email: admin.email,
      },

    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};


// =========================
// SECURITY EMAIL
// =========================

const sendSecurityMail = async (attemptEmail) => {

  try {

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },

      });


    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: process.env.ADMIN_EMAIL,

      subject: "⚠️ GenBetaCare Admin Login Attempt",

      html: `
        <h2>Admin Login Alert</h2>

        <p>
          Someone tried to access the GenBetaCare Admin Panel.
        </p>

        <p>
          <strong>Attempted Email:</strong>
          ${attemptEmail}
        </p>

        <p>
          If this was not you, please check your admin credentials.
        </p>
      `,

    });

  } catch (error) {

    console.log(
      "Security email failed:",
      error
    );

  }

};