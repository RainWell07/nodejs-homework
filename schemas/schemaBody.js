const Joi = require("joi");

const schemaBody = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
    .email({
        minDomainSegments:2,
        tlds:{allow: ["com", "net"]},
    })
    .required(),
    phone: Joi.string()
    .regex(/^\(\d{3}\)\s\d{3}-\d{4}/)
    .messages({"string.pattern.base": "Your Phone number  should be only like this form: (066) 434-4434",})
    .required(),
});

module.exports = {schemaBody,};