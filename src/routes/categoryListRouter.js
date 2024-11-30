const express = require('express');
const categoryListRouter = express.Router();
const categoryListController = require('../controllers/categoryListController');
const validate = require("../middlewares/validateMiddleware");
const { categoryListSchema } = require('../validators/categoryListValidators');


categoryListRouter.route('/add').post(validate(categoryListSchema), categoryListController.addCategoryList);
categoryListRouter.route('/all').get(categoryListController.getCategoryList);
categoryListRouter.route('/delete/:id').delete(categoryListController.delCategoryList);
categoryListRouter.route('/update/:id').put(validate(categoryListSchema), categoryListController.editCategoryList);

module.exports = categoryListRouter;