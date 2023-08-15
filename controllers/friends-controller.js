const HttpError = require("../models/http-error");
const User = require("../models/user");

const friends = async (req, res, next) => {
  let user;
  let reqFriend = [];
  let friends = [];
  try {
    user = await User.findById(req.body.userId).exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }
  try {
    reqFriend = await User.find({ _id: { $in: user.friendRequest } })
      .select("name")
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }
  try {
    friends = await User.find({ _id: { $in: user.friends } })
      .select("name")
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json([reqFriend, friends]);
};

const search_users = async (req, res, next) => {
  let user;
  let lesUserInfo = [];
  try {
    user = await User.find({
      _id: { $ne: req.body.myId },
      name: { $regex: req.body.user, $options: "i" },
      $and: [
        { friends: { $nin: [req.body.myId] } },
        { friendRequest: { $nin: [req.body.myId] } },
      ],
    })
      .select("name")
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }
  user.forEach((u) => lesUserInfo.push({ name: u.name }));

  res.status(201).json(lesUserInfo);
};

const req_friend = async (req, res, next) => {
  let user;

  try {
    user = await User.findOne({
      name: req.body.name,
    }).exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(`No user with this name`, 422);
    return next(error);
  }

  try {
    user = await User.findByIdAndUpdate(user._id, {
      $push: { friendRequest: [req.body.myId] },
    }).exec();
  } catch (err) {
    const error = new HttpError(
      `Monster creation failed, plsease try again.${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json();
};

const res_friend = async (req, res, next) => {
  const dataReq = req.body;
  let user;
  console.log(req.body);
  switch (dataReq.decision) {
    case "accept":
      try {
        user = await User.findByIdAndUpdate(dataReq.myId, {
          $pullAll: { friendRequest: [dataReq.user] },
          $push: { friends: [dataReq.user] },
        }).exec();
        secondUser = await User.findByIdAndUpdate(dataReq.user, {
          $pullAll: { friendRequest: [dataReq.myId] },
          $push: { friends: [dataReq.myId] },
        }).exec();
      } catch (err) {
        const error = new HttpError(
          `Monster creation failed, plsease try again.${err}`,
          500
        );
        return next(error);
      }
      res.status(201).json();

    case "reject":
      try {
        user = await User.findByIdAndUpdate(dataReq.myId, {
          $pullAll: { friendRequest: [dataReq.user] },
        }).exec();
      } catch (err) {
        const error = new HttpError(
          `Monster creation failed, plsease try again.${err}`,
          500
        );
        return next(error);
      }
      res.status(201).json();
  }

  res.status(201).json();
};

exports.friends = friends;
exports.search_users = search_users;
exports.req_friend = req_friend;
exports.res_friend = res_friend;
