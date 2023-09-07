
const ctrlWrapper = require("../helpers/ctrlWrapper");
const {HttpError} = require("../helpers/HttpErrors");
// const { required } = require("joi");
const {Contact} = require("../schemas/schemaBody");


const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;

  const skip = (page - 1) * limit;

  if (favorite === "true") {
    const data = await Contact.find({ owner, favorite }, "", {
      skip,
      limit,
    });
    return res.json(data);
  }

  const data = await Contact.find({ owner }, "", { skip, limit });
  return res.json(data);
};

const getContactById = async (req, res, next) => {
    const {contactId} = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
        throw HttpError(404, "Sorry, but nothing found!");
    }
    return res.json(contact);
}

const addContact = async (req, res) => {
    const {_id: owner} = req.user;
    const contact = await Contact.create({...req.body, owner});
    return res.status(201).json(contact);
};

const deleteContactById = async (req, res, next) => {
    const {contactId} = req.params;
    const deletedContact = await Contact.findByIdAndRemove(contactId);
    if(!deletedContact) {
        throw HttpError(404,"Sorry, but nothing found!");
    }
    res.json({message: "Contact has been deleted successfully!"});
};

const updateContactById = async (req, res, next) => {
    const {contactId} = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {new:true,});
    if(!updatedContact) {
        throw HttpError(404, "Sorry, but nothing found!");
    }
    res.json(updatedContact)
};

const updateFavoriteById = async (req, res, next) => {
    const {contactId} = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {new:true,});
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
    updateFavoriteById: ctrlWrapper(updateFavoriteById),
};