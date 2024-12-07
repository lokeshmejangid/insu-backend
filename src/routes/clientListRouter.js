const express = require("express");
const clientListRouter = express.Router();
const clientListController = require("../controllers/clientListController");
const validate = require("../middlewares/validateMiddleware");
const { clientListSchema } = require("../validators/clientListValidators");

clientListRouter.route("/add").post(validate(clientListSchema), clientListController.addClientList);
clientListRouter.route("/all").get(clientListController.getClientList);
clientListRouter.route("/delete/:id").delete(clientListController.delClientList);
clientListRouter.route("/update/:id").put(validate(clientListSchema), clientListController.editClientList);

module.exports = clientListRouter;
