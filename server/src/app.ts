import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes";
import authRoutes from "./routes/authRoutes";
import addressRoutes from "./routes/addressRoutes";
import productRoutes from "./routes/productRoutes";
import razorpayRoutes from "./routes/razorpayRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "server chal raha hai" });
});

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/v2/razorpay", razorpayRoutes);
app.use("/api/orders", orderRoutes);

export default app;
