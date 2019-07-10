const IO = require("koa-socket-2");
const io = new IO();

const clients = {};

io.on("connection", (ctx, data) => {
  console.log("connected", data);
  const { socket } = ctx;
  const {
    id,
    request: {
      headers: { username }
    }
  } = socket;
  if (!username) return;

  clients[id] = { username, id };
  socket.join(id);
  socket.emit("all users", clients);
  socket.broadcast.emit("new user", { username, id });
  console.log("clients", clients);
});

io.on("disconnect", (ctx, data) => {
  const { socket } = ctx;
  const { id } = socket;
  console.log("disconnected", id);
  socket.leave(id);
  socket.broadcast.emit("delete user", id);
  delete clients[id];
});

io.on("chat message", (ctx, data) => {
  const { acknowledge, socket } = ctx;
  const { id } = socket;

  socket.broadcast.to(acknowledge).emit("chat message", data, id);
});

module.exports = io;
