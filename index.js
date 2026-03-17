import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { app } from "./app.js";
import { Server } from "socket.io";
import { orderHandler } from "./controllers/order.js";

const port = process.env.PORT || 8000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTENDS?.split(",") || ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  socket.emit("connected", { message : `${socket.id} - connected` });
  orderHandler(io, socket)
});

server.listen(port, () => console.log(`⚙️ Server is running at port: ${port}`));