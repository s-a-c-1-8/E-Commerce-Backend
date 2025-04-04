import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addProductList,
  addProduct,
  updateProduct,
  deleteProduct,
  getUserList,
  getOrderList,
  changeOrderSatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/", verifyJWT, verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});

router.route("/add-product-list").post(verifyJWT, verifyAdmin, addProductList);

router
  .route("/add-product")
  .post(verifyJWT, verifyAdmin, upload.single("image"), addProduct);

router.route("/update-product/:id").put(verifyJWT, verifyAdmin, updateProduct);
router
  .route("/delete-product/:id")
  .delete(verifyJWT, verifyAdmin, deleteProduct);
router.route("/user-list").get(verifyJWT, verifyAdmin, getUserList);
router.route("/order-list").get(verifyJWT, verifyAdmin, getOrderList);
router
  .route("/change-order-status/:id")
  .post(verifyJWT, verifyAdmin, changeOrderSatus);

export default router;
