import { useEffect, useState } from "react";

import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

import "./CartPage.css";

export default function CartPage() {

  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);


  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(savedCart);

  }, []);


  // =========================
  // SELECT / UNSELECT
  // =========================

  const handleSelect = (id) => {

    setSelectedItems((prev) => {

      if (prev.includes(id)) {

        return prev.filter(
          (itemId) => itemId !== id
        );

      }

      return [...prev, id];

    });

  };


  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (id) => {

    const updatedCart = cart.map(
      (product) => {

        if (product._id === id) {

          return {
            ...product,
            quantity:
              (product.quantity || 1) + 1,
          };

        }

        return product;

      }
    );


    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (id) => {

    const updatedCart = cart.map(
      (product) => {

        if (product._id === id) {

          return {
            ...product,
            quantity: Math.max(
              (product.quantity || 1) - 1,
              1
            ),
          };

        }

        return product;

      }
    );


    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // =========================
  // REMOVE PRODUCT
  // =========================

  const removeFromCart = (id) => {

    const updatedCart =
      cart.filter(
        (product) =>
          product._id !== id
      );


    setCart(updatedCart);


    setSelectedItems((prev) =>
      prev.filter(
        (itemId) => itemId !== id
      )
    );


    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // =========================
  // SELECTED PRODUCTS
  // =========================

  const selectedProducts =
    cart.filter((product) =>
      selectedItems.includes(
        product._id
      )
    );


  // =========================
  // TOTAL
  // =========================

  const total =
    selectedProducts.reduce(
      (sum, product) =>
        sum +
        Number(product.price) *
          (product.quantity || 1),
      0
    );


  // =========================
// CHECKOUT
// =========================

const handleCheckout = () => {

  // No selected product
  if (selectedItems.length === 0) {
    alert("Please select at least one product.");
    return;
  }

  // Get currently selected products
  const selectedProducts = cart.filter((product) =>
    selectedItems.includes(product._id)
  );

  // No product found
  if (selectedProducts.length === 0) {
    alert("No products selected.");
    return;
  }

  // Check stock
  const outOfStock = selectedProducts.some(
    (product) => !product.stock
  );

  if (outOfStock) {
    alert("Some selected products are out of stock.");
    return;
  }

  // IMPORTANT:
  // Remove any old checkout data first
  localStorage.removeItem("checkoutItems");

  // Save ONLY currently selected products
  localStorage.setItem(
    "checkoutItems",
    JSON.stringify(selectedProducts)
  );

  // Go to checkout
  window.location.href = "/checkout";
};


  return (

    <div className="cart-page">


      {/* HEADER */}

      <h1 className="cart-title">

        <FaShoppingCart />

        My Cart

      </h1>


      {/* EMPTY CART */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>
            Your Cart is Empty
          </h2>

          <p>
            Add some products to your
            cart 🛒
          </p>

        </div>

      ) : (

        <>


          {/* CART PRODUCTS */}

          <div className="cart-list">

            {cart.map((product) => (

              <div
                className="cart-row"
                key={product._id}
              >


                {/* SELECT */}

                <div className="cart-select">

                  <input
                    type="checkbox"
                    checked={selectedItems.includes(
                      product._id
                    )}
                    onChange={() =>
                      handleSelect(
                        product._id
                      )
                    }
                  />

                </div>


                {/* IMAGE */}

                <div className="cart-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>


                {/* PRODUCT INFO */}

                <div className="cart-info">

                  <h3>
                    {product.name}
                  </h3>

                  <p
                    className={
                      product.stock
                        ? "in-stock"
                        : "out-stock"
                    }
                  >
                    {product.stock
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>

                </div>


                {/* PRICE */}

                <div className="cart-price">

                  ৳ {product.price}

                </div>


                {/* QUANTITY */}

                <div className="cart-quantity">

                  <button
                    onClick={() =>
                      decreaseQuantity(
                        product._id
                      )
                    }
                    disabled={
                      (product.quantity || 1) <= 1
                    }
                  >

                    <FaMinus />

                  </button>


                  <span>
                    {product.quantity || 1}
                  </span>


                  <button
                    onClick={() =>
                      increaseQuantity(
                        product._id
                      )
                    }
                    disabled={
                      !product.stock
                    }
                  >

                    <FaPlus />

                  </button>

                </div>


                {/* REMOVE */}

                <button
                  className="cart-remove-btn"
                  onClick={() =>
                    removeFromCart(
                      product._id
                    )
                  }
                  title="Remove"
                >

                  <FaTrash />

                </button>


              </div>

            ))}

          </div>


          {/* CART SUMMARY */}

          <div className="cart-summary">


            <div className="selected-count">

              <span>
                Selected Items:
              </span>

              <strong>
                {selectedItems.length}
              </strong>

            </div>


            <div className="cart-total">

              Total:

              <strong>
                ৳ {total}
              </strong>

            </div>


            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={
                selectedItems.length === 0
              }
            >

              Proceed to Checkout

            </button>


          </div>

        </>

      )}

    </div>

  );

}
