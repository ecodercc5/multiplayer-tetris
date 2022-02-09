import dotenv from "dotenv";

// load env variables
dotenv.config();

import express from "express";
import { Server } from "socket.io";
import http from "http";
import { api } from "./api/index";
import cors from "cors";
import { connectToRedis, redisClient } from "./redis";
import { registerUserHandlers } from "./web-sockets/user";
import { registerGameHandler } from "./web-sockets/game";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  const app = express();

  // set up middleware
  app.use(cors());
  app.use(express.json());

  // create http server
  const httpServer = http.createServer(app);

  // create socket io server -> enable cors
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // client url
      credentials: true, // enable credentials
    },
  });

  // connect to redis client
  await connectToRedis(redisClient);

  app.get("/", (req, res) => {
    console.log("Yo");

    res.send("Yo");
  });

  app.use("/api", api);

  // listen for connection event
  io.on("connection", (socket) => {
    console.log("on connection");
    console.log(socket.id);

    // set up listeners on socket
    socket.on("hello", () => {
      console.log("[hello]");

      socket.emit("hello-response");
    });

    registerUserHandlers(io, socket);
    registerGameHandler(io, socket);
  });

  // do not use app here, use httpServer
  httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

startServer();

// adding user
// removing user
// challenging another user
