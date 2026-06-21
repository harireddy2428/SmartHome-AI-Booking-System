const User = require('../models/User');
const Worker = require('../models/Worker');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  const { name, email, phone, password, address, city, role, category, experience, skills, hourlyRate, adminKey } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    if (role === 'admin') {
      if (adminKey !== process.env.ADMIN_SECRET_KEY)
        return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    const user = await User.create({ name, email, phone, password, address, city, role: role || 'customer' });

    if (role === 'worker') {
      await Worker.create({
        userId: user._id,
        category: category || '',
        skills: skills || [],
        experience: experience || 0,
        location: address || '',
        city: city || '',
        hourlyRate: hourlyRate || 0,
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isActive)
      return res.status(403).json({ message: 'Account suspended' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone, address, city } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2)
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  if (phone && !/^[0-9]{10}$/.test(phone))
    return res.status(400).json({ message: 'Phone must be a 10-digit number' });
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), phone, address, city },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
