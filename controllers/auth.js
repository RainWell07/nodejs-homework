const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {HttpError} = require("../helpers/HttpErrors");
const sendMail = require("../helpers/sendMail");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const {User} = require("../schemas/user");
const {SECRET_KEY, BASE_URL} = process.env;
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const resizeAvatar = require("../helpers/resizeAvatar");
const fs  = require("fs/promises");
const { v4: uuidv4 } = require('uuid');

const AvatarDir = path.join(__dirname, "../", "public", "avatars");



const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Sorry, but this email is already in use!");
    }

    const verificationToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Mail verification",
      html: `<p>Good day! Please confirm your email. Follow the link below <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Confirm e-mail</a></p>`,
    };

    await sendMail(verifyEmail);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
      throw HttpError(404, "User was not found!");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.json({
      message: "Verification done successful!",
    });
  } catch (err) {
    next(HttpError(404, "User was not found!"));
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const {email} = req.body;
    const user = User.findOne({email});
    if(!user) {
      throw HttpError(404, "Oops, missing required field email");
    }
    if(user.verify) {
      throw HttpError(400, "Verification has already been done!");
    }

    const verifyEmail = {
      to: email,
      subject: "Email verification",
      text: "Hi!, You need to confirm your email. Please follow the link",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Confirm e-mail</a>`,
    };

    await sendMail(verifyEmail);
    res.json({
      message: "Verification done successful!",
    });
  } catch (err) {
    next(HttpError(404, err.message));
  }
};


const login = async (req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
      throw HttpError(401, "Email was not confirmed!");
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
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  };
