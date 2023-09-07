const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {HttpError} = require("../helpers/HttpErrors");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const {User} = require("../schemas/user");
const {SECRET_KEY} = process.env;
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const resizeAvatar = require("../helpers/resizeAvatar");
const fs  = require("fs/promises");

const AvatarDir = path.join(__dirname, "../", "public", "avatars");



const register = async (req, res) => {
    const {password, email} = req.body;
    const user = await User.findOne({email});
    if(user){
    throw HttpError(409, "Sorry, but this email is already in use!")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashedPassword, avatarURL, });

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
      });
};

const login = async (req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const comapredPassword = bcrypt.compare(password, user.password);

    if (!comapredPassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  };

  const logout = async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  };

  const updateSubscriptionById = async (req, res) => {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedUser) {
      throw HttpError(404, "Not found!");
    }
    res.json(updatedUser);
  };

  const UpdateAvatar = async (req,res) => {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultofUpload = path.join(AvatarDir, filename);
    await fs.rename(tempUpload, resultofUpload);
    resizeAvatar(resultofUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({avatarURL,});
    console.log("Done");
  };

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscriptionById: ctrlWrapper(updateSubscriptionById),
    UpdateAvatar: ctrlWrapper(UpdateAvatar),
  };
