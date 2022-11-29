import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import Characters from "../data/characters";
import Games from "../data/games";
import { generateMap } from "../game/game logic";
import jwt from "jsonwebtoken";
import GameUsers from "../data/game users";

const prisma = new PrismaClient();
const maps = new Map();

type Payload = {
  gameId: number;
};

type MessagePayload = {
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
  };

  const leaveGame = async (payload: Payload) => {
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
      io.to(strUserId).emit("game:user_left");
    }
  };

  const joinGame = async (payload: Payload) => {
    const game = await prisma.games.findFirst({
      where: {
        id: Number(payload.gameId),
      },
    });
    if (!game) return;

    await GameUsers.create({
      games: {
        connect: {
          id: payload.gameId
        }
      },
      users: {
        connect: {
          id: socket.user.id
        }
      }
    });
    
    const strGameId = String(payload.gameId);
    socket.join(strGameId);
    io.to(strGameId).emit("game:user_joined");
  };

  const sendMessage = (payload: MessagePayload) => {
    console.log("Message received");
    const gameUser = prisma.gameUsers.findFirst({
      where: {
        userId: socket.user.id,
        gameId: payload.gameId,
      },
    });
    if (!gameUser) return;
    const strGameId = String(payload.gameId);
    io.to(strGameId).emit("game:deliver_message", payload);
    console.log("Delivering message")
  };

  const moveCharacter = async (payload: MovePayload) => {
    const character = await Characters.detail({ id: payload.characterId });
    if (socket.user.id !== character.userid) return;
    await Characters.update(character.id, {
      position_x: payload.position[0],
      position_y: payload.position[1],
    });
    const roomId = String(payload.gameId);
    io.to(roomId).emit("game:character_moved", {
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
  socket.on("game:join", joinGame);
  socket.on("game:leave", leaveGame);
  socket.on("game:generate_next_layer", generateNextLayer);
  socket.on("game:move_character", moveCharacter);
  socket.on("game:message", sendMessage);
};
