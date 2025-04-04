import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  removeCartItem,
  getCartItem,
  updateCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.route("/add/:id").post(verifyJWT, addToCart);
router.route("/remove/:id").post(verifyJWT, removeCartItem);
router.route("/getcart").get(verifyJWT, getCartItem);
router.route("/update/:id").post(verifyJWT, updateCart);

export default router;
