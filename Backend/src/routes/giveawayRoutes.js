const express = require('express');
const router = express.Router();
const giveawayController = require('../controllers/giveawayController');

// GET /api/giveaways/current
router.get('/current', giveawayController.getCurrentGiveaways);

// GET /api/giveaways/previous/winners (Must be declared before :id to prevent collision)
router.get('/previous/winners', giveawayController.getPreviousWinners);

// GET /api/giveaways/:id/winners
router.get('/:id/winners', giveawayController.getGiveawayWinners);

module.exports = router;
