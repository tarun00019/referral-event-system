const express = require('express');
const router = express.Router();
const authMiddleware = require('../app/middlewares/authMiddleware');
const upload = require('../app/middlewares/uploadMiddleware');
const EventController = require('../app/controllers/EventController');

router.post(
    '/',
    authMiddleware,
    upload.array('images', 3),
    EventController.createEvent
);

router.put('/:id', authMiddleware, EventController.updateEvent);
router.delete('/:id', authMiddleware, EventController.deleteEvent);

router.get('/', EventController.getAllEvents); // Public
router.get('/:slug', EventController.getEventBySlug); // Public

module.exports = router;