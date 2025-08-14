const { Server } = require("socket.io");

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("A User connected");

    socket.on("ai-message", (message) => {
      console.log(message);
    });

    socket.on("disconnect", () => {
      console.log("A User disconnected");
    });
  });
}

module.exports = setupSocketServer;
