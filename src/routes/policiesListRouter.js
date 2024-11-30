const express = require('express');
const policiesListRouter = express.Router();
const policiesListController = require('../controllers/policiesListController');
const validate = require("../middlewares/validateMiddleware");
const { policiesListSchema } = require('../validators/policiesListValidators');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/policies-doc')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.');
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension[extension.length - 1])
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fieldSize: 1024 * 1024 * 20
    }
})


policiesListRouter.route('/add').post(upload.single('policiesDoc'), validate(policiesListSchema), policiesListController.addPoliciesList);
policiesListRouter.route('/all').get(policiesListController.getPoliciesList);
policiesListRouter.route('/delete/:id').delete(policiesListController.delPoliciesList);
policiesListRouter.route('/update/:id').put(upload.single('policiesDoc'), validate(policiesListSchema), policiesListController.editPoliciesList);

module.exports = policiesListRouter;
