const express = require('express');
const transactionsRouter = express.Router();
const transactionsController = require('../controllers/transactionsController');

transactionsRouter.route('/all').get(transactionsController.getTransactions);

module.exports = transactionsRouter;
