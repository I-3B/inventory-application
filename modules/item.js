var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: { type: String, minLength: 1, maxLength: 200, required: true },
        password: { type: String, minLength: 1, maxLength: 8, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Virtual for book's URL
ItemSchema.virtual("url").get(function () {
    return "/item/" + this._id;
});

//Export model
module.exports = mongoose.model("Item", ItemSchema);
