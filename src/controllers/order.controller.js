import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const orderConfirm = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const getCart = await Cart.findOne({ userId });
  if (!getCart) {
    throw new ApiError(404, "Something went wrong while fetching Cart Itmes!");
  }
  const newOrder = new Order({
    userId,
    products: getCart.items,
    totalAmount: getCart.totalAmount,
    isUserPlaced: true,
    isPaid: true,
  });
  await newOrder.save();
  await Cart.findOneAndDelete({ userId });
  return res
    .status(200)
    .json(new ApiResponse(200, { newOrder }, "Order confirmed successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found!");
  }
  return res.status(200).json(new ApiResponse(200, { order }, "Order details"));
});

export { orderConfirm, getOrderById };
