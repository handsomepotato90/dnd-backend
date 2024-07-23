const express = require("express");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const Session = require("../models/session");
const router = express.Router();
const ckeckAuth = require("../controllers/checkAuth");
const bcrypt = require("bcryptjs");

router.use(ckeckAuth);

const change_username = async (req, res, next) => {
  const userDataChange = req.body;
  let existingUser;
  let user;

  try {
    existingUser = await User.findOne({
      name: userDataChange.name,
    });
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      `Username is taken or this e-mail has already been used for registration, please login instead.`,
      422
    );
    return next(error);
  }
  try {
    await User.findByIdAndUpdate(userDataChange.uId, {
      name: userDataChange.name,
    }).exec();
    await Session.updateMany(
      { creator: userDataChange.uId },
      {
        creatorName: userDataChange.name,
      }
    ).exec();
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }

  res.status(201).json({ message: "Session Opened for Voting." });
};

const change_password = async (req, res, next) => {
  const userDataChange = req.body;
  let hashedPass;

  if (userDataChange.password.trim() !== userDataChange.re_password.trim()) {
    const error = new HttpError(`Passwords don't match. Please try again`, 422);
    return next(error);
  }

  try {
    hashedPass = await bcrypt.hash(userDataChange.password.trim(), 12);
  } catch (err) {
    const error = new HttpError(`Could not create user,plaese try again.`, 500);
    return next(error);
  }

  try {
    user = await User.findByIdAndUpdate(userDataChange.uId, {
      password: hashedPass,
    }).exec();
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }

  res.status(201).json({ message: "Session Opened for Voting." });
};
const change_mail = async (req, res, next) => {};

exports.change_username = change_username;
exports.change_password = change_password;
exports.change_mail = change_mail;
