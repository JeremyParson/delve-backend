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
  const expressServer = app.listen(process.env.PORT)
  ioServer.listen(Number(process.env.IO_PORT));
  let socket: Socket;
  let user: any
  let lobby: any

  beforeAll(async () => {
    const connectSocket = async (token: string) => {
      return new Promise((res, rej) => {
        try {
          socket = Client(`http://localhost:${process.env.IO_PORT}`, {
            auth: {
              token,
            },
          });
          socket.on("connect", () => res(true));
        } catch (e) {
          rej(e);
        }
      });
    };
    user = await Users.detail();
    lobby = await Lobbies.detail();
    const response = await request(app).post("/api/v1/authentication").send({
      email: "jsbparson@gmail.com",
      password: "qwerty123",
    });
    await connectSocket(response.body.token);
  });

  it("joins a lobby", (done) => {
    socket.on("lobby:user_joined", async () => {
      console.log("A user joined")
      const lobbyUser = await UserLobbies.detail({
        userId: user.id,
        lobbyId: lobby.id,
      });
      expect(lobbyUser).toBeTruthy();
      await UserLobbies.delete(lobbyUser.id);
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
        userId: user.id,
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
      const gameUser = await GameUser.detail({
        gameId: payload.gameId,
        userId: user.id,
      });
      expect(gameUser).toBeTruthy();
      await GameUser.delete(gameUser.id);
      await Games.delete(payload.gameId);
      done();
    });

    socket.on("lobby:user_joined", () => {
      socket.emit("lobby:start_game", {
        lobbyId: lobby.id,
        userId: user.id,
      });
    });

    socket.emit("lobby:join", {
      lobbyId: lobby.id,
      userId: user.id,
    });
  });

  afterAll(() => {
    socket.disconnect();
    ioServer.close();
    expressServer.close();
  });
});
