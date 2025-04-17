import express from "express";
import { getAllProducts } from "../services/productServices";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
    const products = await getAllProducts();
    res.status(products.statusCode).send(products.data);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}
);



export default router;