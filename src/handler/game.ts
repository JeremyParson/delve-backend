import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import Characters from "src/data/characters";
import Games from "../data/games";
import { generateMap } from "../game/game logic";

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

export default function registerGameHandlers(io: Server, socket: Socket) {
  const generateNextLayer = async (payload: Payload) => {
    const game = await Games.detail({ id: payload.gameId });
    const map = generateMap(game.id, Number(game.layer));
    maps.set(game.id, map);
  }

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
  };

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
          },
        },
      },
    });
    if (!game) return;
    const strGameId = String(payload.gameId);
    socket.to(strGameId).emit("game:user_joined");
    socket.join(strGameId);
  };

  const sendMessage = (payload: MessagePayload) => {
    const userGame = prisma.gameUsers.findFirst({
      where: {
        userId: payload.userId,
        gameId: payload.gameId,
      },
    });
    if (!userGame) return;
    const strGameId = String(payload.gameId);
    socket.to(strGameId).emit("game:deliver_message", payload);
  };

  const moveCharacter = async (payload: MovePayload) => {
    const character = await Characters.detail({ id: payload.characterId });
    if (payload.userId !== character.userid) return;
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

  socket.on("game:move_character", moveCharacter);
  socket.on("game:join", joinGame);
  socket.on("game:leave", leaveGame);
  socket.on("game:send_message", sendMessage);
}
