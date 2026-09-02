const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const claimController = require('../controllers/claimController');

// All claim endpoints require verified authentication
router.use(authMiddleware);

// POST /api/claim/:id/claim
router.post('/:id/claim', claimController.submitClaim);

module.exports = router;
