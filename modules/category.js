var mongoose = require("mongoose");
const { restart } = require("nodemon");
var Item = require("../modules/item");

var Schema = mongoose.Schema;
var CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        password: { type: String, required: true },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Virtual for book's URL
CategorySchema.virtual("url").get(function () {
    return "/category/" + this._id;
});

//Export model
module.exports = mongoose.model("Category", CategorySchema);
