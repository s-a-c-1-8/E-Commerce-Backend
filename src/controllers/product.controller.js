import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getProductList = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res
    .status(200)
    .json(
      new ApiResponse(200, { products }, "Products list fetched successfully!")
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully!"));
});

export { getProductList, getProductById };
