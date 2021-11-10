const Category = require("../modules/category");
var { body, validationResult } = require("express-validator");
var async = require("async");
const Item = require("../modules/item");
exports.listAllCategories = (req, res, next) => {
    Category.find()
        .sort("name")
        .exec((err, result) => {
            if (err) return next(err);
            res.render("categories", {
                title: "All categories",
                categories: result,
            });
        });
};

exports.createCategoryGet = (req, res, next) => {
    res.render("createCategory", {
        title: "Add a category",
        errors: [],
        category: {},
    });
};
exports.createCategoryPost = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("name cannot be blank or more than 50 character")
        .escape(),
    body("password")
        .isLength({ min: 1, max: 8 })
        .withMessage("password cannot be empty and more than 8 characters")
        .escape(),
    (req, res, next) => {
        var errors = validationResult(req);
        var category = new Category({
            name: req.body.name,
            password: req.body.password,
        });
        if (!errors.isEmpty()) {
            res.render("createCategory", {
                title: "Add a category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            Category.findOne({ name: req.body.name }).exec((err, foundName) => {
                if (err) return next(err);
                if (foundName) {
                    res.render("createCategory", {
                        title: "Add a Category",
                        category: category,
                        errors: ["Category is already there"],
                    });
                } else {
                    category.save((err, result) => {
                        if (err) return next(err);
                        res.redirect(result.url);
                    });
                }
            });
        }
    },
];

exports.categoryGet = (req, res, next) => {
    async.parallel(
        {
            category: (cb) => {
                Category.findOne({ _id: req.params.id }).exec((err, res) => {
                    if (err) cb(err);
                    cb(null, res);
                });
            },
            items: (cb) => {
                Item.find({ category: req.params.id })
                    .sort("name")
                    .exec((err, res) => {
                        if (err) return cb(err);
                        cb(null, res);
                    });
            },
        },
        (err, result) => {
            if (err) return next(err);
            res.render("category", {
                title: "Category: " + result.category.name,
                category: result.category,
                items: result.items,
            });
        }
    );
};

exports.updateCategoryGet = (req, res, next) => {
    Category.findOne({ _id: req.params.id }).exec((err, result) => {
        if (err) next(err);
        res.render("updateCategory", {
            title: `Updating \"${result.name}\"`,
            category: result,
            errors: [],
        });
    });
};
exports.updateCategoryPost = [
    body("name")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("name cannot be blank or more than 50 character")
        .escape(),
    body("password").escape(),
    (req, res, next) => {
        var errors = validationResult(req);
        Category.findOne({ _id: req.params.id }).exec((err, result) => {
            if (err) next(err);

            if (!errors.isEmpty()) {
                res.render("updateCategory", {
                    title: "Editing " + result.name,
                    category: result,
                    errors: errors.array(),
                });
            } else if (req.body.password !== result.password) {
                res.render("updateCategory", {
                    title: "Editing " + result.name,
                    category: result,
                    errors: ["Wrong password"],
                });
            } else {
                Category.findByIdAndUpdate(
                    req.params.id,
                    { name: req.body.name },
                    (err, result) => {
                        if (err) return next(err);
                        else res.redirect(result.url);
                    }
                );
            }
        });
    },
];

exports.deleteCategoryGet = (req, res, next) => {
    Category.findOne({ _id: req.params.id }).exec((err, result) => {
        if (err) next(err);
        res.render("deleteCategory", {
            title: `Deleting \"${result.name}\" and all its items`,
            url: result.url,
            errors: [],
        });
    });
};
exports.deleteCategoryPost = [
    body("password").escape(),
    (req, res, next) => {
        Category.findOne({ _id: req.params.id }).exec((err, result) => {
            if (err) next(err);
            if (req.body.password !== result.password) {
                res.render("deleteCategory", {
                    title: `Deleting \"${result.name}\"`,
                    url: result.url,
                    errors: ["Wrong password"],
                });
            } else {
                Item.deleteMany({
                    category: req.params.id,
                }).exec((err, result) => {
                    if (err) next(err);
                    Category.findByIdAndDelete(req.params.id, (err) => {
                        if (err) return next(err);
                        res.redirect("/category");
                    });
                });
            }
        });
    },
];
