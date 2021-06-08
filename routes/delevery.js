/** @format */

const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
	createDelevery,
	deleteDelevery,
	getDeleverys,
	getDelevery,
	editDelevery,
} = require('../controllers/delevery');

const router = express.Router();

router.post(
	'/signup-delevery',
	auth.verifySeller,
	[
		body('email', 'Please enter a valid email to continue.')
			.isEmail()
			.normalizeEmail(),
		body('password', 'Password should be at least 6 characters long')
			.trim()
			.isLength({ min: 6 }),
		body('firstName', 'First Name cannot be empty').trim().not().isEmpty(),
		body('lastName', 'Last Name cannot be empty').trim().not().isEmpty(),
		body('confirmPassword')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords have to match!');
				}
				return true;
			}),
	],
	createDelevery
);

router.delete(
	'/delete-delevery/:deleveryId',
	auth.verifySeller,
	deleteDelevery
);

router.put(
	'/update-order-in-delevery/:deleveryId',
	auth.verifySeller,
	editDelevery
);

router.get('/get-deleveries', auth.verifySeller, getDeleverys);

router.get('/get-delevery/:deleveryId', auth.verifySeller, getDelevery);

module.exports = router;
