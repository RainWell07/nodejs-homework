const multer = require("multer");
const path = require("path");
const temporalDir = path.join(__dirname, "../", "tmp");

const UploadMulter = multer.diskStorage({destination:temporalDir, filename:(_, file, cb) => {
      cb(null, file.originalname);
},
});

const upload = multer({storage: UploadMulter,});

module.exports = upload;