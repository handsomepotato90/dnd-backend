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
  const { name, email, password, remember } = req.body;
  let existingUser;
  let rememberMeHash;
  if (remember) {
    try {
      rememberMeHash = jwt.sign(
        { name: name, remember: remember },
        process.env.JWT_COOKIE_KEY,
        { expiresIn: "365d" }
      );
    } catch (err) {
      const error = new HttpError(`Signup failed. Try again later.`, 500);
      return next(error);
    }
  }
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
    rememberMe: {
      remember: remember,
      token: rememberMeHash,
    },
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
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(`Signup failed. Try again later.`, 500);
    return next(error);
  }

  res
    .cookie("rmTOKEN", rememberMeHash, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    })
    .json({ user: createdUser.id, token: token });
};

const login = async (req, res, next) => {
  const { name, password, remember } = req.body;
  let existingUser;
  let rememberMeHash;
  if (remember) {
    try {
      rememberMeHash = jwt.sign(
        { name: name, remember: remember },
        process.env.JWT_COOKIE_KEY,
        { expiresIn: "365d" }
      );
    } catch (err) {
      const error = new HttpError(`Signup failed. Try again later.`, 500);
      return next(error);
    }
  }
  try {
    existingUser = await User.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(`Can't find user with this username.`, 404);
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
  await existingUser.updateOne({
    rememberMe: {
      remember: remember,
      token: rememberMeHash,
    },
  });

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(`Login failed. Try again later.`, 500);
    return next(error);
  }

  res
    .cookie("rmTOKEN", rememberMeHash, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    })
    .json({
      user: existingUser.toObject({ getters: true }),
      token: token,
    });
};
const facebook = async (req, res, next) => {
  let existingUser;
  let rememberMeHash;
  let hashedPass;
  let token;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }
  if (req.body.remember) {
    try {
      rememberMeHash = jwt.sign(
        { name: existingUser.name, remember: req.body.remember },
        process.env.JWT_COOKIE_KEY,
        { expiresIn: "365d" }
      );
    } catch (err) {
      const error = new HttpError(`Signup failed. Try again later.`, 500);
      return next(error);
    }
  }
  try {
    hashedPass = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    const error = new HttpError(`Could not create user,plaese try again.`, 500);
    return next(error);
  }
  if (!existingUser) {
    const existingUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
      monsters: [],
    });
    try {
      await existingUser.save();
    } catch {
      const error = new HttpError(`Signup failed. Try again later.`, 500);
      return next(error);
    }
  }
  await existingUser.updateOne({
    rememberMe: {
      remember: req.body.remember,
      token: rememberMeHash,
    },
  });
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        remember: req.body.remember,
      },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(`Signup failed. Try again later.`, 500);
    return next(error);
  }
  res
    .cookie("rmTOKEN", rememberMeHash, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    })
    .json({ user: existingUser.toObject({ getters: true }), token: token });
};

const google = async (req, res, next) => {
  const decodedToken = jwt.decode(req.body.googleToken);
  let existingUser;
  let rememberMeHash;
  let hashedPass;
  let token;
  try {
    existingUser = await User.findOne({ email: decodedToken.email });
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }
  if (req.body.remember) {
    try {
      rememberMeHash = jwt.sign(
        {
          name: existingUser.name,
          remember: req.body.remember,
        },
        process.env.JWT_COOKIE_KEY,
        { expiresIn: "365d" }
      );
    } catch (err) {
      const error = new HttpError(`Signup failed. Try again later.`, 500);
      return next(error);
    }
  }
  try {
    hashedPass = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    const error = new HttpError(`Could not create user,plaese try again.`, 500);
    return next(error);
  }
  if (!existingUser) {
    const existingUser = new User({
      name: decodedToken.name,
      email: decodedToken.email,
      password: hashedPass,
      monsters: [],
    });
    try {
      await existingUser.save();
    } catch {
      const error = new HttpError(`Signup failed. Try again later.`, 500);
      return next(error);
    }
  }
  await existingUser.updateOne({
    rememberMe: {
      remember: req.body.remember,
      token: rememberMeHash,
    },
  });

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(`Login failed. Try again later.`, 500);
    return next(error);
  }

  res
    .cookie("rmTOKEN", rememberMeHash, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    })
    .json({ user: existingUser.toObject({ getters: true }), token: token });
};

const remember = async (req, res, next) => {
  const compare = jwt.verify(req.cookies.rmTOKEN, process.env.JWT_COOKIE_KEY);
  if (!compare.remember) {
    const error = new HttpError(`Can't find user with this username.`, 404);
    return next(error);
  }
  let existingUser;
  try {
    existingUser = await User.findOne({
      name: compare.name,
      "rememberMe.token": req.cookies.rmTOKEN,
      "rememberMe.remember": compare.remember,
    });
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
  } catch (err) {
    const error = new HttpError(`Login failed. Try again later.`, 500);
    return next(error);
  }

  res.json({
    user: existingUser.toObject({ getters: true }),
    token: token,
  });
};

exports.google = google;
exports.remember = remember;
exports.signup = signup;
exports.login = login;
exports.facebook = facebook;
