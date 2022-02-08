/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressInfo = {
  street: String,
  aptName: String,
  locality: String,
  zip: String,
  lat: String,
  lng: String,
  phoneNo: String,
};

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    formattedAddress: {
      type: String,
      required: true,
    },
    imageUrl: [
      {
        type: String,
      },
    ],
    address: addressInfo,
    minOrderAmount: String,
    costForOne: String,
    payment: [
      {
        type: String,
        // enum: ["CASH", "ONLINE_PAYMENT", "UPI"],
        required: true,
      },
    ],
    account: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    delevery: [{ type: Schema.Types.ObjectId, ref: "Delevery" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Seller", sellerSchema);
