const router = require('express').Router();
const { createReview, getWorkerReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createReview);
router.get('/worker/:workerId', getWorkerReviews);

module.exports = router;
