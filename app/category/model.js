const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Category name must have at least 3 characters"],
    maxlength: [20, "Category name cannot be more than 20 characters"],
    required: [true, "Please provide category name"],
  },
});

module.exports = mongoose.model("Category", CategorySchema);
