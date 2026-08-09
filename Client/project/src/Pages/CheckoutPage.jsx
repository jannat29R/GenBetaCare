import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import axios from "axios";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
  });

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  // =========================
  // LOAD CHECKOUT PRODUCTS
  // =========================

  useEffect(() => {
    const checkoutItems =
      JSON.parse(localStorage.getItem("checkoutItems")) || [];

    setProducts(checkoutItems);
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // DELIVERY AREA
  // =========================

  const handleAreaChange = (e) => {
    const value = e.target.value;

    setCustomer((prev) => ({
      ...prev,
      area: value,
    }));

    if (value === "inside") {
      setDeliveryCharge(60);
    } else if (value === "outside") {
      setDeliveryCharge(120);
    } else {
      setDeliveryCharge(0);
    }
  };

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price) * (product.quantity || 1),
    0
  );

  // =========================
  // GRAND TOTAL
  // =========================

  const grandTotal = subtotal + deliveryCharge;

  // =========================
  // CLOSE CHECKOUT
  // =========================

  const handleCloseCheckout = () => {
    const confirmClose = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (confirmClose) {
      navigate("/cart");
    }
  };

  // =========================
  // CONFIRM ORDER
  // =========================

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      alert("No products selected for checkout.");
      return;
    }

    if (
      !customer.name ||
      !customer.phone ||
      !customer.area ||
      !customer.address
    ) {
      alert("Please fill in all information.");
      return;
    }

    if (customer.phone.length < 11) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      const newOrderId =
        "GB-" + Date.now().toString().slice(-6);

      const orderData = {
        orderId: newOrderId,

        customer: customer,

        products: products.map((product) => ({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: Number(product.price),
          quantity: product.quantity || 1,
        })),

        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        total: grandTotal,

        paymentMethod: "Cash on Delivery",

        status: "Pending",
      };

      const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      orderData);

      if (res.data.success) {
        setOrderId(newOrderId);
        setOrderConfirmed(true);

        // =========================
        // SAVE LATEST ORDER
        // =========================

        localStorage.setItem(
          "latestOrder",
          JSON.stringify(res.data.order)
        );

        // =========================
        // REMOVE PURCHASED ITEMS
        // FROM CART
        // =========================

        const currentCart =
          JSON.parse(localStorage.getItem("cart")) || [];

        let updatedCart = [...currentCart];

        products.forEach((checkoutProduct) => {
          const cartProductIndex = updatedCart.findIndex(
            (item) => item._id === checkoutProduct._id
          );

          if (cartProductIndex !== -1) {
            const checkoutQuantity =
              checkoutProduct.quantity || 1;

            const cartQuantity =
              updatedCart[cartProductIndex].quantity || 1;

            const remainingQuantity =
              cartQuantity - checkoutQuantity;

            if (remainingQuantity <= 0) {
              // Remove completely
              updatedCart.splice(cartProductIndex, 1);
            } else {
              // Keep remaining quantity
              updatedCart[cartProductIndex] = {
                ...updatedCart[cartProductIndex],
                quantity: remainingQuantity,
              };
            }
          }
        });

        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart)
        );

        // =========================
        // IMPORTANT
        // CLEAR CHECKOUT ITEMS
        // =========================

        localStorage.removeItem("checkoutItems");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  // =========================
  // EMPTY CHECKOUT
  // =========================

  if (products.length === 0 && !orderConfirmed) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>No Products Selected</h2>

          <p>
            Please select your products.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="confirm-order-btn"
          >
            Products Page
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ORDER CONFIRMED
  // =========================

  if (orderConfirmed) {
    return (
      <div className="checkout-page">

        <div
          className="order-confirmation"
          id="order-invoice"
        >
          <FaCheckCircle className="success-icon" />

          <h1>Order Confirmed!</h1>

          <p className="thank-you">
            Thank you for shopping with GenBetaCare ❤️
          </p>

          {/* ORDER ID */}

          <div className="order-id">
            <strong>Order ID: </strong>
            {orderId}
          </div>

          {/* CUSTOMER */}

          <div className="confirmation-section">
            <h3>Customer Information</h3>

            <p>
              <strong>Name:</strong>{" "}
              {customer.name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {customer.phone}
            </p>

            <p>
              <strong>Delivery:</strong>{" "}
              {customer.area === "inside"
                ? "Inside Dhaka"
                : "Outside Dhaka"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {customer.address}
            </p>
          </div>

          {/* PRODUCTS */}

          <div className="confirmation-section">
            <h3>Ordered Products</h3>

            {products.map((product) => (
              <div
                className="confirmation-product"
                key={product._id}
              >
                <span>
                  {product.name} ×{" "}
                  {product.quantity || 1}
                </span>

                <span>
                  ৳{" "}
                  {Number(product.price) *
                    (product.quantity || 1)}
                </span>
              </div>
            ))}
          </div>

          {/* BILL */}

          <div className="confirmation-bill">
            <div>
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>

            <div>
              <span>Delivery Charge</span>
              <span>৳ {deliveryCharge}</span>
            </div>

            <div className="grand-total">
              <span>Total</span>
              <span>৳ {grandTotal}</span>
            </div>
          </div>

          {/* PAYMENT */}

          <p className="payment-method">
            <strong>Payment:</strong>{" "}
            Cash on Delivery
          </p>
        </div>

        {/* DOWNLOAD */}

        <button
          className="download-btn"
          onClick={() => window.print()}
        >
          Download / Print Order
        </button>

        {/* HOME */}

        <button
          className="download-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // =========================
  // CHECKOUT FORM
  // =========================

  return (
    <div className="checkout-page">

      <div className="checkout-top-bar">

        <h1 className="checkout-title">
          Checkout
        </h1>

        <button
          className="close-checkout-btn"
          onClick={handleCloseCheckout}
          title="Cancel Order"
        >
          <FaTimes />
        </button>

      </div>

      <div className="checkout-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="checkout-form-box">

          <h2>Customer Information</h2>

          <form onSubmit={handleConfirmOrder}>

            {/* NAME */}

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* PHONE */}

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            {/* AREA */}

            <div className="form-group">
              <label>Delivery Area</label>

              <select
                value={customer.area}
                onChange={handleAreaChange}
                required
              >
                <option value="">
                  Select Delivery Area
                </option>

                <option value="inside">
                  Inside Dhaka - ৳60
                </option>

                <option value="outside">
                  Outside Dhaka - ৳120
                </option>
              </select>
            </div>

            {/* ADDRESS */}

            <div className="form-group">
              <label>Full Address</label>

              <textarea
                name="address"
                value={customer.address}
                onChange={handleChange}
                rows="5"
                placeholder="House, Road, Area, District..."
                required
              />
            </div>

            {/* PAYMENT */}

            <div className="payment-box">

              <h3>Payment Method</h3>

              <label>
                <input
                  type="radio"
                  checked
                  readOnly
                />

                Cash on Delivery
              </label>

            </div>

            <button
              type="submit"
              className="confirm-order-btn"
            >
              Confirm Order
            </button>

          </form>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="order-summary-box">

          <h2>Order Summary</h2>

          <div className="summary-products">

            {products.map((product) => (
              <div
                className="summary-product"
                key={product._id}
              >

                <img
                  src={product.image}
                  alt={product.name}
                />

                <div>
                  <h4>{product.name}</h4>

                  <p>
                    Qty:{" "}
                    {product.quantity || 1}
                  </p>
                </div>

                <strong>
                  ৳{" "}
                  {Number(product.price) *
                    (product.quantity || 1)}
                </strong>

              </div>
            ))}

          </div>

          {/* BILL */}

          <div className="summary-bill">

            <div>
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>

            <div>
              <span>Delivery</span>
              <span>৳ {deliveryCharge}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>৳ {grandTotal}</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}