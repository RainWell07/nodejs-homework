const express = require('express')

const router = express.Router()

const controll = require("../../controllers/contacts");
const {validationBody, isValidated, authenticator} = require("../../middlewares");
const bodySchema = require("../../schemas/schemaBody");



router.get('/', authenticator, controll.getAll);

router.get('/:contactId', authenticator, isValidated, controll.getContactById);

router.post('/', authenticator, validationBody(bodySchema.schemaBody), controll.addContact);

router.delete('/:contactId', authenticator, isValidated, controll.deleteContactById);

router.put('/:contactId', authenticator, isValidated, validationBody(bodySchema.schemaBody), controll.updateContactById);

router.patch('/:contactId/favorite', authenticator, isValidated, validationBody(bodySchema.updateSchema), controll.updateFavoriteById);

module.exports = router;
