const express = require('express');
const insuranceRouter = express.Router();
const insuranceController = require('../controllers/insuranceController');
const validate = require("../middlewares/validateMiddleware");
const { insuranceSchema } = require('../validators/insuranceValidators');

insuranceRouter.route('/add').post(validate(insuranceSchema), insuranceController.addInsurance);
insuranceRouter.route('/all').get(insuranceController.getInsurance);
insuranceRouter.route('/delete/:id').delete(insuranceController.delInsurance);
insuranceRouter.route('/update/:id').put(validate(insuranceSchema), insuranceController.editInsurance);

module.exports = insuranceRouter;
