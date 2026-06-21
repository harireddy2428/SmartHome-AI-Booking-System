const Worker = require('../models/Worker');
const User = require('../models/User');

const getAllWorkers = async (req, res) => {
  try {
    const { category, city, availability } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (city) filter.city = new RegExp(city, 'i');
    if (availability) filter.availability = availability === 'true';

    const workers = await Worker.find(filter)
      .populate('userId', 'name email phone profileImage')
      .sort({ rating: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'name email phone address city profileImage');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone address city');
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    ).populate('userId', 'name email phone');
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllWorkers, getWorkerById, getWorkerProfile, updateWorkerProfile };
