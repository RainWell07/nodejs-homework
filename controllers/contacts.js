
const ctrlWrapper = require("../helpers/ctrlWrapper");
const {HttpError} = require("../helpers/HttpErrors");
const { required } = require("joi");
const contacts = require("../models/contacts");

const getAll = async (req, res, next) => {
    const data = await contacts.listContacts();
    return res.json(data);
};

const getContactById = async (req, res, next) => {
    const {contactId} = req.params;
    const contact = await contacts.getContactsById(contactId);
    if (!contact) {
        throw HttpError(404, "Sorry, but nothing found!");
    }
    return res.json(contact);
}

const addContact = async (req, res, next) => {
    const contact = await contacts.addContact(req.body);
    return res.status(201).json(contact);
};

const deleteContactById = async (req, res, next) => {
    const {contactId} = req.params;
    const deletedContact = await contacts.removeContact(contactId);
    if(!deletedContact) {
        throw HttpError(404,"Sorry, but nothing found!");
    }
    res.json({message: "Contact has been deleted successfully!"});
};

const updateContactById = async (req, res, next) => {
    const {contactId} = req.params;
    const updatedContact = await contacts.updateContact(contactId, req.body);
    if(!updatedContact) {
        throw HttpError(404, "Sorry, but nothing found!");
    }
    res.json(updatedContact)
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    deleteContactById: ctrlWrapper(deleteContactById),
    updateContactById: ctrlWrapper(updateContactById),
};