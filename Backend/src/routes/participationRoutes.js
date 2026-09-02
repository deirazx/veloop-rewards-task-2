const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const participationController = require('../controllers/participationController');

// All participation routes require authenticated user context
router.use(authMiddleware);

// POST /api/participation/join
router.post('/join', participationController.joinGiveaway);

// GET /api/participation/:id/my-status
router.get('/:id/my-status', participationController.getMyStatus);

module.exports = router;
