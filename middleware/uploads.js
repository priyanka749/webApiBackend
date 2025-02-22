// const fs = require("fs");
// const multer = require("multer");
// const path = require("path");

// // ✅ Ensure `public/uploads` directory exists before saving files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = "public/uploads";
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `IMG-${Date.now()}${ext}`);
//   },
// });

// // ✅ File Filter: Allow only images
// const imageFileFilter = (req, file, cb) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     return cb(new Error("File format not supported."), false);
//   }
//   cb(null, true);
// };

// // ✅ Configure Multer
// const upload = multer({
//   storage: storage,
//   fileFilter: imageFileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
// });

// module.exports = upload;
const multer = require("multer");
const path = require("path");

// Define Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, "IMG-" + Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File Type Filter
const imageFileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new Error("File format not supported."), false);
  }
};

// Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
