const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 15,
    },
    lastName: {
      type: String,
      default: "",
      maxLength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    password: {
      type: String,
      required: true,
    },
    membership_status: {
      type: String,
      default: "visitor",
      enum: ["visitor", "member", "admin"],
    },
  },
  { timestamps: true }
);

userSchema.virtual("url").get(function () {
  return `/users/${this.id}`;
});

userSchema.virtual("fullName").get(function () {
  return this.firstName + (this.lastName ? ` ${this.lastName}` : "");
});

messageSchema.virtual("formatted_timestamp").get(function () {
  return DateTime.fromISO(this.createdAt).toFormat("ff");
});

module.exports = mongoose.model("User", userSchema);
