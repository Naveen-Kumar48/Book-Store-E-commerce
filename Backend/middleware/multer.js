const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AppError = require("../utils/AppError");

// Ensure directory exists dynamically to prevent Render ENOENT crash
const absoluteUploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(absoluteUploadDir)) {
  fs.mkdirSync(absoluteUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
