import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const { name, price, category, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "GenBetaCare/products",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    const product = await Product.create({
      name,
      price,
      category,
      stock,
      image: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });

  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If new image is selected
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "GenBetaCare/products",
      });

      fs.unlinkSync(req.file.path);

      product.image = result.secure_url;
    }

    product.name = name;
    product.price = price;
    product.category = category;
    product.stock = stock;

    await product.save();

    res.json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
