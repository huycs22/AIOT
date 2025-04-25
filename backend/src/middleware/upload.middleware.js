const multer = require('multer');
const path   = require('path');

// store in memory or customize disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) cb(new Error('Not an image'), false);
    else cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 2 } // 2MB
});

module.exports = upload;
