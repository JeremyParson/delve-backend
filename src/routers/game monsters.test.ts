import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import GameMonsters from "../data/game monsters";
import Games from "../data/games";
import Monsters from "../data/monsters";

describe("The character ability path", () => {
  let payload = {};
  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = "";
  const headersAdmin = {
    Authorization: "",
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    const game = await Games.detail();
    const monster = await Monsters.detail();
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
    payload = {
      games: {
        connect: {
          id: game.id,
        },
      },
      monsters: {
        connect: {
          id: monster.id,
        },
      },
    };
  });

  it("indexes all game-monsters", async () => {
    const response = await request(app).get("/api/v1/game-monsters");
    expect(response.statusCode).toBe(200);
  });

  it("details a game-monster", async () => {
    const gameMonster = await GameMonsters.create(payload);
    const response = await request(app).get(
      `/api/v1/game-monsters/${gameMonster.id}`
    );
    expect(response.statusCode).toBe(200);
    await GameMonsters.delete(gameMonster.id);
  });

  it("creates a game-monster", async () => {
    const response = await request(app)
      .post("/api/v1/game-monsters/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await GameMonsters.delete(response.body.id);
  });

  it("updates a game-monster", async () => {
    const gameMonster = await GameMonsters.create(payload);
    const response = await request(app)
      .patch(`/api/v1/game-monsters/${gameMonster.id}`)
      .set(headersAdmin)
      .send({
        health: 20
      });

    expect(response.status).toBe(200);
    expect(response.body.health).toBe(20);
    await GameMonsters.delete(gameMonster.id);
  });

  it("deletes a game-monster", async () => {
    const gameMonster = await GameMonsters.create(payload);
    await request(app)
      .delete(`/api/v1/game-monsters/${gameMonster.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
