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
  monsters: [{type: mongoose.Types.ObjectId , required:true , ref:"monsters"}],
  encounters: [{type: mongoose.Types.ObjectId , required:true , ref:"encounters"}]

});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("users", userSchema);
