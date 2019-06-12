const http = require("http");
const uuidv4 = require("uuid/v4");

const { TIMEOUT, INTERVAL } = process.env;
console.log({ TIMEOUT, INTERVAL });

if (!TIMEOUT || !INTERVAL) {
  console.log("TIMEOUT & INTEVAL are required env variables");
  process.exit(1);
}

const port = 8080;

let isLogging = false;
let lastRequestId = null;

setInterval(() => {
  if (isLogging) {
    const date = new Date();
    console.log(date.toUTCString(), lastRequestId);
  }
}, INTERVAL * 1000);

const requestHandler = (request, response) => {
  if (!isLogging) isLogging = true;

  const uuid = uuidv4();
  lastRequestId = uuid;

  setTimeout(() => {
    const date = new Date();
    if (lastRequestId === uuid) {
      isLogging = false;
    }
    response.end(date.toUTCString());
  }, TIMEOUT * 1000);
};

const server = http.createServer(requestHandler);
server.listen(port, err => {
  if (err) {
    return console.log("some error", err);
  }
  console.log(`listening port ${port}`);
});
