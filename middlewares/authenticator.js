const {User} = require("../schemas/user");
const {HttpError} = require("../helpers/HttpErrors");
const  {SECRET_KEY} = process.env;
const jwt = require("jsonwebtoken");
require("dotenv").config();


const authenticator = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      next(HttpError(401, "Sorry, but you didn`t authorized yet!"));
    }

    try {
      const { id } = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(id);

      if (!user || !user.token || user.token !== token) {
        next(HttpError(401, "Sorry, but you didn`t authorized yet!"));
      }
      req.user = user;
      next();
    } catch {
      next(HttpError(401, "Sorry, but you didn`t authorized yet!"));
    }
  };

  module.exports = authenticator;