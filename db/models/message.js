const mongoose = require("mongoose");
const DateTime = require("luxon");

const messageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxLength: 200,
    },
  },
  { timestamps: true }
);

messageSchema.virtual("url").get(function () {
  return `/messages/${this.id}`;
});

messageSchema.virtual("formatted_timestamp").get(function () {
  return DateTime.fromISO(this.createdAt).toFormat("ff");
});

module.exports = mongoose.model("Message", messageSchema);
