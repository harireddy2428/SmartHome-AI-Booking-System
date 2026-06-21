const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, customerId: req.user._id });
    await booking.populate(['workerId', 'serviceId']);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate({ path: 'workerId', populate: { path: 'userId', select: 'name phone' } })
      .populate('serviceId', 'title category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWorkerBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const bookings = await Booking.find({ workerId: worker._id })
      .populate('customerId', 'name phone address city')
      .populate('serviceId', 'title category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status === 'completed') {
      await Worker.findByIdAndUpdate(booking.workerId, {
        $inc: { completedJobs: 1, totalEarnings: booking.totalAmount || 0 }
      });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customerId: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'name email')
      .populate({ path: 'workerId', populate: { path: 'userId', select: 'name email' } })
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getWorkerBookings, updateBookingStatus, cancelBooking, getAllBookings };
