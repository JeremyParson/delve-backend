import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import UserLobbies from "../data/user lobbies";
import Lobbies from "../data/lobbies";

describe("The user lobby path", () => {
  let payload = {};
  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = "";
  const headersAdmin = {
    Authorization: "",
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    const lobby = await Lobbies.detail();
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
    payload = {
      lobbies: {
        connect: {
          id: lobby.id,
        },
      },
      users: {
        connect: {
          id: admin.id,
        },
      },
    };
  });

  it("indexes all user-lobbies", async () => {
    const response = await request(app).get("/api/v1/user-lobbies");
    expect(response.statusCode).toBe(200);
  });

  it("details a user-lobby", async () => {
    const userLobby = await UserLobbies.create(payload);
    const response = await request(app).get(
      `/api/v1/user-lobbies/${userLobby.id}`
    );
    expect(response.statusCode).toBe(200);
    await UserLobbies.delete(userLobby.id);
  });

  it("creates a user-lobby", async () => {
    const response = await request(app)
      .post("/api/v1/user-lobbies/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await UserLobbies.delete(response.body.id);
  });

  it("updates a user-lobby", async () => {
    const userLobby = await UserLobbies.create({});
    const response = await request(app)
      .patch(`/api/v1/user-lobbies/${userLobby.id}`)
      .set(headersAdmin)
      .send({});
    expect(response.status).toBe(200);
    await UserLobbies.delete(userLobby.id);
  });

  it("deletes a user-lobby", async () => {
    const userLobby = await UserLobbies.create(payload);
    await request(app)
      .delete(`/api/v1/user-lobbies/${userLobby.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
