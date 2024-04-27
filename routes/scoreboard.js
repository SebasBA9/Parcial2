const express = require('express');
const router = express.Router();

const scoreboardController = require('../controllers/scoreboard.controller');

router.post('/new-scoreboard', scoreboardController.createScoreboard);
router.post('/addUser', scoreboardController.addUserToScoreboard);
router.get('/getTopPlayers', scoreboardController.getTopPlayers)

module.exports = router;
