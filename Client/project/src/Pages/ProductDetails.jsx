import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

import "./../Pages/ProductDetails.css";

export default function ProductDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/products"
        );

        const foundProduct =
          res.data.find(
            (item) =>
              item._id === id
          );

        setProduct(foundProduct);

      } catch (error) {

        console.log(
          "Product fetch error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    const existingProduct =
      savedCart.find(
        (item) =>
          item._id === product._id
      );


    if (existingProduct) {

      existingProduct.quantity =
        (existingProduct.quantity || 1) + 1;

    } else {

      savedCart.push({

        ...product,

        quantity: 1,

      });

    }


    localStorage.setItem(
      "cart",
      JSON.stringify(savedCart)
    );


    alert(
      `${product.name} added to cart!`
    );


    navigate("/cart");

  };


  // =========================
  // WISHLIST
  // =========================

  const handleWishlist = () => {

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];


    const alreadyExists =
      savedWishlist.some(
        (item) =>
          item._id === product._id
      );


    if (!alreadyExists) {

      savedWishlist.push(product);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(savedWishlist)
      );

      alert(
        `${product.name} added to wishlist!`
      );

    } else {

      alert(
        "Product is already in wishlist!"
      );

    }

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="product-loading">
        Loading Product...
      </div>
    );

  }


  // =========================
  // NOT FOUND
  // =========================

  if (!product) {

    return (
      <div className="product-not-found">
        Product Not Found
      </div>
    );

  }


  return (

    <div className="product-details-page">


      {/* BACK BUTTON */}

      <button
        className="back-products-btn"
        onClick={() =>
          navigate("/products")
        }
      >
        ← Back to Products
      </button>


      {/* PRODUCT DETAILS */}

      <div className="product-details-container">


        {/* IMAGE */}

        <div className="product-details-image-box">

          <img
            src={product.image}
            alt={product.name}
          />

        </div>


        {/* INFORMATION */}

        <div className="product-details-info">

          <h1>
            {product.name}
          </h1>


          <h2>
            ৳ {product.price}
          </h2>


          <p>
            <strong>
              Category:
            </strong>{" "}

            {product.category}
          </p>


          <p className="stock-info">

            <strong>
              Stock:
            </strong>{" "}

            {product.stock ? (

              <span className="details-in-stock">
                In Stock
              </span>

            ) : (

              <span className="details-out-stock">
                Out of Stock
              </span>

            )}

          </p>


          {/* BUTTONS */}

          <div className="details-buttons">


            {/* WISHLIST */}

            <button
              className="details-wishlist-btn"
              onClick={
                handleWishlist
              }
            >
              ♡ Wishlist
            </button>


            {/* BUY NOW */}

            <button
              className="buy-now-btn"
              disabled={!product.stock}
              onClick={
                handleAddToCart
              }
            >
              Buy Now
            </button>


          </div>

        </div>

      </div>

    </div>

  );

}