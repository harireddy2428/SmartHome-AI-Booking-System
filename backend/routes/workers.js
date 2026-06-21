const router = require('express').Router();
const { getAllWorkers, getWorkerById, getWorkerProfile, updateWorkerProfile } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllWorkers);
router.get('/profile', protect, authorize('worker'), getWorkerProfile);
router.put('/profile', protect, authorize('worker'), updateWorkerProfile);
router.get('/:id', getWorkerById);

module.exports = router;
