const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      $or: [{ name: name }, { email: email }],
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

  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(`Could not create user,plaese try again.`, 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPass,
    monsters: [],
  });

  try {
    await createdUser.save();
  } catch {
    const error = new HttpError(`Signup failed. Try again later.`, 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );
  } catch (err) {
    const error = new HttpError(`Signup failed. Try again later.`, 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser, token: token });
};





const login = async (req, res, next) => {
  const { name, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      `Something went wrong try again later.${err}`,
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(`Can't find user with this username.`, 40);
    return next(error);
  }
  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(`Invalid password. Try again.`, 403);
    return next(error);
  }
  if (!isValidPass) {
    const error = new HttpError(
      `Invalid credentials, could not log you in.`,
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );
  } catch (err) {
    const error = new HttpError(`Signup failed. Try again later.`, 500);
    return next(error);
  }

  res.json({
    user: existingUser.toObject({ getters: true }),
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
