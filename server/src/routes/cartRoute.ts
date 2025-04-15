import express from "express";
import { getActiveCartForUser } from "../services/cartServices";
import validateJWT from "../middlewares/validateJWT";
const router = express.Router();

interface Request {
  user?: { _id: string; email?: string;} ; 
}

router.get("/", validateJWT, async (req:any, res) => {

    const userId = req.user._id; 
    
  // getActiveCartForUser
  const cart = await getActiveCartForUser({ userId });
  res.status(cart.statusCode).send(cart.data);
});

export default router;
