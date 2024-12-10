const express = require('express');
const notificationRouter = express.Router();
const notificationController = require('../controllers/notificationsController');

notificationRouter.route('/all').get(notificationController.getNotifications);

module.exports = notificationRouter;
