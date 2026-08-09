import express from "express";
import Order from "../models/Order.js";

const router = express.Router();


// ============================
// CREATE ORDER
// ============================

router.post("/", async (req, res) => {

  try {

    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });

  }

});


// ============================
// GET ALL ORDERS - ADMIN
// ============================

router.get("/", async (req, res) => {

  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });

  }

});


// ============================
// GET SINGLE ORDER
// ============================

router.get("/:id", async (req, res) => {

  try {

    const order =
      await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.json({
      success: true,
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });

  }

});


// ============================
// UPDATE ORDER STATUS
// ============================

router.put("/:id", async (req, res) => {

  try {

    const { status } = req.body;

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });

  }

});


// ============================
// DELETE ORDER
// ============================

router.delete("/:id", async (req, res) => {

  try {

    const order =
      await Order.findByIdAndDelete(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });

  }

});

export default router;