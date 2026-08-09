import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import axios from "axios";

import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();

  // =========================
  // CHECKOUT PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);

  // Products shown after successful order
  const [confirmedProducts, setConfirmedProducts] = useState([]);

  // =========================
  // CUSTOMER
  // =========================

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    area: "",
  });

  // =========================
  // OTHER STATES
  // =========================

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // LOAD CHECKOUT PRODUCTS
  // =====================================================

  useEffect(() => {
    const savedItems = localStorage.getItem("checkoutItems");

    // No checkout data
    if (!savedItems) {
      setProducts([]);
      return;
    }

    try {
      const parsedItems = JSON.parse(savedItems);

      if (
        Array.isArray(parsedItems) &&
        parsedItems.length > 0
      ) {
        setProducts(parsedItems);
      } else {
        setProducts([]);

        localStorage.removeItem("checkoutItems");
      }
    } catch (error) {
      console.log("Checkout data error:", error);

      setProducts([]);

      localStorage.removeItem("checkoutItems");
    }
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // DELIVERY AREA
  // =====================================================

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

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price) *
        (product.quantity || 1),
    0
  );

  // =====================================================
  // GRAND TOTAL
  // =====================================================

  const grandTotal =
    subtotal + deliveryCharge;

  // =====================================================
  // CLOSE CHECKOUT
  // =====================================================

  const handleCloseCheckout = () => {
    const confirmClose = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (confirmClose) {
      // Cancel checkout
      localStorage.removeItem(
        "checkoutItems"
      );

      navigate("/cart");
    }
  };

  // =====================================================
  // CONFIRM ORDER
  // =====================================================

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    // Prevent double click
    if (submitting) {
      return;
    }

    // =========================
    // NO PRODUCTS
    // =========================

    if (products.length === 0) {
      alert(
        "No products selected for checkout."
      );

      navigate("/cart");

      return;
    }

    // =========================
    // VALIDATION
    // =========================

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.area ||
      !customer.address.trim()
    ) {
      alert(
        "Please fill in all information."
      );

      return;
    }

    // =========================
    // PHONE VALIDATION
    // =========================

    const phone =
      customer.phone.trim();

    if (
      phone.length < 11 ||
      !/^[0-9]+$/.test(phone)
    ) {
      alert(
        "Please enter a valid phone number."
      );

      return;
    }

    // =========================
    // START SUBMIT
    // =========================

    try {
      setSubmitting(true);

      // Generate order ID
      const newOrderId =
        "GB-" +
        Date.now()
          .toString()
          .slice(-6);

      // =========================
      // ORDER DATA
      // =========================

      const orderData = {
        orderId: newOrderId,

        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          area: customer.area,
        },

        products: products.map(
          (product) => ({
            productId: product._id,
            name: product.name,
            image: product.image,
            price: Number(product.price),
            quantity:
              product.quantity || 1,
          })
        ),

        subtotal: subtotal,

        deliveryCharge:
          deliveryCharge,

        total: grandTotal,

        paymentMethod:
          "Cash on Delivery",

        status: "Pending",
      };

      // =========================
      // SEND TO BACKEND
      // =========================

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData
      );

      // =========================
      // SUCCESS
      // =========================

      if (res.data.success) {
        // IMPORTANT:
        // Save products separately
        // for confirmation page
        setConfirmedProducts([
          ...products,
        ]);

        setOrderId(newOrderId);

        setOrderConfirmed(true);

        // =========================
        // SAVE LATEST ORDER
        // =========================

        if (res.data.order) {
          localStorage.setItem(
            "latestOrder",
            JSON.stringify(
              res.data.order
            )
          );
        }

        // =========================
        // REMOVE PURCHASED ITEMS
        // FROM CART
        // =========================

        const currentCart =
          JSON.parse(
            localStorage.getItem("cart")
          ) || [];

        const updatedCart =
          currentCart.filter(
            (cartProduct) => {
              const checkoutProduct =
                products.find(
                  (product) =>
                    product._id ===
                    cartProduct._id
                );

              // Product wasn't purchased
              if (!checkoutProduct) {
                return true;
              }

              const checkoutQuantity =
                checkoutProduct.quantity ||
                1;

              const cartQuantity =
                cartProduct.quantity || 1;

              const remainingQuantity =
                cartQuantity -
                checkoutQuantity;

              // Keep only if quantity remains
              return remainingQuantity > 0;
            }
          );

        // =========================
        // UPDATE REMAINING QUANTITY
        // =========================

        const finalCart =
          updatedCart.map(
            (cartProduct) => {
              const checkoutProduct =
                products.find(
                  (product) =>
                    product._id ===
                    cartProduct._id
                );

              if (!checkoutProduct) {
                return cartProduct;
              }

              const checkoutQuantity =
                checkoutProduct.quantity ||
                1;

              const originalQuantity =
                cartProduct.quantity ||
                1;

              return {
                ...cartProduct,
                quantity:
                  originalQuantity -
                  checkoutQuantity,
              };
            }
          );

        localStorage.setItem(
          "cart",
          JSON.stringify(finalCart)
        );

        // =========================
        // VERY IMPORTANT
        // CLEAR CHECKOUT DATA
        // =========================

        localStorage.removeItem(
          "checkoutItems"
        );

        // DO NOT:
        // setProducts([])
        //
        // because confirmation
        // needs the products.
      }
    } catch (error) {
      console.log(
        "Order error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // EMPTY CHECKOUT
  // =====================================================

  if (
    products.length === 0 &&
    !orderConfirmed
  ) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>
            No Products Selected
          </h2>

          <p>
            Please select products from
            your cart before checkout.
          </p>

          <button
            onClick={() =>
              navigate("/cart")
            }
            className="confirm-order-btn"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDER CONFIRMED
  // =====================================================

  if (orderConfirmed) {
    // Calculate confirmation subtotal
    const confirmedSubtotal =
      confirmedProducts.reduce(
        (sum, product) =>
          sum +
          Number(product.price) *
            (product.quantity || 1),
        0
      );

    const confirmedGrandTotal =
      confirmedSubtotal +
      deliveryCharge;

    return (
      <div className="checkout-page">

        {/* =========================
            CONFIRMATION
        ========================= */}

        <div
          className="order-confirmation"
          id="order-invoice"
        >
          <FaCheckCircle className="success-icon" />

          <h1>
            Order Confirmed!
          </h1>

          <p className="thank-you">
            Thank you for shopping with
            GenBetaCare ❤️
          </p>

          {/* ORDER ID */}

          <div className="order-id">
            <strong>
              Order ID:
            </strong>{" "}
            {orderId}
          </div>

          {/* CUSTOMER */}

          <div className="confirmation-section">
            <h3>
              Customer Information
            </h3>

            <p>
              <strong>
                Name:
              </strong>{" "}
              {customer.name}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {customer.phone}
            </p>

            <p>
              <strong>
                Delivery:
              </strong>{" "}
              {customer.area ===
              "inside"
                ? "Inside Dhaka"
                : "Outside Dhaka"}
            </p>

            <p>
              <strong>
                Address:
              </strong>{" "}
              {customer.address}
            </p>
          </div>

          {/* PRODUCTS */}

          <div className="confirmation-section">
            <h3>
              Ordered Products
            </h3>

            {confirmedProducts.map(
              (product) => (
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
              )
            )}
          </div>

          {/* BILL */}

          <div className="confirmation-bill">
            <div>
              <span>
                Subtotal
              </span>

              <span>
                ৳ {confirmedSubtotal}
              </span>
            </div>

            <div>
              <span>
                Delivery Charge
              </span>

              <span>
                ৳ {deliveryCharge}
              </span>
            </div>

            <div className="grand-total">
              <span>
                Total
              </span>

              <span>
                ৳ {confirmedGrandTotal}
              </span>
            </div>
          </div>

          {/* PAYMENT */}

          <p className="payment-method">
            <strong>
              Payment:
            </strong>{" "}
            Cash on Delivery
          </p>
        </div>

        {/* =========================
            PRINT
        ========================= */}

        <button
          className="download-btn"
          onClick={() =>
            window.print()
          }
        >
          Download / Print Order
        </button>

        {/* =========================
            HOME
        ========================= */}

        <button
          className="download-btn"
          onClick={() =>
            navigate("/")
          }
        >
          Back to Home
        </button>
      </div>
    );
  }

  // =====================================================
  // CHECKOUT FORM
  // =====================================================

  return (
    <div className="checkout-page">

      {/* TOP BAR */}

      <div className="checkout-top-bar">

        <h1 className="checkout-title">
          Checkout
        </h1>

        <button
          className="close-checkout-btn"
          onClick={
            handleCloseCheckout
          }
          title="Cancel Order"
        >
          <FaTimes />
        </button>

      </div>

      {/* CONTAINER */}

      <div className="checkout-container">

        {/* =========================
            LEFT
        ========================= */}

        <div className="checkout-form-box">

          <h2>
            Customer Information
          </h2>

          <form
            onSubmit={
              handleConfirmOrder
            }
          >

            {/* NAME */}

            <div className="form-group">
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  customer.name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* PHONE */}

            <div className="form-group">
              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={
                  customer.phone
                }
                onChange={
                  handleChange
                }
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            {/* AREA */}

            <div className="form-group">
              <label>
                Delivery Area
              </label>

              <select
                value={
                  customer.area
                }
                onChange={
                  handleAreaChange
                }
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
              <label>
                Full Address
              </label>

              <textarea
                name="address"
                value={
                  customer.address
                }
                onChange={
                  handleChange
                }
                rows="5"
                placeholder="House, Road, Area, District..."
                required
              />
            </div>

            {/* PAYMENT */}

            <div className="payment-box">

              <h3>
                Payment Method
              </h3>

              <label>
                <input
                  type="radio"
                  checked
                  readOnly
                />

                Cash on Delivery
              </label>

            </div>

            {/* CONFIRM */}

            <button
              type="submit"
              className="confirm-order-btn"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Placing Order..."
                : "Confirm Order"}
            </button>

          </form>
        </div>

        {/* =========================
            RIGHT
        ========================= */}

        <div className="order-summary-box">

          <h2>
            Order Summary
          </h2>

          <div className="summary-products">

            {products.map(
              (product) => (
                <div
                  className="summary-product"
                  key={product._id}
                >

                  <img
                    src={product.image}
                    alt={
                      product.name
                    }
                  />

                  <div>
                    <h4>
                      {product.name}
                    </h4>

                    <p>
                      Qty:{" "}
                      {product.quantity ||
                        1}
                    </p>
                  </div>

                  <strong>
                    ৳{" "}
                    {Number(
                      product.price
                    ) *
                      (product.quantity ||
                        1)}
                  </strong>

                </div>
              )
            )}

          </div>

          {/* BILL */}

          <div className="summary-bill">

            <div>
              <span>
                Subtotal
              </span>

              <span>
                ৳ {subtotal}
              </span>
            </div>

            <div>
              <span>
                Delivery
              </span>

              <span>
                ৳ {deliveryCharge}
              </span>
            </div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ৳ {grandTotal}
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}