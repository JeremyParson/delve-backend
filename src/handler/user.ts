import { Socket, Server } from "socket.io";
const jwt = require("jsonwebtoken");
import Users from "../data/user";

export default function (io: Server) {
  io.on("connect", async (socket) => {
    const { id } = jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET
    );
    const user = await Users.detail({
      id,
    });
    socket.user = user;
    console.log("socket user registered", user);
  });
}
