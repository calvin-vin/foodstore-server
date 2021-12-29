const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Tag name must have at least 3 characters"],
    maxlength: [20, "Tag name cannot be more than 255 characters"],
    required: [true, "Please provide tag name"],
  },
});

module.exports = mongoose.model("Tag", TagSchema);
