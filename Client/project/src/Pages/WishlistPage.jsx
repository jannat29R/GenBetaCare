import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../Pages/WishlistPage.css";

export default function WishlistPage() {

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});


  // =========================
  // LOAD WISHLIST
  // =========================

  useEffect(() => {

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlist(savedWishlist);


    // Default quantity = 1

    const initialQuantity = {};

    savedWishlist.forEach((product) => {

      initialQuantity[product._id] = 1;

    });

    setQuantities(initialQuantity);

  }, []);


  // =========================
  // ADD SELECTED PRODUCT TO CART
  // =========================

  const handleAddToCart = (product) => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    const selectedQuantity =
      quantities[product._id] || 1;


    const existingProduct =
      savedCart.find(
        (item) =>
          item._id === product._id
      );


    if (existingProduct) {

      existingProduct.quantity =
        (existingProduct.quantity || 1) +
        selectedQuantity;

    } else {

      savedCart.push({

        ...product,

        quantity: selectedQuantity,

      });

    }


    localStorage.setItem(
      "cart",
      JSON.stringify(savedCart)
    );


    // Remove from selected items

    setSelectedItems((prev) =>
      prev.filter(
        (itemId) =>
          itemId !== product._id
      )
    );


    alert(
      `${product.name} added to cart!`
    );


    navigate("/cart");

  };


  // =========================
  // SELECT / UNSELECT
  // =========================

  const handleSelect = (id) => {

    setSelectedItems((prev) =>

      prev.includes(id)

        ? prev.filter(
            (itemId) =>
              itemId !== id
          )

        : [
            ...prev,
            id,
          ]

    );

  };


  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (id) => {

    setQuantities((prev) => ({

      ...prev,

      [id]:
        (prev[id] || 1) + 1,

    }));

  };


  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (id) => {

    setQuantities((prev) => ({

      ...prev,

      [id]: Math.max(
        (prev[id] || 1) - 1,
        1
      ),

    }));

  };


  // =========================
  // REMOVE FROM WISHLIST
  // =========================

  const removeFromWishlist = (id) => {

    const updatedWishlist =
      wishlist.filter(
        (product) =>
          product._id !== id
      );


    setWishlist(
      updatedWishlist
    );


    setSelectedItems((prev) =>
      prev.filter(
        (itemId) =>
          itemId !== id
      )
    );


    localStorage.setItem(
      "wishlist",
      JSON.stringify(
        updatedWishlist
      )
    );

  };


  // =========================
  // TOTAL OF SELECTED PRODUCTS
  // =========================

  const total = wishlist

    .filter((product) =>
      selectedItems.includes(
        product._id
      )
    )

    .reduce(

      (sum, product) =>

        sum +
        Number(product.price) *
          (quantities[product._id] || 1),

      0

    );


  return (

    <div className="wishlist-page">


      {/* TITLE */}

      <h1>
        My Wishlist
      </h1>


      {wishlist.length === 0 ? (

        /* EMPTY WISHLIST */

        <div className="empty-wishlist">

          <h2>
            Your Wishlist is Empty
          </h2>

          <p>
            Add some products you love ❤️
          </p>

        </div>

      ) : (

        <>


          {/* WISHLIST ITEMS */}

          <div className="wishlist-list">

            {wishlist.map((product) => (

              <div
                className="wishlist-row"
                key={product._id}
              >


                {/* SELECT */}

                <div className="wishlist-select">

                  <input
                    type="checkbox"
                    checked={
                      selectedItems.includes(
                        product._id
                      )
                    }
                    onChange={() =>
                      handleSelect(
                        product._id
                      )
                    }
                  />

                </div>


                {/* IMAGE */}

                <div className="wishlist-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>


                {/* NAME + STOCK */}

                <div className="wishlist-info">

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

                <div className="wishlist-price">

                  ৳ {product.price}

                </div>


                {/* QUANTITY */}

                <div className="quantity-box">


                  <button
                    onClick={() =>
                      decreaseQuantity(
                        product._id
                      )
                    }
                    disabled={
                      (quantities[
                        product._id
                      ] || 1) <= 1
                    }
                  >

                    <FaMinus />

                  </button>


                  <span>

                    {quantities[
                      product._id
                    ] || 1}

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


                {/* BUTTONS */}

                <div className="wishlist-actions">


                  {/* ADD TO CART */}

                  <button
                    className="wishlist-cart-btn"

                    onClick={() =>
                      handleAddToCart(
                        product
                      )
                    }

                    disabled={
                      !product.stock ||
                      !selectedItems.includes(
                        product._id
                      )
                    }
                  >

                    <FaShoppingCart />

                    Add To Cart

                  </button>


                  {/* REMOVE */}

                  <button
                    className="wishlist-remove-btn"

                    onClick={() =>
                      removeFromWishlist(
                        product._id
                      )
                    }

                  >

                    <FaTrash />

                  </button>


                </div>


              </div>

            ))}

          </div>


          {/* TOTAL SECTION */}

          <div className="wishlist-total">


            <div>

              <span>
                Selected Items:
              </span>

              <strong>
                {selectedItems.length}
              </strong>

            </div>


            <div className="total-amount">

              Total: ৳ {total}

            </div>


          </div>


        </>

      )}

    </div>

  );

}