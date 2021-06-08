/** @format */

const express = require('express');
const { body } = require('express-validator');

const {
	createBanner,
	editBanner,
	getBanners,
	getBanner,
} = require('../controllers/banner');
const auth = require('../middleware/auth');
const store = require('../middleware/multer');

const router = express.Router();

router.post(
	'/create-banner',
	auth.verifyAdmin,
	store.single('imageUrl'),
	[
		body('name', 'Name needs to be at least 4 characters long')
			.trim()
			.isLength({ min: 4 }),
	],
	createBanner
);

router.put('/edit-banner/:bannerId', auth.verifyAdmin, editBanner);

router.get('/get-banner', auth.verifyAdmin, getBanners);

router.get('/get-banner/:bannerId', auth.verifyAdmin, getBanner);

module.exports = router;
