import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Dashboard.css";

export default function Dashboard() {

  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  const [loading, setLoading] = useState(true);


  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {

    try {

      const [
        productsRes,
        ordersRes,
        messagesRes
      ] = await Promise.all([

        axios.get(
          "http://localhost:5000/api/products"
        ),

        axios.get(
          "http://localhost:5000/api/orders"
        ),

        axios.get(
          "http://localhost:5000/api/contact"
        )

      ]);


      // =========================
      // PRODUCTS
      // =========================

      const products =
        productsRes.data || [];

      setTotalProducts(
        products.length
      );


      // =========================
      // ORDERS
      // =========================

      const orders =
        ordersRes.data.orders || [];


      const pending =
        orders.filter(
          (order) =>
            order.status === "Pending"
        );


      const completed =
        orders.filter(
          (order) =>
            order.status === "Delivered"
        );


      setPendingOrders(
        pending.length
      );

      setCompletedOrders(
        completed.length
      );


      // =========================
      // MESSAGES
      // =========================

      const messages =
        messagesRes.data.messages || [];

      setTotalMessages(
        messages.length
      );


    } catch (error) {

      console.log(
        "Dashboard Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchDashboardData();


    // Auto refresh every 10 seconds

    const interval =
      setInterval(() => {

        fetchDashboardData();

      }, 10000);


    return () =>
      clearInterval(interval);

  }, []);


  return (

    <div className="dashboard">


      {/* TOTAL PRODUCTS */}

      <div className="card"
      onClick={() => window.location.href = "/admin/products"}>

        <h3>
          Total Products
        </h3>

        <h2>

          {loading
            ? "..."
            : totalProducts}

        </h2>

      </div>


      {/* PENDING ORDERS */}

      <div className="card"
      onClick={() => window.location.href = "/admin/orders"}>

        <h3>
          Pending Orders
        </h3>

        <h2>

          {loading
            ? "..."
            : pendingOrders}

        </h2>

      </div>


      {/* COMPLETED ORDERS */}

      <div className="card">

        <h3>
          Completed Orders
        </h3>

        <h2>

          {loading
            ? "..."
            : completedOrders}

        </h2>

      </div>


      {/* TOTAL MESSAGES */}

      <div className="card"
      onClick={() => window.location.href = "/admin/messages"}>

        <h3>
          Total Messages
        </h3>

        <h2>

          {loading
            ? "..."
            : totalMessages}

        </h2>

      </div>


    </div>

  );

}