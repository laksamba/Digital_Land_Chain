
import Docs from '../../models/Document.js';

export const getAllDocuments = async (req, res) => {
  try {
    const lands = await Docs.find();
    res.status(200).json({
      message: 'Documents records fetched successfully',
      data: lands,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};