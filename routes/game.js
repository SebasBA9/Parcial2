const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game.controller');

// Ruta para iniciar un nuevo juego
router.post('/new-game', gameController.initiateGame);

// Ruta para continuar jugando en un juego existente
router.post('/play', gameController.continueGame);

// Ruta para obtener la última letra del juego actual
router.get('/get/:gameId', gameController.fetchLastCharacter);

module.exports = router;
