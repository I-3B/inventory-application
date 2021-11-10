var express = require("express");
var router = express.Router();
var itemController = require("../controllers/itemController");
router.get("/", itemController.listAllItems);

router.get("/create", itemController.createItemGet);
router.post("/create", itemController.createItemPost);

router.get("/:id", itemController.itemsGet);

router.get("/:id/update", itemController.updateItemGet);
router.post("/:id/update", itemController.updateItemPost);

router.get("/:id/delete", itemController.deleteItemGet);
router.post("/:id/delete", itemController.deleteItemPost);

module.exports = router;
