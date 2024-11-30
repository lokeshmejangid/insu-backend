const express = require('express');
const policiesListRouter = express.Router();
const policiesListController = require('../controllers/policiesListController');
const validate = require("../middlewares/validateMiddleware");
const { policiesListSchema } = require('../validators/policiesListValidators');

policiesListRouter.route('/add').post(validate(policiesListSchema), policiesListController.addPoliciesList);
policiesListRouter.route('/all').get(policiesListController.getPoliciesList);
policiesListRouter.route('/delete/:id').delete(policiesListController.delPoliciesList);
policiesListRouter.route('/update/:id').put(validate(policiesListSchema), policiesListController.editPoliciesList);

module.exports = policiesListRouter;
