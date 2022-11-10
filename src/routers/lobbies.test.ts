import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import Lobbies from "../data/lobbies";

describe("The lobby path", () => {
  const payload = {
    lobby_name: "Test Lobby",
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

  it("indexes all lobbies", async () => {
    const response = await request(app).get("/api/v1/lobbies");
    expect(response.statusCode).toBe(200);
  });

  it("details a lobby", async () => {
    const lobby = await Lobbies.detail();
    const response = await request(app).get(
      `/api/v1/lobbies/${lobby.id}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("creates a lobby", async () => {
    const response = await request(app)
      .post("/api/v1/lobbies/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await Lobbies.delete(response.body.id);
  });

  it("updates a lobby", async () => {
    const lobby = await Lobbies.create(payload);
    const response = await request(app)
      .patch(`/api/v1/lobbies/${lobby.id}`)
      .set(headersAdmin)
      .send({
        lobby_name: "Lobby name 2",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.lobby_name).toBe("Lobby name 2");
    await Lobbies.delete(lobby.id);
  });

  it("deletes a lobby", async () => {
    const lobby = await Lobbies.create(payload);
    await request(app)
      .delete(`/api/v1/lobbies/${lobby.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
