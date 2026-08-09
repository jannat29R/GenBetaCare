import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../Components/ProductCard";
import SearchBar from "../Components/SearchBar";

import "./ProductPage.css";

export default function ProductPage() {

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] =
    useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);


  // Get category from URL
  const [searchParams] = useSearchParams();

  const urlCategory =
    searchParams.get("category") || "";


  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(res.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);


  // =========================
  // SET CATEGORY FROM HOME
  // =========================

  useEffect(() => {

    setCategory(urlCategory);

  }, [urlCategory]);


  // =========================
  // SEARCH + CATEGORY FILTER
  // =========================

  useEffect(() => {

    let result = [...products];


    // Search

    if (search.trim() !== "") {

      result = result.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }


    // Category

    if (category !== "") {

      result = result.filter(
        (product) =>
          product.category === category
      );

    }


    setFilteredProducts(result);

  }, [
    search,
    category,
    products,
  ]);


  return (

    <div className="product-page">


      {/* SEARCH + CATEGORY */}

      <SearchBar

        search={search}

        setSearch={setSearch}

        category={category}

        setCategory={setCategory}

        products={products}

      />


      <h1 className="products-title">
        {category
          ? category
          : "All Products"}
      </h1>


      {loading ? (

        <h2 className="products-loading">
          Loading Products...
        </h2>

      ) : filteredProducts.length === 0 ? (

        <h2 className="no-products">
          No Products Found
        </h2>

      ) : (

        <div className="products-grid">

          {filteredProducts.map(
            (product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            )
          )}

        </div>

      )}

    </div>

  );

}