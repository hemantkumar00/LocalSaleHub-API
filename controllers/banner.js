/** @format */

const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator');

const Banner = require('../models/Banner');

exports.createBanner = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	if (!req.file) {
		const error = new Error('Upload an image as well.');
		error.statusCode = 422;
		throw error;
	}

	const imageUrl = req.file.path;
	const name = req.body.name;
	const bannerPosition = req.body.bannerPosition;
	const phoneNo = req.body.phoneNo;
	const street = req.body.street;
	const aptName = req.body.aptName;
	const formattedAddress = req.body.formattedAddress;
	const lat = req.body.lat;
	const lng = req.body.lng;
	const locality = req.body.locality;
	const zip = req.body.zip;

	const banner = new Banner({
		imageUrl: imageUrl,
		name: name,
		bannerPosition: bannerPosition,
		phoneNo: phoneNo,
		street: street,
		aptName: aptName,
		formattedAddress: formattedAddress,
		lat: lat,
		lng: lng,
		locality: locality,
		zip: zip,
	});

	banner
		.save()
		.then(() => {
			res.status(201).json({
				message: 'Banner created, hurray!',
				banner: banner,
				created: { name: banner.name },
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.editBanner = (req, res, next) => {
	const bannerId = req.params.bannerId;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const isShowing = req.body.isShowing;
	const bannerPosition = req.body.bannerPosition;

	Banner.findById(bannerId)
		.then((featchedBanner) => {
			if (!featchedBanner) {
				const error = new Error(
					'Could not find any Banner with the given bannerId'
				);
				error.statusCode = 404;
				throw error;
			}

			featchedBanner.isShowing = isShowing;
			featchedBanner.bannerPosition = bannerPosition;

			return featchedBanner.save();
		})
		.then((updatedBanner) => {
			res.status(200).json({
				message: ' Item updated',
				banner: updatedBanner,
			});
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.getBanners = (req, res, next) => {
	Banner.find()
		.then((banners) => {
			res.json({ banner: banners });
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};

exports.getBanner = (req, res, next) => {
	const bannerId = req.params.bannerId;

	Banner.findById(bannerId)
		.then((banner) => {
			if (!banner) {
				const error = new Error(
					'Could not find any banner with the given bannerId'
				);
				error.statusCode = 404;
				throw error;
			}
			res
				.status(200)
				.json({ message: 'Banner fetched successfully', banner: banner });
		})
		.catch((err) => {
			if (!err.statusCode) err.statusCode = 500;
			next(err);
		});
};
