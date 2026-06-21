const router = require('express').Router();
const { getServices, createService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.post('/', protect, authorize('admin'), createService);

module.exports = router;
