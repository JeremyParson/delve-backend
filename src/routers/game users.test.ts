import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import GameUsers from "../data/game users";
import Games from "../data/games";

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
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
    payload = {
      games: {
        connect: {
          id: game.id,
        },
      },
      users: {
        connect: {
          id: admin.id,
        },
      },
    };
  });

  it("indexes all game-users", async () => {
    const response = await request(app).get("/api/v1/game-users");
    expect(response.statusCode).toBe(200);
  });

  it("details a game-user", async () => {
    const gameUser = await GameUsers.create(payload);
    const response = await request(app).get(
      `/api/v1/game-users/${gameUser.id}`
    );
    expect(response.statusCode).toBe(200);
    await GameUsers.delete(gameUser.id);
  });

  it("creates a game-user", async () => {
    const response = await request(app)
      .post("/api/v1/game-users/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await GameUsers.delete(response.body.id);
  });

  it("updates a game-user", async () => {
    const gameUser = await GameUsers.create(payload);
    const response = await request(app)
      .patch(`/api/v1/game-users/${gameUser.id}`)
      .set(headersAdmin)
      .send({});
    expect(response.status).toBe(200);
    await GameUsers.delete(gameUser.id);
  });

  it("deletes a game-user", async () => {
    const gameUser = await GameUsers.create(payload);
    await request(app)
      .delete(`/api/v1/game-users/${gameUser.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
