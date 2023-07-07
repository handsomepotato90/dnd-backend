const mongoose = require("mongoose");

const encouterSchema = new mongoose.Schema(
{
    enc_name:  { type: String, required: true },
    creator: {type: mongoose.Types.ObjectId , required:true , ref:"users"},
    monsters: [
      {
        name:  { type: String, required: true },
        img:  { type: String, required: true },
      },
    ],
    players: [
      {
        level:  { type: Number, required: true },
      },
    ],
  },
);

module.exports = mongoose.model("encounters", encouterSchema);


