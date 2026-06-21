const Review = require('../models/Review');
const Worker = require('../models/Worker');

const createReview = async (req, res) => {
  try {
    const { workerId, bookingId, rating, review } = req.body;
    const exists = await Review.findOne({ bookingId });
    if (exists) return res.status(400).json({ message: 'Review already submitted' });

    const newReview = await Review.create({
      customerId: req.user._id, workerId, bookingId, rating, review
    });

    const reviews = await Review.find({ workerId });
    const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await Worker.findByIdAndUpdate(workerId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('customerId', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReview, getWorkerReviews };
