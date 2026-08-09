import { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

export default function SearchBar({
  search,
  setSearch,
  category,
  setCategory,
  products,
}) {

  const [categories, setCategories] =
    useState([]);


  // Get categories from products
  useEffect(() => {

    const uniqueCategories = [
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ];

    setCategories(
      uniqueCategories
    );

  }, [products]);


  return (

    <div className="search-filter-container">


      {/* SEARCH */}

      <div className="search-box">

        <FaSearch />

        <input

          type="text"

          placeholder="Search products..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

        />

      </div>


      {/* CATEGORY */}

      <select

        className="category-select"

        value={category}

        onChange={(e) =>
          setCategory(e.target.value)
        }

      >

        <option value="">
          All Categories
        </option>


        {categories.map(
          (cat) => (

            <option
              value={cat}
              key={cat}
            >
              {cat}
            </option>

          )
        )}

      </select>


    </div>

  );

}