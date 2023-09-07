const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");
const Joi = require("joi");

const usersSchema = new Schema(
    {
      password: {
        type: String,
        required: [true, "Set password for user"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
      },
      token: String,
    },
    { versionKey: false }
  );

usersSchema.post("save", handleMongooseError);

const authSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().min(6).required(),
  });

  const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string()
      .valid("starter", "pro", "business")
      .required()
      .messages({
        "any.required": "missing field subscription",
      }),
  });

const User = model("user", usersSchema);

module.exports = {authSchema, updateSubscriptionSchema, User,};