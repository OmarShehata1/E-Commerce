import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute"; 
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import { seedInitialProducts } from "./services/productServices";
import orderRoute from "./routes/orderRoute";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB", err);
  });


  // seed the products to database
  seedInitialProducts();

app.use('/user',userRoute)
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use('/checkout', orderRoute);





app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
