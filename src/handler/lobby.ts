import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";

const prisma = new PrismaClient();

type Payload = {
  userId: number;
  lobbyId: number;
}

type MessagePayload = {
  userId: number;
  lobbyId: number;
  message: string;
}

export default function registerLobbyHandlers(io: Server, socket: Socket) {

  const leaveAllLobbies = () => {
    console.log("a user disconnecting");
    socket.rooms.forEach((room) => {
      if (socket.id != room) {
        socket.leave(room);
        socket.to(room).emit("lobby:user_left");
      }
    });
  }

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
  }

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
  }

  const sendMessage = (payload: MessagePayload) => {
    const userLobby = prisma.userLobbies.findFirst({
      where: {
        userId: payload.userId,
        lobbyId: payload.lobbyId
      }
    })
    if (!userLobby) return;
    const strLobbyId = String(payload.lobbyId);
    socket.to(strLobbyId).emit("lobby:deliver_message", payload);
  }

  socket.on("lobby:join", joinLobby);
  socket.on("lobby:leave", leaveLobby);
  socket.on("disconnecting", leaveAllLobbies);
  socket.on("lobby:send_message", sendMessage);
}
