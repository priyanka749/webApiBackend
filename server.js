// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// // ✅ Initialize Express App
// const app = express();
// const server = http.createServer(app);

// // ✅ Setup CORS
// app.use(cors());
// app.use(express.json());

// // ✅ Initialize Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // ✅ Allow frontend to connect
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId); // ✅ User joins their notification room
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// // ✅ Export `io` for use in controllers
// module.exports = { app, server, io };

// // ✅ Start Server
// const PORT = 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });
