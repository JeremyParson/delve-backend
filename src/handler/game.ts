import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import Characters from "../data/characters";
import Games from "../data/games";
import { generateMap } from "../game/game logic";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const maps = new Map();

type Payload = {
  userId: number;
  gameId: number;
};

type MessagePayload = {
  userId: number;
  gameId: number;
  message: string;
};

type MovePayload = {
  gameId: number;
  characterId: number;
  userId: number;
  position: [number, number];
};

type ActionPayload = {
  characterId: number;
  action: string;
  targets: [{ id: number; actorType: string }];
};

export default function registerGameHandlers(io: Server) {
  const generateNextLayer = async (_socket: Socket, payload: Payload) => {
    const game = await Games.detail({ id: payload.gameId });
    const map = generateMap(game.id, Number(game.layer));
    maps.set(game.id, map);
  };

  const leaveGame = async (socket: Socket, payload: Payload) => {
    const strGameId = String(payload.gameId);
    const strUserId = String(socket.user.id);
    if (socket.rooms.has(strGameId)) {
      await prisma.gameUsers.deleteMany({
        where: {
          userId: socket.user.id,
          gameId: payload.gameId,
        },
      });
      socket.rooms.delete(strGameId);
      socket.to(strUserId).emit("game:user_left");
    }
  };

  const joinGame = async (socket: Socket, payload: Payload) => {
    const game = await prisma.lobbies.findFirst({
      where: {
        id: Number(payload.gameId),
      },
    });

    prisma.users.update({
      where: {
        id: Number(socket.user.id),
      },
      data: {
        gameUsers: {
          create: {
            gameId: Number(payload.gameId),
          },
        },
      },
    });
    if (!game) return;
    const strGameId = String(payload.gameId);
    socket.to(strGameId).emit("game:user_joined");
    socket.join(strGameId);
  };

  const sendMessage = (socket: Socket, payload: MessagePayload) => {
    const userGame = prisma.gameUsers.findFirst({
      where: {
        userId: socket.user.id,
        gameId: payload.gameId,
      },
    });
    if (!userGame) return;
    const strGameId = String(payload.gameId);
    socket.to(strGameId).emit("game:deliver_message", payload);
  };

  const moveCharacter = async (socket: Socket, payload: MovePayload) => {
    const character = await Characters.detail({ id: payload.characterId });
    if (socket.user.id !== character.userid) return;
    await Characters.update(character.id, {
      position_x: payload.position[0],
      position_y: payload.position[1],
    });
    const roomId = String(payload.gameId);
    socket.to(roomId).emit("game:character_moved", {
      characterId: payload.characterId,
      position: payload.position,
    });
  };

  io.use(async (socket, next) => {
    const isAuthentic = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
    if (isAuthentic) {
      next()
    } else {
      next(new Error("Authentication failed."))
    }
  });
  io.on("game:join", joinGame);
  io.on("game:leave", leaveGame);
  io.on("game:generate_next_layer", generateNextLayer);
  io.on("game:move_character", moveCharacter);
  io.on("game:send_message", sendMessage);
};
