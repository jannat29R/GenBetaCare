import { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/Products.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const API = `${import.meta.env.VITE_API_URL}/api/products`;

  // =========================
  // GET PRODUCTS
  // =========================
  const loadProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // IMAGE SELECT
  // =========================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // OPEN ADD FORM
  // =========================
  const openAddForm = () => {
    setEditId(null);

    setName("");
    setPrice("");
    setCategory("");
    setStock(true);
    setImage(null);
    setPreview("");

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================
  const openEditForm = (product) => {
    setEditId(product._id);

    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);

    setImage(null);
    setPreview(product.image);

    setShowForm(true);
  };

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);

      // Image only if selected
      if (image) {
        formData.append("image", image);
      }

      let res;

      // UPDATE
      if (editId) {
        res = await axios.put(
          `${API}/${editId}`,
          formData
        );
      }

      // ADD
      else {
        if (!image) {
          alert("Please select an image");
          return;
        }

        res = await axios.post(
          API,
          formData
        );
      }

      alert(res.data.message);

      // Refresh table
      await loadProducts();

      // Close form
      setShowForm(false);

      // Reset
      setEditId(null);
      setName("");
      setPrice("");
      setCategory("");
      setStock(true);
      setImage(null);
      setPreview("");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${API}/${id}`
      );

      alert(res.data.message);

      // Refresh product list
      await loadProducts();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  return (
    <div className="products-page">

      {/* ================= HEADER ================= */}

      <div className="products-header">

        <h1>Products</h1>

        <button
          className="add-btn"
          onClick={openAddForm}
        >
          <FaPlus />
          Add Product
        </button>

      </div>


      {/* ================= TABLE ================= */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-product"
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              products.map((product) => (

                <tr key={product._id}>

                  {/* IMAGE */}

                  <td>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="table-image"
                    />

                  </td>


                  {/* NAME */}

                  <td>
                    {product.name}
                  </td>


                  {/* CATEGORY */}

                  <td>
                    {product.category}
                  </td>


                  {/* PRICE */}

                  <td>
                    ৳ {product.price}
                  </td>


                  {/* STOCK */}

                  <td>

                    {product.stock ? (

                      <span className="in-stock">
                        In Stock
                      </span>

                    ) : (

                      <span className="out-stock">
                        Out of Stock
                      </span>

                    )}

                  </td>


                  {/* ACTION */}

                  <td>

                    {/* EDIT */}

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditForm(product)
                      }
                    >
                      <FaEdit />
                    </button>


                    {/* DELETE */}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(product._id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* ================= ADD / EDIT MODAL ================= */}

      {showForm && (

        <div className="product-modal">

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >

            <h2>
              {editId
                ? "Edit Product"
                : "Add Product"}
            </h2>


            {/* NAME */}

            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />


            {/* PRICE */}

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />


            {/* CATEGORY */}

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            />


            {/* STOCK */}

            <label className="stock-check">

              <input
                type="checkbox"
                checked={stock}
                onChange={(e) =>
                  setStock(e.target.checked)
                }
              />

              In Stock

            </label>


            {/* IMAGE */}

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />


            {/* IMAGE PREVIEW */}

            {preview && (

              <img
                src={preview}
                alt="Preview"
                className="preview-image"
              />

            )}


            {/* BUTTONS */}

            <div className="modal-buttons">

              <button type="submit">

                {editId
                  ? "Update Product"
                  : "Add Product"}

              </button>


              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
}