var Item = require("./modules/item");
var Category = require("./modules/category");
var async = require("async");
var mongoose = require("mongoose");
require("dotenv").config();
//Set up default mongoose connection
var mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
var categories = [];
var items = [];
function createCategory(categoryName, categoryPassword, cb) {
    let category = new Category({
        name: categoryName,
        password: categoryPassword,
    });
    category.save((err) => {
        if (err) cb(err, null);
        categories.push(category);
        cb(null, category);
    });
}
function findCategory(categoryName) {
    return categories.find((category) => {
        return categoryName === category.name;
    })._id;
}
function createItem(
    itemName,
    itemStock,
    itemPrice,
    itemCategory,
    itemPassword,
    cb
) {
    let item = new Item({
        name: itemName,
        password: itemPassword,
        price: itemPrice,
        stock: itemStock,
        category: itemCategory,
    });
    item.save((err) => {
        if (err) cb(err, null);
        items.push(item);
        cb(null, item);
    });
}
function createAllCategories(cb) {
    async.parallel(
        [
            (cb) => {
                createCategory("CPU", process.env.ITEMS_PASSWORD, cb);
            },
            (cb) => {
                createCategory("GPU", process.env.ITEMS_PASSWORD, cb);
            },
            (cb) => {
                createCategory("Monitor", process.env.ITEMS_PASSWORD, cb);
            },
            (cb) => {
                createCategory("SSD", process.env.ITEMS_PASSWORD, cb);
            },
            (cb) => {
                createCategory("Keyboard", process.env.ITEMS_PASSWORD, cb);
            },
            (cb) => {
                createCategory("Mouse", process.env.ITEMS_PASSWORD, cb);
            },
        ],
        cb
    );
}
function createAllItems(cb) {
    async.parallel(
        [
            (cb) => {
                createItem(
                    "AMD Ryzen 9 5900X",
                    7,
                    649.99,
                    findCategory("CPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Intel Core i5-12600K",
                    30,
                    549.99,
                    findCategory("CPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Intel Core i7-10750H",
                    24,
                    459.99,
                    findCategory("CPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Intel Core i9-12900K",
                    12,
                    479.99,
                    findCategory("CPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Nvidia GeForce RTX 3090",
                    12,
                    1499.99,
                    findCategory("GPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Nvidia GeForce RTX 3070",
                    22,
                    499.99,
                    findCategory("GPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "AMD Radeon RX 6900 XT",
                    9,
                    999.99,
                    findCategory("GPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Nvidia GeForce RTX 3060 Ti",
                    26,
                    399.99,
                    findCategory("GPU"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "1BenQ PD3200U",
                    38,
                    1100,
                    findCategory("Monitor"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "LG UltraGear 38GN950",
                    38,
                    1049.99,
                    findCategory("Monitor"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Samsung 980 Pro 1TB",
                    108,
                    184.99,
                    findCategory("SSD"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "WD Black SN850 2TB",
                    68,
                    384.99,
                    findCategory("SSD"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Asus ROG Claymore II Wireless Keyboard",
                    48,
                    265.99,
                    findCategory("Keyboard"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Razer Pro Type Wireless Mechanical Keyboard",
                    44,
                    178.99,
                    findCategory("Keyboard"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Logitech MX Master 3",
                    74,
                    83.99,
                    findCategory("Mouse"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
            (cb) => {
                createItem(
                    "Microsoft Classic IntelliMouse",
                    54,
                    34.99,
                    findCategory("Mouse"),
                    process.env.ITEMS_PASSWORD,
                    cb
                );
            },
        ],
        cb
    );
}
async.series([createAllCategories, createAllItems], function (err) {
    if (err) {
        console.log("FINAL ERR: " + err);
    } else {
        console.log("Categories:\n" + categories);
        console.log("Items:\n", items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
