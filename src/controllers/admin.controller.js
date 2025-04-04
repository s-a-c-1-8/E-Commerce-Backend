import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

// Uplaoding product data
const addProductList = asyncHandler(async (req, res) => {
  try {
    const products = req.body.products;
    await Product.insertMany(products);
    return res
      .status(201)
      .json(new ApiResponse(201, "Products uploaded successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while uploading products",
      error
    );
  }
});

const addProduct = asyncHandler(async (req, res) => {
  const { title, price, stock, category } = req.body;
  if (!req.file?.path) throw new ApiError(400, "Please upload an image");
  if (!title || !price || !stock || !category)
    throw new ApiError(400, "Please provide all fields");
  const imageUrl = await uploadOnCloudinary(req.file?.path);
  console.log(imageUrl.url);

  const product = new Product({
    title,
    price,
    stock,
    category,
    image: imageUrl.url,
  });
  await product.save();
  res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product added successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { title, price, stock, category } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  product.title = title;
  product.price = price;
  product.stock = stock;
  product.category = category;
  await product.save();
  res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(new ApiResponse(200, "Product deleted successfully"));
});

const getUserList = asyncHandler(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users list fetched successfully!"));
});
const getOrderList = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res
    .status(200)
    .json(
      new ApiResponse(200, { orders }, "Orders list fetched successfully!")
    );
});

const changeOrderSatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validStatuses = ["pending", "packed", "shipped", "delivered"];

  if (!validStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid order status" });
  }

  const order = await Order.findByIdAndUpdate(
    { _id: id },
    { orderStatus: req.body.status },
    { new: true }
  );

  if (!order) throw new ApiError(404, "Something went wrong!");
  res
    .status(200)
    .json(
      new ApiResponse(200, { order }, "Orders status updated successfully!")
    );
});

export {
  addProductList,
  addProduct,
  updateProduct,
  deleteProduct,
  getUserList,
  getOrderList,
  changeOrderSatus,
};
