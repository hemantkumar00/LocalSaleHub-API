/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryInfo = {
	street: String,
	locality: String,
	aptName: String,
	zip: String,
	phoneNo: Number,
	lat: Number,
	lng: Number,
};

const deleverySchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		formattedAddress: {
			type: String,
		},
		address: deliveryInfo,
		account: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Account',
		},
		seller: {
			type: Schema.Types.ObjectId,
			ref: 'Seller',
		},
		order: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Order',
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Delevery', deleverySchema);
