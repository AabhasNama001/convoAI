const { Server } = require("socket.io");
const aiService = require("../services/ai.service");

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("A User connected");

    socket.on("ai-message", async (message) => {
      const result = await aiService.generateContent(message);
      socket.emit("ai-message-response", result);
    });

    socket.on("disconnect", () => {
      console.log("A User disconnected");
    });
  });
}

module.exports = setupSocketServer;
