import Survey from "../../models/Survey.js";
import User from "../../models/User.js";
// Create a new survey request
const createSurvey = async (req, res) => {
  try {
    const { landId, surveyDetails, surveyOfficer } = req.body;

    // Validate required fields
    if (!landId) {
      return res.status(400).json({ message: 'Land ID is required', error: 'Missing landId' });
    }

    // Validate surveyOfficer if provided
    if (surveyOfficer) {
      const officer = await User.findById(surveyOfficer);
      if (!officer || officer.role !== 'surveyor') {
        return res.status(400).json({ message: 'Invalid or non-surveyor officer', error: 'Invalid surveyOfficer' });
      }
    }

    // Ensure requester is set from authenticated user
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required', error: 'No user found' });
    }

    const survey = await Survey.create({
      landId,
      requester: req.user._id,
      surveyDetails,
      surveyOfficer: surveyOfficer || null,
      status: 'pending',
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Populate requester and surveyOfficer for response
    const populatedSurvey = await Survey.findById(survey._id)
      .populate('requester', 'name email')
      .populate('surveyOfficer', 'name email');

    res.status(201).json({ message: 'Survey request created successfully', survey: populatedSurvey });
  } catch (err) {
    console.error('Error creating survey:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all surveys (with optional filtering by status or landId)
const getAllSurveys = async (req, res) => {
  try {
    const { status, landId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (landId) query.landId = landId;

    const surveys = await Survey.find(query)
      .populate('requester', 'name email')
      .populate('surveyOfficer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(surveys);
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single survey by ID
const getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findById(id)
      .populate('requester', 'name email')
      .populate('surveyOfficer', 'name email');

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found', error: 'Invalid survey ID' });
    }

    res.status(200).json(survey);
  } catch (err) {
    console.error('Error fetching survey:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a survey (e.g., assign surveyOfficer, update status, add documents)
const updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const { landId, surveyDetails, surveyOfficer, status, documents } = req.body;

    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found', error: 'Invalid survey ID' });
    }

    // Validate permissions (e.g., only admins or surveyors can update)
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required', error: 'No user found' });
    }
    // Restrict updates to admins, assigned surveyor, or requester
    if (
      req.user.role !== 'admin' &&
      survey.surveyOfficer?.toString() !== req.user._id &&
      survey.requester.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: 'Unauthorized to update this survey', error: 'Permission denied' });
    }

    // Validate surveyOfficer if provided
    if (surveyOfficer) {
      const officer = await User.findById(surveyOfficer);
      if (!officer || officer.role !== 'surveyor') {
        return res.status(400).json({ message: 'Invalid or non-surveyor officer', error: 'Invalid surveyOfficer' });
      }
    }

    // Validate status if provided
    if (status && !['pending', 'in_progress', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status', error: 'Invalid status value' });
    }

    // Update fields
    survey.landId = landId || survey.landId;
    survey.surveyDetails = surveyDetails !== undefined ? surveyDetails : survey.surveyDetails;
    survey.surveyOfficer = surveyOfficer || survey.surveyOfficer;
    survey.status = status || survey.status;
    survey.documents = documents || survey.documents;
    survey.updatedAt = new Date();

    await survey.save();

    // Populate for response
    const populatedSurvey = await Survey.findById(id)
      .populate('requester', 'name email')
      .populate('surveyOfficer', 'name email');

    res.status(200).json({ message: 'Survey updated successfully', survey: populatedSurvey });
  } catch (err) {
    console.error('Error updating survey:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a survey
const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found', error: 'Invalid survey ID' });
    }

    // Validate permissions (e.g., only admins or requester can delete)
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required', error: 'No user found' });
    }
    if (req.user.role !== 'admin' && survey.requester.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized to delete this survey', error: 'Permission denied' });
    }

    await Survey.deleteOne({ _id: id });

    res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (err) {
    console.error('Error deleting survey:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get surveyors (for assigning surveyOfficer)
const getSurveyors = async (req, res) => {
  try {
    const surveyors = await User.find({ role: 'surveyor' }).select('_id name email');
    // Always return an array (empty if no surveyors)
    res.status(200).json(surveyors);
  } catch (err) {
    console.error('Error fetching surveyors:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  getSurveyors,
}
  