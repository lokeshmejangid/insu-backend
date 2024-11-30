const express = require('express');
const clientListRouter = express.Router();
const clientListController = require('../controllers/clientListController');
const validate = require("../middlewares/validateMiddleware");
const { clientListSchema } = require('../validators/clientListValidators');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/client-image')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.');
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension[extension.length - 1])
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
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


clientListRouter.route('/add').post(upload.single('image'), validate(clientListSchema), clientListController.addClientList);
clientListRouter.route('/all').get(clientListController.getClientList);
clientListRouter.route('/delete/:id').delete(clientListController.delClientList);
clientListRouter.route('/update/:id').put(upload.single('image'), validate(clientListSchema), clientListController.editClientList);

module.exports = clientListRouter;
