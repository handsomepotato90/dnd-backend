const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
{
    user: { type: String, required: true },
    monster: { type: String, required: true },
    vote: { type: Number, required: true },
  },
);

module.exports = mongoose.model("votes", voteSchema);


