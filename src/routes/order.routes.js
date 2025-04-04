import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { orderConfirm, getOrderById } from "../controllers/order.controller.js";
const router = Router();

router.route("/order-confirm").post(verifyJWT, orderConfirm);
router.route("/get-order/:orderId").get(verifyJWT, getOrderById);

export default router;
