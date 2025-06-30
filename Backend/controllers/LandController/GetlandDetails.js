import Land from '../../models/Land.js';


export const getLandWithOwnerDetails = async (req, res) => {
  try {
    const landId = req.params.id; 

    
    const land = await Land.findById(landId).populate('owner');

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }
    res.json({ land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
