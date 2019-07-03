const { Schema, model } = require("mongoose");

const schema = new Schema({
  access_token: String,
  id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  permissionId: Number,
  surName: String,
  firstName: String,
  image: String,
  middleName: String,
  password: String,
  permission: {
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
  }
});

module.exports = model("User", schema, "user");
