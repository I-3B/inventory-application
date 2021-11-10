var Item = require("../modules/item");
var Category = require("../modules/category");
var { body, validationResult } = require("express-validator");
var mongoose = require("mongoose");
exports.listAllItems = (req, res, next) => {
    Item.find()
        .populate("category")
        .sort("name")
        .exec((err, result) => {
            if (err) next(err);
            res.render("items", { title: "All items", items: result });
        });
};

exports.createItemGet = (req, res, next) => {
    Category.find()
        .sort("name")
        .exec((err, categories) => {
            if (err) next(err);
            res.render("createItem", {
                title: "Add an item",
                categories: categories ? categories : [],
                errors: [],
                item: {},
            });
        });
};
exports.createItemPost = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape()
        .withMessage("name cannot be blank or more than 100 character"),
    body("price").isFloat().withMessage("price most be a number"),
    body("stock").isInt().withMessage("in stocks count cannot be a decimal"),
    body("password")
        .isLength({ min: 1, max: 8 })
        .withMessage("password cannot be empty and more than 8 characters"),
    (req, res, next) => {
        var errors = validationResult(req);
        var item = new Item({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            password: req.body.password,
            category: mongoose.Types.ObjectId(req.body.category),
        });
        if (!errors.isEmpty()) {
            Category.find().exec((err, categories) => {
                if (err) next(err);
                res.render("createItem", {
                    title: "Add an item",
                    categories: categories ? categories : [],
                    item: item,
                    errors: errors.array(),
                });
            });
            return;
        } else {
            Item.findOne({ name: req.body.name }).exec((err, foundName) => {
                if (err) return next(err);
                if (foundName) {
                    Category.find().exec((err, categories) => {
                        if (err) next(err);
                        res.render("createItem", {
                            title: "Add an item",
                            categories: categories ? categories : [],
                            item: item,
                            errors: errors.array(),
                        });
                    });
                } else {
                    item.save((err, result) => {
                        if (err) return next(err);
                        res.redirect(result.url);
                    });
                }
            });
        }
    },
];

exports.itemsGet = (req, res, next) => {
    Item.findOne({ _id: req.params.id })
        .populate("category")
        .exec((err, item) => {
            if (err) next(err);
            res.render("item", { title: "item: " + item.name, item: item });
        });
};

exports.updateItemGet = (req, res, next) => {
    Item.findOne({ _id: req.params.id }).exec((err, result) => {
        if (err) next(err);
        res.render("updateItem", {
            title: "Updating item",
            item: result,
            errors: [],
            url: result.url,
        });
    });
};
exports.updateItemPost = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape()
        .withMessage("name cannot be blank or more than 100 character"),
    body("price")
        .isFloat({ min: 1 })
        .withMessage("price most be a number and cannot be less than 1"),
    body("stock")
        .isInt({ min: 1 })
        .withMessage(
            "in stocks count cannot be a decimal and cannot be less than 1"
        ),
    body("password").escape(),
    (req, res, next) => {
        var errors = validationResult(req);
        Item.findOne({ _id: req.params.id }).exec((err, item) => {
            if (err) next(err);
            if (!errors.isEmpty() || req.body.password !== item.password) {
                let errorsArr = [];
                if (!errors.isEmpty()) errorsArr = [...errors.array()];
                if (req.params.id !== item.password)
                    errorsArr = [...errorsArr, "Wrong password"];
                res.render("updateItem", {
                    title: "Updating Item",
                    item: req.body,
                    url: item.url,
                    errors: errorsArr,
                });
            } else {
                Item.findByIdAndUpdate(
                    item._id,
                    {
                        name: req.body.name,
                        price: req.body.price,
                        stock: req.body.stock,
                    },
                    (err, result) => {
                        if (err) return next(err);
                        res.redirect(result.url);
                    }
                );
            }
        });
    },
];

exports.deleteItemGet = (req, res, next) => {
    Item.findOne({ _id: req.params.id }).exec((err, result) => {
        if (err) next(err);
        res.render("deleteItem", {
            title: `Deleting \"${result.name}\"`,
            url: result.url,
            errors: [],
        });
    });
};
exports.deleteItemPost = [
    body("password").escape(),
    (req, res, next) => {
        Item.findOne({ _id: req.params.id }).exec((err, result) => {
            if (err) next(err);
            if (req.body.password !== result.password) {
                res.render("deleteItem", {
                    title: `Deleting \"${result.name}\"`,
                    url: result.url,
                    errors: ["Wrong password"],
                });
            } else {
                Item.findByIdAndDelete(result._id).exec((err, result) => {
                    if (err) next(err);
                    res.redirect("/category/" + result.category);
                });
            }
        });
    },
];
