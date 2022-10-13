const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    if(req.method === "OPTIONS"){
        return next();
    }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error("Authentication failed! here");
    }
    const decodedToken = jwt.verify(token,'j289hj89y#!238989#216489yfr&*!@HD7821786476&*^&*H&2d71!g$hwe6&&&67863g88BHhhjg412!$@!$jkhjkHh7&$!*1^*K!89hhVG^&%gtg675^&&^%$RF5456f5^R%^R567&^*&678y78y78&^&*@#ghfgak')
    req.userData = {userId:decodedToken.userId};
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed! there", 401);
    return next(error);
  }


};
