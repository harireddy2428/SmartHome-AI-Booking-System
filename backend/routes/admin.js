const router = require('express').Router();
const { getDashboard, getAllUsers, toggleUserStatus, deleteUser, getAllWorkersAdmin, verifyWorker, deleteWorker, updateBookingStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/workers', getAllWorkersAdmin);
router.put('/workers/:id/verify', verifyWorker);
router.delete('/workers/:id', deleteWorker);
router.put('/bookings/:id/status', updateBookingStatus);

module.exports = router;
