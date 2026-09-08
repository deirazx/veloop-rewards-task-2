const express = require('express');
const router = express.Router();
const giveawayController = require('../controllers/giveawayController');

// GET /api/giveaways/current
router.get('/current', giveawayController.getCurrentGiveaways);

// GET /api/giveaways/previous and /api/giveaways/previous/winners
router.get('/previous', giveawayController.getPreviousWinners);
router.get('/previous/winners', giveawayController.getPreviousWinners);

// GET /api/giveaways/winners
router.get('/winners', giveawayController.getAllWinners);

// GET /api/giveaways/:id/winners
router.get('/:id/winners', giveawayController.getGiveawayWinners);

module.exports = router;

