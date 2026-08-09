import "./ProductCard.css";

import {
  FaHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const savedCart =
    JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = savedCart.find(
      (item) => item._id === product._id
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

    navigate("/cart");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

      const alreadyExists = savedWishlist.some(
        (item) => item._id === product._id
      );

      if (!alreadyExists) {
        savedWishlist.push(product);

        localStorage.setItem(
          "wishlist",
          JSON.stringify(savedWishlist)
        );
      }

      navigate("/wishlist");
  };

  return (
    <div className="product-card">

      {/* Product Details Link */}
      <Link
        to={`/product/${product._id}`}
        className="product-link"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <h3 className="product-name">
          {product.name}
        </h3>

        

        <div className="price">
          ৳ {product.price}
        </div>
      </Link>
      {/* Wishlist Button */}
      <button
        className="wishlist-btn"
        onClick={handleWishlist}
      >
        <FaHeart color="red" />
      </button>
      {/* Cart Button */}
      <button
        className="cart-btn"
        onClick={handleAddToCart}
      >
        <FaShoppingCart />
        Add To Cart
      </button>

    </div>
  );
}