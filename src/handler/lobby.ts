import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import UserLobbies from "../data/user lobbies";
import GameUsers from "../data/game users";
import Games from "../data/games";

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
  const leaveAllLobbies = () => {
    socket.rooms.forEach((room) => {
      if (socket.id != room) {
        socket.leave(room);
        socket.to(room).emit("lobby:user_left");
      }
    });
  };

  const leaveLobby = async (payload: Payload) => {
    const strLobbyId = String(payload.lobbyId);
    const strUserId = String(payload.userId);
    if (socket.rooms.has(strLobbyId)) {
      await prisma.userLobbies.deleteMany({
        where: {
          userId: payload.userId,
          lobbyId: payload.lobbyId,
        },
      });
      socket.rooms.delete(strLobbyId);
      socket.to(strUserId).emit("lobby:user_left");
    }
  };

  const joinLobby = async (payload: Payload) => {
    const lobby = await prisma.lobbies.findFirst({
      where: {
        id: Number(payload.lobbyId),
      },
    });

    prisma.users.update({
      where: {
        id: Number(payload.userId),
      },
      data: {
        userLobbies: {
          create: {
            lobbyId: Number(payload.lobbyId),
          },
        },
      },
    });

    if (!lobby) return;
    const strLobbyId = String(payload.lobbyId);
    socket.to(strLobbyId).emit("lobby:user_joined");
    socket.join(strLobbyId);
  };

  const sendMessage = (payload: MessagePayload) => {
    const userLobby = prisma.userLobbies.findFirst({
      where: {
        userId: payload.userId,
        lobbyId: payload.lobbyId,
      },
    });
    if (!userLobby) return;
    const strLobbyId = String(payload.lobbyId);
    socket.to(strLobbyId).emit("lobby:deliver_message", payload);
  };

  const startGame = async (payload: StartGamePayload) => {
    const userLobbies = await UserLobbies.index({
      lobbyId: payload.lobbyId,
    });

    const game = await Games.create({});

    for (let user of userLobbies) {
      await GameUsers.create({
        users: {
          connect: {
            id: user.id,
          },
        },
        games: {
          connect: {
            id: game.id,
          },
        },
      });
    };

    const strLobbyId = String(payload.lobbyId);
    socket.to(strLobbyId).emit("lobby:game_starting", {
      gameId: game.id
    });
  };

  socket.on("lobby:join", joinLobby);
  socket.on("lobby:leave", leaveLobby);
  socket.on("disconnecting", leaveAllLobbies);
  socket.on("lobby:send_message", sendMessage);
  socket.on("lobby:start_game", startGame);
}
