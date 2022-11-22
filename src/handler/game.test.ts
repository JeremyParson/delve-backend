import express from "express";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import setupIO from "../io";
import Users from "../data/user";
import Games from "../data/games";
import GameUsers from "../data/game users";
import Characters from "../data/characters";
import characters from "../data/characters";

describe("Game handler", () => {
  let server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  let socket: Socket;
  beforeAll((done) => {
    const APP = express();
    const PORT = Number(process.env.IO_PORT);
    server = setupIO(APP);
    server.listen(PORT);
    socket = Client(`http://localhost:${PORT}`);
    socket.on("connect", done);
  });

  it("joins a game", async () => {
    const user = await Users.detail();
    const game = await Games.detail();
    socket.on("game:user_joined", async () => {
      const gameUser = await GameUsers.detail({
        userId: user.id,
        gameId: game.id,
      });
      expect(gameUser).toBeTruthy();
      await GameUsers.delete(gameUser.id);
    });

    socket.emit("game:join", {
      userId: user.id,
      gameId: game.id,
    });
  });

  it("leaves a game", async () => {
    const user = await Users.detail();
    const game = await Games.detail();

    socket.on("game:user_joined", async () => {
      socket.emit("game:leave", {
        userId: user.id,
        gameId: game.id,
      });
    });

    socket.on("game:user_left", async () => {
      const gameUser = await GameUsers.detail({
        userId: user.id,
        gameId: game.id,
      });
      expect(gameUser).toBeFalsy();
    });

    socket.emit("game:join", {
      userId: user.id,
      gameId: game.id,
    });
  });

  it("sends a message", async () => {
    const user = await Users.detail();
    const game = await Games.detail();
    socket.on("deliver_message", (payload) => {
      expect(payload.message).toBe("Hello World");
    });

    socket.on("game:user_joined", async () => {
      socket.emit("game:message", {
        userId: user.id,
        gameId: game.id,
        message: "Hello World",
      });
    });

    socket.emit("game:join", {
      userId: user.id,
      gameId: game.id,
    });
  });

  it("moves a characters", async () => {
    const user = await Users.detail();
    let character = await Characters.create({
      users: {
        connect: { id: user.id },
      },
    });
    socket.on("game:actor_moved", async (payload) => {
      character = await Characters.detail({ id: character.id });
      expect(character.position_x).toBe(1);
      expect(character.position_y).toBe(2);
      await Characters.delete(character.id);
    });
    socket.emit("game:move_character", {
      userId: user.id,
      characterId: 1,
      position: [1, 2],
    });
  });

  afterAll(() => {
    socket.disconnect();
    server.close();
  });
});
