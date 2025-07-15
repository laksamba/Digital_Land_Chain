import asyncHandler from 'express-async-handler';
import Land from '../../models/Land.js';


export const rejectLandRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const land = await Land.findById(id);
  if (!land) {
    return res.status(404).json({ message: 'Land not found' });
  }

  if (land.status !== 'pending') {
    return res.status(400).json({ message: 'Land already processed' });
  }

  land.status = 'rejected';
  land.tempDocuments = [];
  await land.save();

  res.status(200).json({ message: 'Land registration rejected' });
});
