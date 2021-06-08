/** @format */

const multer = require('multer');

//set storage
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});
const imageFilter = function (req, file, cb) {
	// Accept images only
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
		req.fileValidationError = 'Only image files are allowed!';
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};

module.exports = multer({ storage: storage, fileFilter: imageFilter });
