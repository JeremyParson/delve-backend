import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import Games from "../data/games";

describe("The game path", () => {
  const payload = {
    game_name: "Test Game",
  };

  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = "";
  const headersAdmin = {
    Authorization: "",
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
  });

  it("indexes all games", async () => {
    const response = await request(app).get("/api/v1/games");
    expect(response.statusCode).toBe(200);
  });

  it("details a game", async () => {
    const game = await Games.detail();
    const response = await request(app).get(
      `/api/v1/games/${game.id}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("creates a game", async () => {
    const response = await request(app)
      .post("/api/v1/games/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await Games.delete(response.body.id);
  });

  it("updates a game", async () => {
    const game = await Games.create(payload);
    const response = await request(app)
      .patch(`/api/v1/games/${game.id}`)
      .set(headersAdmin)
      .send({
        ...payload,
        game_name: "Fire Blast",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.game_name).toBe("Fire Blast");
    await Games.delete(game.id);
  });

  it("deletes a game", async () => {
    const game = await Games.create(payload);
    await request(app)
      .delete(`/api/v1/games/${game.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
