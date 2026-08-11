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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );
        setProducts(res.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  ];
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      search.trim() === "" ||
      product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
    const matchesCategory =
      category === "" ||
      product.category === category;
    return matchesSearch && matchesCategory;
  });
  const groupedProducts = categories.map((cat) => {
    const categoryProducts = filteredProducts.filter(
      (product) => product.category === cat
    );
    return {
      category: cat,
      products: categoryProducts
    };
  });
  return (
    <div className="product-page">
 
      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        products={products}
      />
      {loading ? (
        <h2 className="products-loading">
          Loading Products...
        </h2>
      ) : filteredProducts.length === 0 ? (
        <h2 className="no-products">
          No Products Found
        </h2>
      ) : category !== "" ? (
        <section className="category-section">
          <h2 className="category-title">
            {category}
          </h2>
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="all-products-sections">
          {groupedProducts.map((group) => {
            if (group.products.length === 0) {
              return null;
            }
            return (
              <section
                className="category-section"
                key={group.category}
              >
                <div className="category-heading-row">
                  <h2 className="category-title">
                    {group.category}
                  </h2>
                  <button
                    className="view-category-btn"
                    onClick={() =>
                      setCategory(group.category)
                    }
                  >
                    View All
                  </button>
                </div>
                <div className="products-grid products-grid-scroll">
                  {group.products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ok