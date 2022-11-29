import express, { Application } from "express";
import { io as Client, Socket } from "socket.io-client";
import app from "../app";
import setupIO from "../io";
import Users from "../data/user";
import Lobbies from "../data/lobbies";
import UserLobbies from "../data/user lobbies";
import GameUser from "../data/game users";
import Games from "../data/games";
import request from "supertest";

describe("Lobby handler", () => {
  const ioServer = setupIO(app);
  const expressServer = app.listen(process.env.PORT);
  ioServer.listen(Number(process.env.IO_PORT));
  let socket: Socket;
  let user: any;
  let lobby: any;
  let token: string;

  beforeAll(async () => {
    user = await Users.detail({ id: 1 });
    lobby = await Lobbies.detail();
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

  it("joins a lobby", (done) => {
    socket.on("lobby:user_joined", async () => {
      const lobbyUser = await UserLobbies.detail({
        lobbyId: lobby.id,
        userId: user.id,
      });
      expect(lobbyUser).toBeTruthy();
      done();
    });

    socket.emit("lobby:join", {
      userId: user.id,
      lobbyId: lobby.id,
    });
  });

  it("leaves a lobby", (done) => {
    socket.on("lobby:user_joined", async () => {
      socket.emit("lobby:leave", {
        lobbyId: lobby.id,
      });
    });

    socket.on("lobby:user_left", async () => {
      const lobbyUser = await UserLobbies.detail({
        userId: user.id,
        lobbyId: lobby.id,
      });
      expect(lobbyUser).toBeFalsy();
      done();
    });

    socket.emit("lobby:join", {
      userId: user.id,
      lobbyId: lobby.id,
    });
  });

  it("sends a message", (done) => {
    socket.on("lobby:deliver_message", (payload) => {
      expect(payload.message).toBe("Hello World");
      done();
    });

    socket.on("lobby:user_joined", () => {
      socket.emit("lobby:message", {
        userId: user.id,
        lobbyId: lobby.id,
        message: "Hello World",
      });
    });

    socket.emit("lobby:join", {
      userId: user.id,
      lobbyId: lobby.id,
    });
  });

  it("starts a game", (done) => {
    socket.on("lobby:game_starting", async (payload) => {
      console.log("Game started");
      const gameUser = await GameUser.detail({
        gameId: payload.gameId,
        userId: user.id,
      });
      expect(gameUser).toBeTruthy();
      console.log("Game user exists");
      await GameUser.delete(gameUser.id);
      await Games.delete(payload.gameId);
      done();
    });

    socket.on("lobby:user_joined", async (payload) => {
      console.log("User Joined", payload);
      const userLobby = await UserLobbies.detail({
        userId: user.id,
        lobbyId: lobby.id,
      });
      expect(userLobby).toBeTruthy();
      console.log("Starting game...");
      socket.emit("lobby:start_game", {
        lobbyId: lobby.id,
      });
    });

    console.log("Joining...");
    socket.emit("lobby:join", {
      lobbyId: lobby.id,
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
