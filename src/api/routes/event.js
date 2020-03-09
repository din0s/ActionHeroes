const express = require('express');
const router = express.Router();

const EventController = require('../controllers/EventController');

router.post('/create_event', EventController.createEvent);

router.delete('/delete_event', EventController.deleteEvent);

router.get('/info', EventController.showInfo);

module.exports = router;