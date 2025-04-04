import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  //Will get userId from the Middleware
  const userId = req.user?._id;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "All fields are required!");
  }

  //By taking id will fetch original product price from the Product model
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found!");
  }
  const productPrice = product.price;

  // Check if the user already has a cart
  const cart = await Cart.findOne({ userId });

  if (cart) {
    console.log("User has cart alredy ");

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex((p) => p.productId == id);

    //If the product is already in the cart, then update the quantity and price
    if (itemIndex > -1) {
      console.log("Product alredy there in Cart increse Qty");
      let productItem = cart.items[itemIndex];
      productItem.productId = id;
      productItem.quantity += 1;
      productItem.totalPrice = productPrice * productItem.quantity;
      cart.items[itemIndex] = productItem;
    } else {
      console.log("Product not there in Cart! Add !");

      //If the product is not in the cart, then add the product to the cart
      cart.items.push({
        productId: id,
        quantity: 1,
        totalPrice: productPrice,
        unitPrice: productPrice,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    ); // Recalculate total amount
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, { cart }, "Item added to cart successfully"));
  } else {
    console.log("Create new cart for");
    //If the user does not have a cart, then create a new cart
    const newCart = new Cart({
      userId,
      items: [
        {
          productId: product._id,
          quantity: 1,
          totalPrice: productPrice,
          unitPrice: productPrice,
        },
      ],
      totalAmount: productPrice,
    });
    await newCart.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { newCart }, "Item added to cart successfully")
      );
  }
});

const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "All fields are required!");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found!");
  }
  console.log(cart);

  const itemIndex = cart.items.findIndex((p) => p.productId == id);

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart!");
  }

  console.log(cart.items);

  cart.totalAmount = Number(
    cart.totalAmount - cart.items[itemIndex].totalPrice
  );
  cart.items.splice(itemIndex, 1);
  await cart.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { cart }, "Item removed from cart successfully")
    );
});

const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Something went wrong");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found!");
  }

  const itemIndex = cart.items.findIndex((p) => p.productId == id);

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart!");
  }

  const productItem = cart.items[itemIndex];

  if (productItem.quantity > 1) {
    productItem.quantity -= 1;
    productItem.totalPrice -= productItem.unitPrice;
    cart.items[itemIndex] = productItem;
    cart.totalAmount = Number(cart.totalAmount - productItem.unitPrice);
    await cart.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { cart }, "Item removed from cart successfully")
      );
  } else {
    cart.items.splice(itemIndex, 1);
    cart.totalAmount = Number(cart.totalAmount - productItem.unitPrice);
    const updatedCart = await cart.save();
    console.log("updatedCart", updatedCart.items.length);
    if (updatedCart.items.length === 0) {
      console.log();

      await cart.deleteOne(updatedCart._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Item removed cart is empty"));
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { cart }, "Item removed from cart successfully")
        );
    }
  }
});

const getCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const cart = await Cart.findOne({ userId });
  if (!cart.items.length) {
    return res.status(200).json(new ApiResponse(200, {}, "Cart is empty!"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "Cart fetched successfully"));
});

export { addToCart, removeCartItem, getCartItem, updateCart };
