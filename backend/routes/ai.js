const router = require('express').Router();
const { getRecommendations, chatAssistant } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/recommend', protect, getRecommendations);
router.post('/chat', protect, chatAssistant);

module.exports = router;
