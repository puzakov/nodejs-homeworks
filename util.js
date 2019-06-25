const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./storage.json");
exports.lowdb = low(adapter);
