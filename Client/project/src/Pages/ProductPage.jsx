import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../Components/ProductCard";
import SearchBar from "../Components/SearchBar";

import "./ProductPage.css";

export default function ProductPage() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const urlCategory = searchParams.get("category") || "";


  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        setProducts(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.log(
          "Error fetching products:",
          error
        );

        setProducts([]);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);


  // =========================
  // SET CATEGORY FROM URL
  // =========================

  useEffect(() => {

    setCategory(urlCategory);

  }, [urlCategory]);


  // =========================
  // CREATE UNIQUE CATEGORIES
  // =========================
  // Baby Food
  // baby food
  // BABY FOOD
  // -------------------------
  // এগুলো একই category হবে
  // =========================

  const categoryMap = {};

  products.forEach((product) => {

    if (!product.category) return;

    const originalCategory =
      product.category.trim();

    if (!originalCategory) return;

    const categoryKey =
      originalCategory.toLowerCase();

    if (!categoryMap[categoryKey]) {

      categoryMap[categoryKey] =
        originalCategory;

    }

  });


  const categories =
    Object.values(categoryMap);


  // =========================
  // SEARCH + CATEGORY FILTER
  // =========================

  const filteredProducts =
    products.filter((product) => {

      const productName =
        product.name?.toLowerCase() || "";

      const productCategory =
        product.category?.trim() || "";

      // SEARCH
      const matchesSearch =
        search.trim() === "" ||
        productName.includes(
          search.toLowerCase()
        );


      // CATEGORY
      const matchesCategory =
        category === "" ||
        productCategory.toLowerCase() ===
          category.trim().toLowerCase();


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  // =========================
  // GROUP PRODUCTS BY CATEGORY
  // =========================

  const groupedProducts =
    categories.map((cat) => {

      const categoryProducts =
        filteredProducts.filter(
          (product) =>
            product.category
              ?.trim()
              .toLowerCase() ===
            cat.trim().toLowerCase()
        );


      return {

        category: cat,

        products: categoryProducts,

      };

    });


  // =========================
  // PAGE
  // =========================

  return (

    <div className="product-page">


      {/* =========================
          SEARCH BAR
      ========================= */}

      <SearchBar

        search={search}

        setSearch={setSearch}

        category={category}

        setCategory={setCategory}

        products={products}

      />


      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <h2 className="products-loading">

          Loading Products...

        </h2>


      ) : filteredProducts.length === 0 ? (

        <h2 className="no-products">

          No Products Found

        </h2>


      ) : category !== "" ? (

        /* =========================
           SELECTED CATEGORY
        ========================= */

        <section className="category-section">


          <h2 className="category-title">

            {category}

          </h2>


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


        </section>


      ) : (

        /* =========================
           ALL PRODUCTS
        ========================= */

        <div className="all-products-sections">


          {groupedProducts.map(
            (group) => {


              // Search করলে কোনো category-তে
              // product না থাকলে সেটা দেখাবে না

              if (
                group.products.length === 0
              ) {

                return null;

              }


              return (

                <section

                  className="category-section"

                  key={group.category}

                >


                  {/* CATEGORY TITLE */}

                  <div className="category-heading-row">


                    <h2 className="category-title">

                      {group.category}

                    </h2>


                    <button

                      className="view-category-btn"

                      onClick={() =>
                        setCategory(
                          group.category
                        )
                      }

                    >

                      View All

                    </button>


                  </div>


                  {/* PRODUCTS */}

                  <div className="products-grid products-grid-scroll">


                    {group.products.map(
                      (product) => (

                        <ProductCard

                          key={product._id}

                          product={product}

                        />

                      )
                    )}


                  </div>


                </section>

              );

            }
          )}


        </div>

      )}

    </div>

  );

}