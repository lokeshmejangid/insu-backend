const express = require('express');
const insuranceRouter = express.Router();
const insuranceController = require('../controllers/insuranceController');
const validate = require("../middlewares/validateMiddleware");
const { insuranceSchema } = require('../validators/insuranceValidators');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/insurance-document')
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
        fieldSize: 1024 * 1024 * 10
    }
})


insuranceRouter.route('/add').post(upload.single('document'), validate(insuranceSchema), insuranceController.addInsurance);
insuranceRouter.route('/all').get(insuranceController.getInsurance);
insuranceRouter.route('/delete/:id').delete(insuranceController.delInsurance);
insuranceRouter.route('/update/:id').put(upload.single('document'), validate(insuranceSchema), insuranceController.editInsurance);

module.exports = insuranceRouter;
