const multer = require("multer");

const extensions = ["jpeg", "jpg", "png"];

const getExtension = (file) => {
  const name = file.originalname;
  const dot = name.lastIndexOf(".") + 1;
  return name.substr(dot).toLowerCase();
};

const fileFilter = (_, file, cb) => {
  const extension = getExtension(file);
  const accept = extensions.includes(extension);
  cb(null, accept);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5242880, // 5MB
  },
}).single("photo");

module.exports = (req, res, next) => {
  return upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "The file you sent is too big" });
      }
      // any other limit error handling should go here
    } else if (!err) {
      // no errors during file parsing
      return next();
    }
    // uncaught error
    console.error(`Error during upload():\n${err}`);
    res.status(500).send();
  });
};
