import express from 'express';
import { addItemToCart, clearCart, deleteItemInCart, getActiveCartForUser, updateItemInCart } from '../services/cartServices';
import validateJWT from '../middlewares/validateJWT';
import { ExtendRequest } from '../types/extendRequest';
const router = express.Router();


router.get("/", validateJWT, async (req:ExtendRequest, res) => {
    try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({userId});
    res.status(200).send(cart);
    }
    catch (error) {
        res.status(500).send( "Internal server error" );
    }
});


router.delete("/", validateJWT, async (req:ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const response = await clearCart({userId});
    res.status(response.statusCode).send(response.data);
    }
    catch (error) {
        res.status(500).send( "Internal server error" );
    }
});

router.post("/items", validateJWT, async (req:ExtendRequest, res) => {
    try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({userId, productId , quantity});
    res.status(response.statusCode).send(response.data);
    }
    catch (error) {
        res.status(500).send( "Internal server error" );
    }
});

router.put("/items", validateJWT, async (req:ExtendRequest, res) => {
  try {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await updateItemInCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
  }
  catch (error) {
      res.status(500).send( "Internal server error" );
  }
});


router.delete("/items/:productId", validateJWT, async (req:ExtendRequest, res) => {
  try {
  const userId = req.user._id;
  const { productId } = req.params;
  const response = await deleteItemInCart({ userId, productId });
  res.status(response.statusCode).send(response.data);
  }catch (error) {
      res.status(500).send( "Internal server error" );
  }
});

export default router;