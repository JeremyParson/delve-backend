import { Server, Socket } from "socket.io";
import http from "http";
import registerLobbyHandlers from "./handler/lobby";
import registerGameHandlers from "./handler/game";
import { Application } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function (app: Application): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  const server = http.createServer(app);
  let io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const onConnection = (socket: Socket) => {
    registerLobbyHandlers(io, socket);
    registerGameHandlers(io, socket);
  };

  io.on("connection", onConnection);
  return io;
}
