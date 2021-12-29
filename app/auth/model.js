const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      minlength: [3, "User name must have at least 3 characters"],
      maxlength: [255, "User name cannot be more than 255 characters"],
      required: [true, "Please provide user name"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      maxlength: [255, "Email cannot be more than 255 characters"],
      required: [true, "Please provide email"],
    },
    password: {
      type: String,
      maxlength: [255, "Password cannot be more than 255 characters"],
      required: [true, "Please provide password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

UserSchema.path("email").validate(
  function (value) {
    // email regex
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} has to be valid email`
);

UserSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });
      return !count;
    } catch (error) {
      throw err;
    }
  },
  (attr) => `${attr.value} already exist`
);

UserSchema.pre("save", function (next) {
  const HASH_ROUND = 10;
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

UserSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = mongoose.model("User", UserSchema);
