const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sessionsSchema = new mongoose.Schema({
  creator: { type: mongoose.Types.ObjectId },
  creatorName: { type: String, required: true, ref: "users" },
  status: { type: String },
  scheduledFor: { type: Array },
  dmStatus: { type: Boolean, required: true },
  hostStatus: { type: Boolean, required: true },
  title: { type: String },
  timeforvoting: { type: Number },
  dates: { type: Array, required: true },
  friendsWithInvites: [
    { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  ],
  votes: [
    {
      user: { type: mongoose.Types.ObjectId },
      username: { type: String },
      dates: { type: Array },
    },
  ],
  comments: {
    user: { type: mongoose.Types.ObjectId },
    username: { type: String },
    comment: { type: String },
  },
});
sessionsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("sessions", sessionsSchema);
