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
      socket.on("connect", done);
    } catch (e) {
      throw Error("Could not connect to server.");
    }
  });

  it("joins a game", (done) => {
    socket.on("game:user_joined", async () => {
      console.log("A user joined")
      const gameUser = await GameUsers.detail({
        gameId: game.id,
      });
      expect(gameUser).toBeTruthy();
      await GameUsers.delete(gameUser.id);
      done();
    });

    socket.emit("game:join", {
      gameId: game.id,
    });
  });

  it("leaves a game", (done) => {

    socket.on("game:user_joined", async () => {
      socket.emit("game:leave", {
        gameId: game.id,
      });
    });

    socket.on("game:user_left", async () => {
      const gameUser = await GameUsers.detail({
        gameId: game.id,
      });
      expect(gameUser).toBeFalsy();
      done();
    });

    socket.emit("game:join", {
      gameId: game.id,
    });
  });

  it("sends a message", (done) => {
    socket.on("deliver_message", (payload) => {
      expect(payload.message).toBe("Hello World");
      done();
    });

    socket.on("game:user_joined", async () => {
      socket.emit("game:message", {
        gameId: game.id,
        message: "Hello World",
      });
    });

    socket.on("game:deliver_message", (payload) => {
      expect(payload.message).toBe("Hello World");
      done();
    })

    socket.emit("game:join", {
      gameId: game.id,
    });
  });

  it("moves a characters", (done) => {
    socket.on("game:user_joined", async () => {
      const character = await Characters.create({
        users: {
          connect: { id: user.id },
        },
      })
      socket.emit("game:move_character", {
        characterId: character.id,
        position: [1, 2],
        gameId: game.id,
      });
    });

    socket.on("game:character_moved", async (payload) => {
      const character = await Characters.detail({ id: payload.characterId });
      expect(character.position_x).toBe(1);
      expect(character.position_y).toBe(2);
      await Characters.delete(character.id);
      done();
    });

    socket.emit("game:join", {
      gameId: game.id,
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
