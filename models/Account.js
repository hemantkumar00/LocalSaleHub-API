/** @format */

var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var accountSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		encry_password: {
			type: String,
			required: true,
		},
		salt: String,
		role: {
			type: String,
			enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_DELEVERY'],
			required: true,
		},
		accountVerifyToken: String,
		accountVerifyTokenExpiration: Date,
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

accountSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = uuidv1();
		this.encry_password = this.securePassword(password);
	})
	.get(function () {
		return this._password;
	});

accountSchema.methods = {
	autheticate: function (plainpassword) {
		return this.securePassword(plainpassword) === this.encry_password;
	},

	securePassword: function (plainpassword) {
		if (!plainpassword) return '';
		try {
			return crypto
				.createHmac('sha256', this.salt)
				.update(plainpassword)
				.digest('hex');
		} catch (err) {
			return '';
		}
	},
};

module.exports = mongoose.model('Account', accountSchema);
