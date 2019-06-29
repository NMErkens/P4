const express = require('express')
const router = express.Router()
const AppartmentsController = require('../controllers/appartments.controller')
const AuthController = require('../controllers/authentication.controller')

// Lijst van appartementen
router.post('/', AuthController.validateToken, AppartmentsController.createAppartments)
router.get('/', AuthController.validateToken, AppartmentsController.getAllAppartments)
router.get('/:appartmentsId', AuthController.validateToken, AppartmentsController.getAppartmentById)
router.delete('/:appartmentsId', AuthController.validateToken, AppartmentsController.deleteAppartmentById)
router.put('/:appartmentsId', AuthController.validateToken, AppartmentsController.updateAppartments)

router.get('/:appartmentsId/reservations', AuthController.validateToken, AppartmentsController.getReservation)
router.get('/:appartmentsId/reservations/:reservationsId', AuthController.validateToken, AppartmentsController.getReservationById)
router.post('/:appartmentsId/reservations', AuthController.validateToken, AppartmentsController.createReservation)
router.put('/:appartmentsId/reservations/:reservationsId', AuthController.validateToken, AppartmentsController.updateReservation)
router.delete('/:appartmentsId/reservations/:reservationsId', AuthController.validateToken, AppartmentsController.deleteReservationById)
module.exports = router