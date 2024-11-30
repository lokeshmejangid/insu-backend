const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../controllers/dashboardController');

dashboardRouter.route('/all').get(dashboardController.getDashboard);

module.exports = dashboardRouter;
