import express from "express";
import { ExtendRequest } from "../types/extendRequest";
import validateJWT from "../middlewares/validateJWT";
import { checkout } from "../services/orderServices";

const router = express.Router();

router.post("/", validateJWT,async (req: ExtendRequest, res) => {
  try {
  const userId = req?.user?._id;
  const { address } = req.body;
  const response = await checkout({ userId, address });
  res.status(response.statusCode).send(response.data);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

export default router;
