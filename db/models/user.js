const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      maxLength: 15,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
      maxLength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      minLength: 6,
      maxLength: 20,
    },
    membershipStatus: {
      type: String,
      default: "visitor",
      trim: true,
      lowercase: true,
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

userSchema.virtual("formattedTimestamp").get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat("ff");
});

module.exports = mongoose.model("User", userSchema);
