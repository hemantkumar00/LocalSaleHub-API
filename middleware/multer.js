/** @format */
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

//set storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only

  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

module.exports = multer({ storage: storage, fileFilter: imageFilter });
