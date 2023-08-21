const {isValidObjectId} = require("mongoose");
const {HttpError} = require("../helpers/HttpErrors");

const isValidated = (req, res, next) => {
    const {id} = req.params;
    if(!isValidObjectId) {
        next(HttpError(400, `This id ${id} is not valid!`))
    }
    next();
};

module.exports = isValidated;