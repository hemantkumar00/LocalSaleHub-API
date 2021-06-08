/** @format */

const mongoose = require('mongoose');

const deliveryInfo = {
	street: String,
	locality: String,
	aptName: String,
	zip: String,
	phoneNo: Number,
	lat: Number,
	lng: Number,
};

const bannerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		isShowing: {
			type: Boolean,
			default: false,
			required: true,
		},
		bannerPosition: {
			type: String,
			default: 'top',
			enum: ['top', 'bottom'],
			required: true,
		},
		formattedAddress: {
			type: String,
			required: true,
		},
		address: deliveryInfo,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
