import express from "express";
import {
  getUserOrdersHandler,
  getOrderByIdHandler,
  getRecentOrdersHandler,
  testOrderSaveHandler,
} from "../controllers/orderController";

const orderRouter = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameterized routes
// Health check endpoint
orderRouter.get("/health/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes are working",
    timestamp: new Date().toISOString(),
  });
});

// Get recent orders
orderRouter.get("/recent/all", getRecentOrdersHandler);

// Test endpoint for saving orders (for debugging)
orderRouter.post("/test-save", testOrderSaveHandler);

// User orders
orderRouter.get("/user/:userId", getUserOrdersHandler);

// Get order by ID - MUST be last (parameterized route)
orderRouter.get("/:orderId", getOrderByIdHandler);

export default orderRouter;

