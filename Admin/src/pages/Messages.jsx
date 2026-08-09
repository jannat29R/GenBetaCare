import { useEffect, useState } from "react";
import axios from "axios";
import { FaReply, FaTrash } from "react-icons/fa";

import "./../styles/Messages.css";

export default function Messages() {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);


  // =========================
  // FETCH MESSAGES
  // =========================

  const fetchMessages = async () => {

    try {

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/contact`);

      setMessages(res.data.messages);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchMessages();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);

    return () => clearInterval(interval);

  }, []);


  // =========================
  // DELETE MESSAGE
  // =========================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
  `${import.meta.env.VITE_API_URL}/api/contact/${id}`);

      setMessages((prevMessages) =>
        prevMessages.filter(
          (message) => message._id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert("Failed to delete message.");

    }

  };


  // =========================
  // REPLY
  // =========================

  const handleReply = (email) => {

    const subject = encodeURIComponent(
      "Reply from GenBetaCare"
    );

    const body = encodeURIComponent(
      "Hello,\n\nThank you for contacting GenBetaCare.\n\n"
    );

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(email)}` +
      `&su=${subject}` +
      `&body=${body}`;

    window.open(
      gmailUrl,
      "_blank"
    );

  };


  return (

    <div className="messages-page">


      {/* HEADER */}

      <div className="messages-header">

        <h1>Messages</h1>

        <span>
          {messages.length} Messages
        </span>

      </div>


      {/* LOADING */}

      {loading ? (

        <div className="messages-loading">
          Loading Messages...
        </div>


      ) : messages.length === 0 ? (

        <div className="no-messages">
          No Messages Found
        </div>


      ) : (

        <div className="messages-table-container">

          <table className="messages-table">

            <thead>

              <tr>

                <th>Name</th>

                <th>Email</th>

                <th>Message</th>

                <th>Date</th>

                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {messages.map((message) => (

                <tr key={message._id}>


                  {/* NAME */}

                  <td className="message-name">
                    {message.name}
                  </td>


                  {/* EMAIL */}

                  <td className="message-email">
                    {message.email}
                  </td>


                  {/* MESSAGE */}

                  <td className="message-text">
                    {message.message}
                  </td>


                  {/* DATE */}

                  <td>

                    {new Date(
                      message.createdAt
                    ).toLocaleDateString()}

                  </td>


                  {/* ACTION */}

                  <td>

                    {/* REPLY */}

                    <button
                      className="reply-message-btn"
                      onClick={() =>
                        handleReply(message.email)
                      }
                      title="Reply"
                    >
                      <FaReply />
                    </button>


                    {/* DELETE */}

                    <button
                      className="delete-message-btn"
                      onClick={() =>
                        handleDelete(message._id)
                      }
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}