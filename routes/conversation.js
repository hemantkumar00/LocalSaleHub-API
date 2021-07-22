/** @format */

const express = require('express');
const Conversation = require('../models/Conversation');
const router = express.Router();

//new conv

router.post('/conversation', (req, res, next) => {
	const senderId = req.body.senderId;
	const resiverId = req.body.resiverId;

	const newConversation = new Conversation({
		members: [senderId, resiverId],
	});

	newConversation
		.save()
		.then(() => {
			res.status(201).json({
				Conversation: newConversation,
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
});
//get conv of user

router.get('/conversation/:userId', (req, res, next) => {
	Conversation.find({
		members: { $in: [req.params.userId] },
	})
		.then((conversation) => {
			res.json({ conversation: conversation });
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
});

module.exports = router;
