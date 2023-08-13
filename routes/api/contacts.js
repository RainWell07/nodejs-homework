const express = require('express')

const router = express.Router()

const controll = require("../../controllers/contacts");
const {validationBody} = require("../../middlewares");
const bodySchema = require("../../schemas/schemaBody");



router.get('/', controll.getAll);

router.get('/:contactId', controll.getContactById);

router.post('/', validationBody(bodySchema.schemaBody), controll.addContact);

router.delete('/:contactId', controll.deleteContactById);

router.put('/:contactId', validationBody(bodySchema.schemaBody), controll.updateContactById);

module.exports = router
