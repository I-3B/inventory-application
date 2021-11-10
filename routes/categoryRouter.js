var express = require("express");
var router = express.Router();
var categoryController = require("../controllers/categoryController");

router.get("/", categoryController.listAllCategories);

router.get("/create", categoryController.createCategoryGet);
// router.post("/create", categoryController.createCategoryPost)
router.post("/create", categoryController.createCategoryPost);

router.get("/:id", categoryController.categoryGet);

router.get("/:id/update", categoryController.updateCategoryGet);
router.post("/:id/update", categoryController.updateCategoryPost);

router.get("/:id/delete", categoryController.deleteCategoryGet);
router.post("/:id/delete", categoryController.deleteCategoryPost);

module.exports = router;
