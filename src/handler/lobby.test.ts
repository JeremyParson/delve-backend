import express from "express";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import setupIO from "../io";
import Users from "../data/user";
import Lobbies from "../data/lobbies";
import UserLobbies from "../data/user lobbies";
import GameUsers from "../data/game users";
import Games from "../data/games";

describe("Lobby handler", () => {
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

  it("joins a lobby", async () => {
    const user = await Users.detail();
    const lobby = await Lobbies.detail();
    socket.on("lobby:user_joined", async () => {
      const lobbyUser = await UserLobbies.detail({
        userId: user.id,
        lobbyId: lobby.id,
      });
      expect(lobbyUser).toBeTruthy();
      await UserLobbies.delete(lobbyUser.id);
    });

    socket.emit("lobby:join", {
      userId: user.id,
      lobbyId: lobby.id,
    });
  });

  it("leaves a lobby", async () => {
    const user = await Users.detail();
    const lobby = await Lobbies.detail();

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
    });

    socket.emit("lobby:join", {
      userId: user.id,
      lobbyId: lobby.id,
    });
  });

  it("sends a message", async () => {
    const user = await Users.detail();
    const lobby = await Lobbies.detail();
    socket.on("deliver_message", (payload) => {
      expect(payload.message).toBe("Hello World");
    });

    socket.on("lobby:user_joined", async () => {
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

  it("starts a game", async () => {
    const user = await Users.detail();
    const lobby = await Lobbies.detail();
    socket.on("lobby:game_starting", async (payload) => {
      const gameUser = await GameUsers.detail({
        gameId: payload.gameId,
        userId: user.id,
      });
      expect(gameUser).toBeTruthy();
      await GameUsers.delete(gameUser.id);
      await Games.delete(payload.gameId);

    });

    socket.on("lobby:user_joined", () => {
      socket.emit("lobby:start_game", {
        lobbyId: lobby.id,
        userId: user.id
      })
    })

    socket.emit('lobby:join', {
      lobbyId: lobby.id,
      userId: user.id,
    })
  });

  afterAll(() => {
    socket.disconnect();
    server.close();
  });
});
