import multer from 'multer';
import path from 'path';

// Memory storage (so we can upload buffer to Cloudinary)
const storage = multer.memoryStorage();

// File filter (optional - to accept only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images or PDF files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
