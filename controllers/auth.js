/** @format */

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const Seller = require("../models/Seller");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

exports.signupUser = (req, res, next) => {
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

  if (role !== "ROLE_USER") {
    return res.status(401).json({
      error: "Signing up an user should have a role of ROLE_USER",
    });
  }

  bcrypt
    .hash(password, 12)
    .then(() => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: password,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        account: savedAccount,
      });
      return user.save();
    })
    .then((savedUser) => {
      //email verification

      async function main() {
        let transporter = nodemailer.createTransport({
          host: "titan.int3rnet.net",
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
          subject: "Email regarding forgot password", // Subject line
          html: `
                      <p>Please verify your email by clicking on the link below - MultiVanser</p>
                      <p>Click this <a href="http://localhost:8000/api/verify/${token}">link</a> to verify your account.</p>
                    `,
        });
      }
      main().catch(console.error);
      res.status(201).json({
        message:
          "User signed-up successfully, please verify your email before logging in.",
        userId: savedUser._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
    });
};

exports.verifyAccount = (req, res) => {
  const token = req.params.token;
  Account.findOne({
    accountVerifyToken: token,
    accountVerifyTokenExpiration: { $gt: Date.now() },
  })
    .then((account) => {
      if (!account) {
        const error = new Error(
          "Token in the url is tempered, don't try to fool me!",
        );
        error.statusCode = 403;
        throw error;
      }
      account.isVerified = true;
      account.accountVerifyToken = undefined;
      account.accountVerifyTokenExpiration = undefined;
      return account.save();
    })
    .then((account) => {
      res.json({ message: "Account verified successfully." });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Account.findOne({ email: email })
    .then((account) => {
      if (!account) {
        const error = new Error("Invalid email/password combination.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = account;
      return account.autheticate(password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid email/password combination.");
        error.statusCode = 401;
        throw error;
      }
      if (loadedUser.isVerified === false) {
        const error = new Error(
          "Verify your email before accessing the platform.",
        );
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { accountId: loadedUser._id.toString() },
        "supersecretkey-multivander",
        { expiresIn: "10h" },
      );
      res.status(200).json({
        message: "Logged-in successfully",
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.signupSeller = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  if (req.files.length == 0) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const tags = req.body.tags;
  const role = req.body.role;
  const payment = req.body.payment;
  const paymentArray = payment.split(" ");
  const minOrderAmount = req.body.minOrderAmount;
  const costForOne = req.body.costForOne;
  const phoneNo = req.body.phoneNo;
  const street = req.body.street;
  const aptName = req.body.aptName;
  const formattedAddress = req.body.formattedAddress;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const locality = req.body.locality;
  const zip = req.body.zip;

  let token;

  if (role !== "ROLE_SELLER") {
    const error = new Error(
      "Signing up a seller should have a role of ROLE_SELLER",
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then(() => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: password,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const seller = new Seller({
        name: name,
        tags: tags,
        imageUrl: req.files.map((file) => file.path),
        minOrderAmount: minOrderAmount,
        costForOne: costForOne,
        account: savedAccount,
        payment: paymentArray,
        formattedAddress: formattedAddress,
        address: {
          street: street,
          zip: zip,
          phoneNo: phoneNo,
          locality: locality,
          aptName: aptName,
          lat: lat,
          lng: lng,
        },
      });
      return seller.save();
    })
    .then((savedSeller) => {
      //email verification

      async function main() {
        let transporter = nodemailer.createTransport({
          host: "titan.int3rnet.net",
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
          subject: "Email regarding forgot password", // Subject line
          html: `
                      <p>Please verify your email by clicking on the link below - MultiVanser</p>
                      <p>Click this <a href="http://localhost:8000/api/verify/${token}">link</a> to verify your account.</p>
                    `,
        });
      }
      main().catch(console.error);
      res.status(201).json({
        message:
          "Seller signed-up successfully, please verify your email before logging in.",
        sellerId: savedSeller._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.imagesTest = (req, res) => {
  if (!req.files) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const arrayFiles = req.files.map((file) => file.path);
  console.log(arrayFiles);

  res.status(200).json({ message: "success" });
};
