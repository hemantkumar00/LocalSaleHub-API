/** @format */

const express = require("express");
const { body } = require("express-validator");
const store = require("../middleware/multer");

const {
  imagesTest,
  signupUser,
  verifyAccount,
  login,
  signupSeller,
} = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup-user",
  [
    body("email", "Please enter a valid email to continue.")
      .isEmail()
      .normalizeEmail(),
    body(
      "password",
      "Password should be at least 6 characters long or password has no match!",
    )
      .trim()
      .isLength({ min: 6 }),
    body("firstName", "First Name cannot be empty").trim().not().isEmpty(),
    body("lastName", "Last Name cannot be empty").trim().not().isEmpty(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  signupUser,
);

router.get("/verify/:token", verifyAccount);

router.post("/login", login);

router.post(
  "/signup-seller",
  store.array("imageUrl", 12),
  [
    body("email", "Please enter a valid email to continue.")
      .isEmail()
      .normalizeEmail(),
    body("password", "Password should be at least 6 characters long")
      .trim()
      .isLength({ min: 6 }),
    body("name", "Shop Name cannot be empty").trim().not().isEmpty(),
    body("payment", "Payment cannot be empty").trim().not().isEmpty(),
    body("tags", "Tags cannot be empty").trim().not().isEmpty(),
    body("street", "Street cannot be empty").trim().not().isEmpty(),
    body("locality", "Locality cannot be empty").trim().not().isEmpty(),
    body("aptName", "Apartment name cannot be empty").trim().not().isEmpty(),
    body("zip", "Zipcode cannot be empty").trim().not().isEmpty(),
    body("costForOne", "Cost for one cannot be empty").trim().not().isEmpty(),
    body("minOrderAmount", "Minimum Order Amount cannot be empty")
      .trim()
      .not()
      .isEmpty(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
    body("phoneNo", "Enter a valid 10 digit phone number")
      .trim()
      .isLength({ min: 10, max: 10 }),
  ],
  signupSeller,
);

router.post("/images-test", store.array("arrayFiles", 12), imagesTest);

module.exports = router;
