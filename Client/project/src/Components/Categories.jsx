import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Categories.css";

export default function Categories() {

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();


  // =========================
  // GET CATEGORIES FROM DATABASE
  // =========================

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        const products = Array.isArray(res.data)
          ? res.data
          : [];


        // =========================
        // REMOVE DUPLICATE CATEGORIES
        // =========================
        // Baby Food
        // baby food
        // BABY FOOD
        //
        // এগুলোকে একই category ধরা হবে
        // =========================

        const categoryMap = {};

        products.forEach((product) => {

          if (!product.category) return;

          const originalCategory =
            product.category.trim();

          if (!originalCategory) return;

          const categoryKey =
            originalCategory.toLowerCase();


          // একই category আগে না থাকলে
          // প্রথম category name রাখবে

          if (!categoryMap[categoryKey]) {

            categoryMap[categoryKey] =
              originalCategory;

          }

        });


        const uniqueCategories =
          Object.values(categoryMap);


        setCategories(uniqueCategories);


      } catch (error) {

        console.log(
          "Category fetch error:",
          error
        );

      }

    };


    fetchCategories();

  }, []);


  // =========================
  // CATEGORY ICON
  // =========================

  const getCategoryIcon = (category) => {

    const name =
      category.toLowerCase();


    if (name.includes("diaper")) {

      return "👶";

    }


    if (
      name.includes("skin") ||
      name.includes("lotion")
    ) {

      return "🧴";

    }


    if (
      name.includes("bath") ||
      name.includes("body") ||
      name.includes("shampoo")
    ) {

      return "🛁";

    }


    if (name.includes("food")) {

      return "🍼";

    }


    if (
      name.includes("tissue") ||
      name.includes("wipes")
    ) {

      return "🧻";

    }


    return "🛍️";

  };


  // =========================
  // CLICK CATEGORY
  // =========================

  const handleCategory = (category) => {

    navigate(
      `/products?category=${encodeURIComponent(
        category
      )}`
    );

  };


  // =========================
  // UI
  // =========================

  return (

    <section className="categories-section">


      <h2 className="categories-title">

        Shop By Category

      </h2>


      <div className="categories-list">


        {categories.map((category) => (

          <div

            className="category-card"

            key={category}

            onClick={() =>
              handleCategory(category)
            }

          >


            <div className="category-icon">

              {getCategoryIcon(category)}

            </div>


            <h3>

              {category}

            </h3>


          </div>

        ))}


      </div>


    </section>

  );

}