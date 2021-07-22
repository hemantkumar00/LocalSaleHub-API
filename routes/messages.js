/** @format */

const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

//add

router.post('/message', (req, res, next) => {
	const conversationId = req.body.conversationId;
	const sender = req.body.sender;
	const text = req.body.text;

	const newMessage = new Message({
		conversationId: conversationId,
		sender: sender,
		text: text,
	});
	newMessage
		.save()
		.then(() => {
			res.status(201).json({
				Message: newMessage,
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
});

//get

router.get('/:conversationId', (req, res, next) => {
	Message.find({
		conversationId: req.params.conversationId,
	})
		.then((message) => {
			res.json({ messages: message });
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
});

module.exports = router;
