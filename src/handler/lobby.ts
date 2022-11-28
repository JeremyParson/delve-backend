import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import UserLobbies from "../data/user lobbies";
import Lobbies from "../data/lobbies";
import GameUsers from "../data/game users";
import Games from "../data/games";
import Users from "../data/user";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

type Payload = {
  userId: number;
  lobbyId: number;
};

type MessagePayload = {
  userId: number;
  lobbyId: number;
  message: string;
};

type StartGamePayload = {
  userId: number;
  lobbyId: number;
};

export default function registerLobbyHandlers(io: Server, socket: Socket) {
  const leaveAllLobbies = (reason: any) => {
    console.log("A user disconnected...");
    socket.rooms.forEach(async (room) => {
      if (socket.id == room) return;
      console.log("leaving", room);
      await prisma.userLobbies.deleteMany({
        where: {
          userId: socket.user.id,
          lobbyId: Number(room),
        },
      });
    });
  };

  const leaveLobby = async (payload: Payload) => {
    const strLobbyId = String(payload.lobbyId);
    if (socket.rooms.has(strLobbyId)) {
      await prisma.userLobbies.deleteMany({
        where: {
          userId: socket.user.id,
          lobbyId: payload.lobbyId,
        },
      });
      socket.rooms.delete(strLobbyId);
      io.to(strLobbyId).emit("lobby:user_left");
    }
  };

  const joinLobby = async (payload: Payload) => {
    const lobby = await Lobbies.detail({
      id: Number(payload.lobbyId),
    });
    if (!lobby) return;

    const userLobby = await UserLobbies.create({
      users: {
        connect: {
          id: socket.user.id
        }
      },
      lobbies: {
        connect: {
          id: lobby.id
        }
      }
    })

    const strLobbyId = String(payload.lobbyId);
    socket.join(strLobbyId);
    io.to(strLobbyId).emit("lobby:user_joined", {userLobby});
  };

  const sendMessage = async (payload: MessagePayload) => {
    const userLobby = await UserLobbies.detail({
      userId: socket.user.id,
      lobbyId: payload.lobbyId,
    });
    if (!userLobby) return;
    const strLobbyId = String(payload.lobbyId);
    io.to(strLobbyId).emit("lobby:deliver_message", payload);
  };

  const startGame = async (payload: StartGamePayload) => {
    const userLobbies = await UserLobbies.index({
      lobbyId: payload.lobbyId,
    });

    const game = await Games.create({});

    for (let userLobby of userLobbies) {
      const gameUser = await GameUsers.create({
        users: {
          connect: {
            id: userLobby.userId,
          },
        },
        games: {
          connect: {
            id: game.id,
          },
        },
      });
    }
    const strLobbyId = String(payload.lobbyId);
    io.to(strLobbyId).emit("lobby:game_starting", {
      gameId: game.id,
    });
  };

  io.use(async (socket, next) => {
    const isAuthentic = jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET
    );
    if (isAuthentic) {
      next();
    } else {
      next(new Error("Authentication failed."));
    }
  });

  socket.on("lobby:join", joinLobby);
  socket.on("lobby:leave", leaveLobby);
  socket.on("disconnecting", leaveAllLobbies);
  socket.on("lobby:message", sendMessage);
  socket.on("lobby:start_game", startGame);
}
