const { Request } = require("express");
const multer = require("multer");
const path = require("node:path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This part defines where the files need to be saved
    cb(null, path.join(__dirname, "../../tmp/uploads"));
  },
  filename: (req, file, cb) => {
    // This part sets the file name of the file
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "__" + file.originalname
    );
  },
});

const imgFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  // validate file types
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    ext === ".gif"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = true;
    cb(null, false, req.fileValidationError);
  }
};

// const videoFileFilter = (
//   req,
//   file,
//   cb
// ) => {
//   const allowedVideoAndThumbnailTypes = [
//     "video/x-msvideo",
//     "video/mp4",
//     "video/mpeg",
//     "video/ogg",
//     "video/mp2t",
//     "video/webm",
//     "video/3gpp",
//     "video/3gpp2",
//     "image/jpeg",
//     "image/png",
//   ];
//   // reject a file
//   if (allowedVideoAndThumbnailTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

exports.multerPostUpload = multer({
  storage,
  fileFilter: imgFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10mb
  },
});

// exports.multerCourseCoverUpload = multer({
//   storage,
//   fileFilter: imgFileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // 5mb
//   },
// });

// exports.multerVideoUpload = multer({
//   storage,
//   fileFilter: videoFileFilter,
// });
