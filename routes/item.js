/** @format */

const express = require('express');
const { body } = require('express-validator');

const {
	createItem,
	deleteItem,
	editItem,
	getItems,
	getItem,
} = require('../controllers/item');
const auth = require('../middleware/auth');
const store = require('../middleware/multer');

const router = express.Router();

router.post(
	'/create-item',
	auth.verifySeller,
	store.single('imageUrl'),
	[
		body('title', 'Title needs to be at least 4 characters long')
			.trim()
			.isLength({ min: 4 }),
		body('description', 'Description cannot be empty').trim().not().isEmpty(),
		body('price', 'Price cannot be empty').trim().not().isEmpty(),
	],
	createItem
);

router.delete('/delete-item/:itemId', auth.verifySeller, deleteItem);

router.put(
	'/edit-item/:itemId',
	auth.verifySeller,
	store.single('imageUrl'),
	[
		body('title', 'Title needs to be at least 4 characters long')
			.trim()
			.isLength({ min: 4 }),
		body('description', 'Description cannot be empty').trim().not().isEmpty(),
		body('price', 'Price cannot be empty').trim().not().isEmpty(),
	],
	editItem
);

router.get('/get-items', auth.verifySeller, getItems);

router.get('/get-item/:itemId', auth.verifySeller, getItem);

module.exports = router;
