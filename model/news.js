const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    id: Schema.Types.ObjectId,
    date: Date,
    text: String,
    theme: String,
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { versionKey: false }
);

module.exports = model("News", schema, "news");
