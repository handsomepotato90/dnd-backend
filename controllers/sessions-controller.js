const HttpError = require("../models/http-error");
const User = require("../models/user");
const Session = require("../models/session");
const express = require("express");
const router = express.Router();
const ckeckAuth = require("../controllers/checkAuth");
const { default: mongoose } = require("mongoose");

router.use(ckeckAuth);

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

  res.status(201).json(friends);
};

const upload_session = async (req, res, next) => {
  const now = new Date().getTime();
  const reqUser = req.body;
  let user;
  let users;
  try {
    user = await User.findById(reqUser.userId).exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.Please Logout and Login again.${err}`,
      500
    );
    return next(error);
  }
  const createdSession = new Session({
    creator: reqUser.userId,
    creatorName: user.name,
    dmStatus: reqUser.isDm,
    status: reqUser.status,
    hostStatus: reqUser.isHost,
    title: reqUser.title,
    timeforvoting: now + reqUser.hoursForVoting * 60 * 60 * 1000,
    dates: reqUser.dates,
    friendsWithInvites: reqUser.invitedFriends,
    comments: [{ comment: "", user: "", username: "" }],
  });
  try {
    await createdSession.save();

    reqUser.invitedFriends.forEach(
      async (user) =>
        await User.findByIdAndUpdate(user._id, {
          $push: { sessions: createdSession._id },
        }).exec()
    );
    await User.findByIdAndUpdate(reqUser.userId, {
      $push: { sessionsStartedByUser: createdSession._id },
    }).exec();
  } catch (err) {
    const error = new HttpError(`Something went wrong try again later.`, 500);
    return next(error);
  }

  res.status(201).json({ message: "Session Uploaded." });
};

const session_invites = async (req, res, next) => {
  const now = new Date().getTime();

  let user;
  let sessions;
  let mysessions;
  try {
    user = await User.findById(req.body.id).exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.Please Logout and Login again.${err}`,
      500
    );
    return next(error);
  }

  try {
    sessions = await Session.find({
      _id: { $in: user.sessions },
      timeforvoting: { $gt: now },
    })
      .select("_id creatorName scheduledFor title status timeforvoting")
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.Please Logout and Login again.${err}`,
      500
    );
    return next(error);
  }
  try {
    mysessions = await Session.find({
      _id: { $in: user.sessionsStartedByUser },
    })
      .select("_id creatorName scheduledFor title status timeforvoting")
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.Please Logout and Login again.${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ sessions, mysessions });
};

const get_vote_on_invite = async (req, res, next) => {
  let sessionId = req.params.id;
  let session;
  try {
    session = await Session.findById(sessionId)
      .select(
        "creatorName dmStatus status scheduledFor comments votes hostStatus title timeforvoting dates"
      )
      .exec();
  } catch (err) {
    const error = new HttpError(`Something went wrong.${err}`, 500);
    return next(error);
  }
  res.status(201).json(session);
};

const post_vote_on_invite = async (req, res, next) => {
  let session;

  let filter = {
    _id: req.body.calendarId,
    "votes.user": req.body.id,
  };
  try {
    session = await Session.find(filter);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.${err}`,
      500
    );

    return next(error);
  }
  if (session.length === 0) {
    try {
      session = await Session.findByIdAndUpdate(req.body.calendarId, {
        $push: {
          votes: {
            user: req.body.id,
            username: req.body.username,
            dates: req.body.dates,
          },
        },
      });
    } catch (err) {
      const error = new HttpError(
        `Something went wrong.There is no such Session up for voting.${err}`,
        500
      );

      return next(error);
    }
  } else {
    try {
      session = await Session.findOneAndUpdate(
        {
          _id: req.body.calendarId,
        },
        { $set: { "votes.$[el].dates": req.body.dates } },
        {
          arrayFilters: [{ "el.user": req.body.id }],
          new: true,
        }
      );
    } catch (err) {
      const error = new HttpError(
        `Something went wrong.There is no such Session up for voting.${err}`,
        500
      );

      return next(error);
    }
  }
  res.status(201).json({ message: "Thanks for your vote." });
};

const my_sessions = async (req, res, next) => {
  let sessionId = req.params.id;
  let session;
  try {
    session = await Session.findById(sessionId)
      .select(
        "creatorName dmStatus status scheduledFor comments votes hostStatus title timeforvoting dates"
      )
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json(session);
};

const schedule_session = async (req, res, next) => {
  let sessionId = req.params.id;
  let session;
  try {
    session = await Session.findByIdAndUpdate(sessionId, {
      status: req.body.status,
      scheduledFor: req.body.dates,
    }).exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.${err}`,
      500
    );
    return next(error);
  }
  res.status(201).json({ message: "Session Opened for Voting." });
};

const comments = async (req, res, next) => {
  let session;
  if (req.body.title.trim() === "") {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.`,
      500
    );
    return next(error);
  }
  try {
    session = await Session.findByIdAndUpdate(req.body.calendarId, {
      $push: {
        comments: {
          user: req.body.id,
          comment: req.body.title,
          username: req.body.username,
        },
      },
    }).exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.${err}`,
      500
    );
    return next(error);
  }
  res.status(201).json({});
};

const close_session = async (req, res, next) => {
  let session;
  try {
    session = await Session.findByIdAndUpdate(req.body.calendarId, {
      status: req.body.status,
      dates: [],
      scheduledFor: [],
      votes: [],
    }).exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Session Closed." });
};

const delete_session = async (req, res, next) => {
  let remSession;
  try {
    remSession = await Session.findById(req.body.calendarId)
      .select("creator friendsWithInvites")
      .exec();
  } catch (err) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.${err}`,
      500
    );
    return next(error);
  }
  if (!remSession) {
    const error = new HttpError(
      `Something went wrong.There is no such Session up for voting.`,
      500
    );
    return next(error);
  }

  try {
    User.findOneAndUpdate(
      { _id: remSession.creator },
      {
        $pullAll: { sessionsStartedByUser: [req.body.calendarId] },
      }
    ).exec();
    remSession.friendsWithInvites.forEach(async (el) => {
      User.findOneAndUpdate(
        { _id: el },
        {
          $pullAll: { sessions: [req.body.calendarId] },
        }
      ).exec();
    });
    remSession.remove();
  } catch (err) {
    const error = new HttpError(`Delete failed`, 500);
    return next(error);
  }

  res.status(201).json({ message: "Session deleted." });
};

exports.friends = friends;
exports.upload_session = upload_session;
exports.session_invites = session_invites;
exports.get_vote_on_invite = get_vote_on_invite;
exports.post_vote_on_invite = post_vote_on_invite;
exports.my_sessions = my_sessions;
exports.schedule_session = schedule_session;
exports.comments = comments;
exports.close_session = close_session;
exports.delete_session = delete_session;
