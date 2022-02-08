const express = require("express");
const { processPayment, getToken } = require("../controllers/payment");
const router = express.Router();

router.get("/payment/gettoken/:userId", getToken);
router.post("/payment/braintree/:userId", processPayment);

module.exports = router;
