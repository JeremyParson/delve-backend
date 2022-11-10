import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";

const prisma = new PrismaClient();

type Payload = {
  userId: number;
  gameId: number;
}

type MessagePayload = {
  userId: number;
  gameId: number;
  message: string;
}

export default function registerGameHandlers(io: Server, socket: Socket) {
  const leaveGame = async (payload: Payload) => {
    const strGameId = String(payload.gameId);
    const strUserId = String(payload.userId);
    if (socket.rooms.has(strGameId)) {
      await prisma.gameUsers.deleteMany({
        where: {
          userId: payload.userId,
          gameId: payload.gameId,
        },
      });
      socket.rooms.delete(strGameId);
      socket.to(strUserId).emit("game:user_left");
    }
  }

  const joinGame = async (payload: Payload) => {
    const game = await prisma.lobbies.findFirst({
      where: {
        id: Number(payload.gameId),
      },
    });

    prisma.users.update({
      where: {
        id: Number(payload.userId),
      },
      data: {
        gameUsers: {
          create: {
            gameId: Number(payload.gameId),
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
          },
        },
      },
    });

    if (!game) return;
    const strGameId = String(payload.gameId);
    socket.to(strGameId).emit("game:user_joined");
    socket.join(strGameId);
  }

  const sendMessage = (payload: MessagePayload) => {
    const userGame = prisma.gameUsers.findFirst({
      where: {
        userId: payload.userId,
        gameId: payload.gameId
      }
    })
    if (!userGame) return;
    const strGameId = String(payload.gameId);
    socket.to(strGameId).emit("game:deliver_message", payload);
  }

  socket.on("game:join", joinGame);
  socket.on("game:leave", leaveGame);
  socket.on("game:send_message", sendMessage);
}