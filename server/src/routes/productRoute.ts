import express from "express";
import { getAllProducts } from "../services/productServices";

const router = express.Router();


router.get("/", async (req, res) => {
    const products = await getAllProducts();
    res.status(products.statusCode).send(products.data);
}
);



export default router;