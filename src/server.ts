import app from "./app";
import { Server, Socket } from "socket.io";
import http from "http";
import registerLobbyHandlers from "./handler/lobby";
import registerGameHandlers from "./handler/game";
import router from "./routers";

const server = http.createServer(app);
server.listen(process.env.IO_PORT);
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

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}.`);
});
