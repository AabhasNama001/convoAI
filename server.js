const http = require("http");
const app = require("./src/app");
const connectToDB = require("./src/db/db");
const setupSocketServer = require("./src/socket/socket.server");

const httpServer = http.createServer(app);

setupSocketServer(httpServer);
connectToDB();

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
