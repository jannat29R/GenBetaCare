import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";


// ===============================
// SEND CONTACT MESSAGE
// ===============================

export const sendContactMessage = async (req, res) => {
  try {

    const { name, email, message } = req.body;


    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }


    // Email format validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }


    // Save message to MongoDB
    const contact = await Contact.create({
      name,
      email,
      message,
    });


    // ===============================
    // EMAIL SETUP
    // ===============================

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });


    // ===============================
    // SEND EMAIL TO ADMIN
    // ===============================

    await transporter.sendMail({

      from: process.env.MAIL_USER,

      to: process.env.ADMIN_EMAIL,

      replyTo: email,

      subject: `New Contact Message - GenBetaCare`,

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2 style="color: #2e8b57;">
            New Contact Message
          </h2>

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div
            style="
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
            "
          >
            ${message}
          </div>

          <br>

          <p>
            You can simply click
            <strong>Reply</strong>
            to respond to the customer.
          </p>

        </div>
      `,
    });

    

    // ===============================
    // RESPONSE
    // ===============================

    res.status(201).json({

      success: true,

      message:
        "Your message has been sent successfully",

      contact,

    });


  } catch (error) {

    console.log(
      "Contact Error:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};


// ===============================
// GET CONTACT MESSAGE
// ===============================

export const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ===============================
// DELETE CONTACT MESSAGE
// ===============================

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};