const express = require('express')
const router = express.Router()
const ReservationsController = require('../controllers/reservations.controller')
const AuthController = require('../controllers/authentication.controller')

// Lijst van appartementen
router.get('/', AuthController.validateToken, ReservationsController.getAllReservations)


module.exports = router