import { Router } from "express";
import {
  getProductList,
  getProductById,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(getProductList);
router.route("/product/:id").get(getProductById);

export default router;
