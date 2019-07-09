const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    id: Schema.Types.ObjectId,
    chat: {
      C: Boolean,
      D: Boolean,
      R: Boolean,
      U: Boolean
    },
    news: {
      C: Boolean,
      D: Boolean,
      R: Boolean,
      U: Boolean
    },
    setting: {
      C: Boolean,
      D: Boolean,
      R: Boolean,
      U: Boolean
    }
  },
  { versionKey: false }
);

module.exports = model("Permission", schema, "permission");
