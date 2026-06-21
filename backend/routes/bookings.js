const router = require('express').Router();
const { createBooking, getMyBookings, getWorkerBookings, updateBookingStatus, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/worker', protect, authorize('worker'), getWorkerBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('worker'), updateBookingStatus);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);

module.exports = router;
