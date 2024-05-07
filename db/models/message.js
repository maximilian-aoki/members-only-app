const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const messageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    text: {
      type: String,
      required: true,
      maxLength: 200,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.virtual("url").get(function () {
  return `/messages/${this.id}`;
});

messageSchema.virtual("formattedTimestamp").get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat("ff");
});

module.exports = mongoose.model("Message", messageSchema);
