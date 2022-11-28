import { io as Client, Socket } from "socket.io-client";
import request from "supertest";
import app from "../app";
import setupIO from "../io";
import Users from "../data/user";
import Games from "../data/games";
import GameUsers from "../data/game users";
import Characters from "../data/characters";

describe("Game handler", () => {

  const ioServer = setupIO(app);
  const expressServer = app.listen(process.env.PORT);
  ioServer.listen(Number(process.env.IO_PORT));
  let socket: Socket;
  let user: any;
  let game: any;
  let token: string;

  beforeAll(async () => {
    user = await Users.detail({ id: 1 });
    game = await Games.detail();
    const response = await request(app).post("/api/v1/authentication").send({
      email: "jsbparson@gmail.com",
      password: "qwerty123",
    });
    token = response.body.token;
  });

  beforeEach((done) => {
    try {
      socket = Client(`http://localhost:${process.env.IO_PORT}`, {
        auth: {
          token,
        },
      });
      socket.on("connect", () => done());
    } catch (e) {
      throw Error("Could not connect to server.");
    }
  });

  it("joins a game", async () => {
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

  afterEach(() => {
    socket.disconnect();
  })

  afterAll(() => {
    
    ioServer.close();
    expressServer.close();
  });
});
