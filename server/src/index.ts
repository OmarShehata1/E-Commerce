import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute"; 
import productRoute from "./routes/productRoute";
import { seedInitialProducts } from "./services/productServices";

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
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




app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
