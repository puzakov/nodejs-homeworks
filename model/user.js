const { Schema, model } = require("mongoose");
const bCrypt = require("bcryptjs");

const schema = new Schema(
  {
    access_token: String,
    id: Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
      unique: true
    },
    surName: String,
    firstName: String,
    image: String,
    middleName: String,
    password: {
      type: String,
      required: true
    },
    permission: { type: Schema.Types.ObjectId, ref: "Permission" },
  },
  { versionKey: false }
);

schema.methods.setPassword = function(password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

schema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.password);
};

module.exports = model("User", schema, "user");
