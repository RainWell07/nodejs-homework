const Joi = require("joi");
const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");

const schemaBody = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    phone: Joi.string()
        .regex(/^\(\d{3}\)\s\d{3}-\d{4}/)
        .required(),
    favorite: Joi.boolean(),
}).messages({
    "string.pattern.base": "Your Phone number should be only like this form: (066) 434-4434",
});

const contactsSchema = new Schema(
    {
        name: { type: String, required: [true, "Please, set name for the contact"] },
        email: { type: String },
        phone: { type: String },
        favorite: { type: Boolean, default: false },
    },
    { versionKey: false }
);

const Contact = model("contacts", contactsSchema);

contactsSchema.post("save", handleMongooseError);

const updateSchema = Joi.object({
    favorite: Joi.boolean().required(),
}).messages({
    "any.required": "Oops, missing field favorite",
});

module.exports = { schemaBody, updateSchema, Contact };
