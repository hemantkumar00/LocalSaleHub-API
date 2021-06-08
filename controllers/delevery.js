/** @format */
const Seller = require('../models/Seller');
const Delevery = require('../models/Delevery');
const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { validationResult } = require('express-validator');

exports.createDelevery = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const email = req.body.email;
	const firstName = req.body.firstName;
	const password = req.body.password;
	const lastName = req.body.lastName;
	const role = req.body.role;
	let token;
	let creater;
	let deleveryboy;

	if (role !== 'ROLE_DELEVERY') {
		return res.status(401).json({
			error: 'Signing up an user should have a role of ROLE_DELEVERY',
		});
	}

	Account.findById(req.loggedInUserId)
		.then((account) => {
			return Seller.findOne({ account: account._id });
		})
		.then((seller) => {
			creater = seller;
			bcrypt
				.hash(password, 12)
				.then(() => {
					token = crypto.randomBytes(32).toString('hex');

					const account = new Account({
						role: role,
						email: email,
						password: password,
						accountVerifyToken: token,
						accountVerifyTokenExpiration: Date.now() + 3600000,
						order: '',
					});
					return account.save();
				})
				.then((savedAccount) => {
					const delevery = new Delevery({
						firstName: firstName,
						lastName: lastName,
						account: savedAccount,
					});
					delevery
						.save()
						.then((savedDelevery) => {
							deleveryboy = savedDelevery;
							seller.delevery.push(delevery);
							return seller.save();
						})
						.then(() => {
							async function main() {
								let transporter = nodemailer.createTransport({
									host: 'titan.int3rnet.net',
									port: 587,
									secure: false, // true for 465, false for other ports
									auth: {
										user: `hemant@hemantkumarjat.com`, // generated ethereal user
										pass: `12345678@qazhemant`, // generated ethereal password
									},
								});

								// send mail with defined transport object
								let info = await transporter.sendMail({
									from: '"Hemant" <hemant@hemantkumarjat.com>', // sender address
									to: `${email}`, // list of receivers
									subject: 'Email regarding forgot password', // Subject line
									html: `
                      <p>Please verify your email by clicking on the link below - MultiVanser</p>
                      <p>Click this <a href="http://localhost:8000/api/verify/${token}">link</a> to verify your account.</p>
                    `,
								});
							}
							main().catch(console.error);
							res.status(201).json({
								message:
									'User signed-up successfully, please verify your email before logging in.',
								deleveryId: deleveryboy._id,
							});
						});
				});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.deleteDelevery = (req, res, next) => {
	const deleveryId = req.params.deleveryId;
	Delevery.findById(deleveryId)
		.then((delevery) => {
			if (!delevery) {
				const error = new Error(
					'Could not find any Delevery with hte given ItemId'
				);
				error.statusCode = 404;
				throw error;
			}
			console.log(delevery.account);
			return Account.findByIdAndDelete(delevery.account);
		})
		.then(() => {
			return Delevery.findByIdAndRemove(deleveryId);
		})
		.then(() => {
			return Account.findById(req.loggedInUserId);
		})
		.then((account) => {
			return Seller.findOne({ account: account._id });
		})
		.then((seller) => {
			seller.delevery.pull(deleveryId);
			return seller.save();
		})
		.then((result) => {
			res.status(200).json({
				message: 'Delevery deleted successfully.',
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.getDeleverys = (req, res, next) => {
	Account.findById(req.loggedInUserId)
		.then((account) => {
			return Seller.findOne({ account: account._id });
		})
		.then((seller) => {
			return Delevery.find({ _id: { $in: seller.delevery } });
		})
		.then((delevery) => {
			res.json({ delevery: delevery });
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.getDelevery = (req, res, next) => {
	const deleveryId = req.params.deleveryId;
	Delevery.findById(deleveryId)
		.then((delevery) => {
			if (!delevery) {
				const error = new Error(
					'Could not find any Delevery with the given deleveryId'
				);
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Delevery featured successfully',
				delevery: delevery,
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.editDelevery = (req, res, next) => {
	const deleveryId = req.params.deleveryId;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const order = req.body.order;

	Delevery.findById(deleveryId)
		.then((fetchedDelevery) => {
			if (!fetchedDelevery) {
				const error = new Error(
					'Could not find any Delevery Boy with the given DeleveryId'
				);
				error.statusCode = 404;
				throw error;
			}
			fetchedDelevery.order.push(order);

			return fetchedDelevery.save();
		})
		.then((updatedDelevery) => {
			res.status(200).json({
				message: 'Delevery updated',
				delevery: updatedDelevery,
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};
