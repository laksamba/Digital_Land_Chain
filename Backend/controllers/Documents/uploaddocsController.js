import Docs from '../../models/Document.js';

// and use new Document({...})
   // use Land model
import cloudinaryPkg from 'cloudinary';
import multer from 'multer';

// Destructure Cloudinary v2
const { v2: cloudinary } = cloudinaryPkg;

// Configure Cloudinary (replace with your credentials from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: 'doc1', maxCount: 1 },
  { name: 'doc2', maxCount: 1 },
  { name: 'doc3', maxCount: 1 },
  { name: 'doc4', maxCount: 1 },
]);

export const createLand = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err });
    }

    const { landId, ownerName } = req.body;
    const files = req.files;

    if (!landId || !ownerName) {
      return res
        .status(400)
        .json({ message: 'Land ID and Owner Name are required' });
    }

    try {
      const uploadPromises = [];

      ['doc1', 'doc2', 'doc3', 'doc4'].forEach((doc) => {
        if (files[doc] && files[doc][0]) {
          const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url);
              }
            );
            uploadStream.end(files[doc][0].buffer);
          });
          uploadPromises.push(uploadPromise);
        } else {
          uploadPromises.push(Promise.resolve(undefined));
        }
      });

      const [doc1Url, doc2Url, doc3Url, doc4Url] = await Promise.all(uploadPromises);

      const newLand = new Docs({
        landId,
        ownerName,
        doc1Url,
        doc2Url,
        doc3Url,
        doc4Url,
      });

      await newLand.save();
      res.status(201).json({ 
        message: 'documents record created successfully', 
        data: newLand 
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
};
