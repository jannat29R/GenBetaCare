import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEye,
} from "react-icons/fa";

import "../styles/Orders.css";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);


  // =========================
  // FETCH ORDERS
  // =========================

 const fetchOrders = async () => {

  try {

    const res = await axios.get(
      "http://localhost:5000/api/orders"
    );

    const allOrders =
      res.data.orders || [];

    // Only pending orders in active order list
    const pendingOrders =
      allOrders.filter(
        (order) => order.status === "Pending"
      );

    setOrders(pendingOrders);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

};


  useEffect(() => {

    fetchOrders();


    // Auto refresh

    const interval =
      setInterval(() => {

        fetchOrders();

      }, 10000);


    return () =>
      clearInterval(interval);

  }, []);


  // =========================
  // DELETE ORDER
  // =========================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );


    if (!confirmDelete) return;


    try {

      await axios.delete(
        `http://localhost:5000/api/orders/${id}`
      );


      setOrders((prev) =>
        prev.filter(
          (order) =>
            order._id !== id
        )
      );


    } catch (error) {

      console.log(error);

      alert(
        "Failed to delete order."
      );

    }

  };


  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (
      id,
      status
    ) => {

      try {

        await axios.put(
          `http://localhost:5000/api/orders/${id}`,
          { status }
        );

        // Remove from active order list
        setOrders((prev) =>
          prev.filter(
            (order) =>
              order._id !== id
          )
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update order."
        );

      }

};


  if (loading) {

    return (

      <div className="orders-page">

        <h2>
          Loading Orders...
        </h2>

      </div>

    );

  }


  return (

    <div className="orders-page">


      <div className="orders-header">

        <h1>
          Orders
        </h1>

        <span>
          {orders.length} Orders
        </span>

      </div>


      {orders.length === 0 ? (

        <div className="no-orders">

          <h2>
            No Orders Found
          </h2>

          <p>
            Customer orders will appear here.
          </p>

        </div>

      ) : (

        <div className="orders-table-container">

          <table className="orders-table">

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Area
                </th>

                <th>
                  Products
                </th>

                <th>
                  Total
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Status
                </th>

                <th>
                  Date
                </th>
              </tr>

            </thead>


            <tbody>

              {orders.map(
                (order) => (

                  <tr
                    key={order._id}
                  >

                    <td className="order-id-cell">

                      {order.orderId}

                    </td>


                    <td>

                      {order.customer.name}

                    </td>


                    <td>

                      {order.customer.phone}

                    </td>


                    <td>

                      {order.customer.area ===
                      "inside"
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}

                    </td>


                    <td>

                      <div className="order-products">

                        {order.products.map(
                          (product) => (

                            <div
                              key={
                                product.productId
                              }
                              className="order-product"
                            >

                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                              />

                              <span>

                                {product.name}
                                {" × "}
                                {product.quantity}

                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </td>


                    <td className="order-total">

                      ৳ {order.total}

                    </td>


                    <td>

                      {order.paymentMethod}

                    </td>


                    <td>

                      <button
                        className="deliver-order-btn"
                        onClick={() =>
                          handleStatusChange(
                            order._id,
                            "Delivered"
                          )
                        }
                      >
                        Mark as Delivered
                    </button>

                    </td>


                    <td>

                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}

                    </td>


                    <td>

                      <button
                        className="delete-order-btn"
                        onClick={() =>
                          handleDelete(
                            order._id
                          )
                        }
                        title="Delete Order"
                      >

                        <FaTrash />

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}