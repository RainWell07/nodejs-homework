const express = require("express");
const router = express.Router();
const {validationBody, authenticator} = require("../../middlewares");
const bodySchema = require("../../schemas/user");
const controll = require("../../controllers/auth");
const uploadPhoto = require("../../middlewares/UploadMulter");

router.post("/register", validationBody(bodySchema.authSchema), controll.register);

router.post("/login", validationBody(bodySchema.authSchema), controll.login);

router.get("/current", authenticator, controll.getCurrent);

router.post("/logout", authenticator, controll.logout);

router.patch("/:userId/subscription", authenticator, validationBody(bodySchema.updateSubscriptionSchema), controll.updateSubscriptionById);

router.patch("/avatars", authenticator, uploadPhoto.single("avatar"), controll.UpdateAvatar);

module.exports = router;



