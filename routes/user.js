/** @format */

const express = require("express");
const { body } = require("express-validator");

const {
  getShops,
  getShop,
  postCart,
  getCart,
  postCartDelete,
  postCartRemove,
  postAddress,
  getLoggedInUser,
  postOrder,
  getOrders,
  postOrderStatus,
  getConnectedClients,
  getRestaurantsByAddress,
} = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/shops", getShops);

router.get("/shop/:shopId", getShop);

router.post("/cart/:itemId", auth.verifyUser, postCart);

router.get("/cart", auth.verifyUser, getCart);

router.post("/delete-cart-item/:itemId", auth.verifyUser, postCartDelete);

router.post("/remove-cart-item/:itemId", auth.verifyUser, postCartRemove);

router.post(
  "/user/address",
  auth.verifyUser,
  [
    body("phoneNo", "Enter a valid 10 digit phone number")
      .trim()
      .isLength({ min: 10, max: 10 }),
    body("street", "Street cannot be empty").trim().not().isEmpty(),
    body("locality", "Locality cannot be empty").trim().not().isEmpty(),
    body("aptName", "Apartment name cannot be empty").trim().not().isEmpty(),
    body("zip", "Zipcode cannot be empty").trim().not().isEmpty(),
  ],
  postAddress,
);

router.get("/user", getLoggedInUser);

router.post("/order", auth.verifyUser, postOrder);

router.get("/orders", getOrders);

router.post("/order-status/:orderId", postOrderStatus);

router.get("/clients/connected", getConnectedClients);

router.get("/shops-location/:lat/:lng", getRestaurantsByAddress);

module.exports = router;
