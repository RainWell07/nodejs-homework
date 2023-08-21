const express = require('express')

const router = express.Router()

const controll = require("../../controllers/contacts");
const {validationBody, isValidated} = require("../../middlewares");
const bodySchema = require("../../schemas/schemaBody");



router.get('/', controll.getAll);

router.get('/:contactId', isValidated, controll.getContactById);

router.post('/', validationBody(bodySchema.schemaBody), controll.addContact);

router.delete('/:contactId', isValidated, controll.deleteContactById);

router.put('/:contactId', isValidated, validationBody(bodySchema.schemaBody), controll.updateContactById);

router.patch('/:contactId/favorite', isValidated, validationBody(bodySchema.updateSchema), controll.updateFavoriteById);

module.exports = router;
