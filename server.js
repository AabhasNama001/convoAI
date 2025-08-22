const http = require("http");
const app = require("./src/app");
const connectToDB = require("./src/db/db");
const setupSocketServer = require("./src/socket/socket.server");

const httpServer = http.createServer(app);

// Setup Socket.IO
setupSocketServer(httpServer);

// Connect to DB
connectToDB();

// Use Render's dynamic port
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
