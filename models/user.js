const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  rememberMe: { 
    remember: { type: Boolean, required: true },
    token:{type: String}
  },
  friends:[{type: mongoose.Types.ObjectId}],
  friendRequest:[{type: mongoose.Types.ObjectId}],
  monsters: [{type: mongoose.Types.ObjectId , required:true , ref:"monsters"}],
  encounters: [{type: mongoose.Types.ObjectId , required:true , ref:"encounters"}],
  sessions: [{type: mongoose.Types.ObjectId , required:true , ref:"sessions"}],
  sessionsStartedByUser: [{type: mongoose.Types.ObjectId, ref:"sessions"}]



});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("users", userSchema);
