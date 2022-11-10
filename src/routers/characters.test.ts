import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import Character from "../data/characters";

describe("The character path", () => {
  let payload = {};
  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = '';
  const headersUser = {
    Authorization: '',
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersUser.Authorization = `Bearer ${adminToken}`;
    payload = {
      name: "Geraldamos",
      userid: admin.id
    }
  });

  it("indexes all characters", async () => {
    const response = await request(app).get("/api/v1/characters");
    expect(response.statusCode).toBe(200);
  });

  it("details a character", async () => {
    const character = await Character.create(payload);
    const response = await request(app).get(`/api/v1/characters/${character.id}`);
    expect(response.statusCode).toBe(200);
    await Character.delete(character.id);
  });

  it("creates a character", async () => {
    const response = await request(app)
      .post("/api/v1/characters/")
      .set(headersUser)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await Character.delete(response.body.id);
  });

  it("updates a character", async () => {
    const character = await Character.create(payload);
    const response = await request(app)
      .patch(`/api/v1/characters/${character.id}`)
      .set(headersUser)
      .send({
        name: "Jeremiah"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Jeremiah");
    await Character.delete(character.id);
  });

  it("deletes a character", async () => {
    const character = await Character.create(payload);
    await request(app)
      .delete(`/api/v1/characters/${character.id}`)
      .set(headersUser)
      .expect(200);
  });
});
