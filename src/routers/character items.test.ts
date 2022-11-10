import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import CharacterItems from "../data/character items";
import Characters from "../data/characters";
import Items from "../data/items";

describe("The character item path", () => {
  let payload = {};
  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = '';
  const headersUser = {
    Authorization: '',
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    const character = await Characters.detail();
    const item = await Items.detail();
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersUser.Authorization = `Bearer ${adminToken}`;
    payload = {
      items: {
        connect: {
          id: item.id
        }
      },
      characters: {
        connect: {
          id: character.id
        }
      }
    }
  });

  it("indexes all character-items", async () => {
    const response = await request(app).get("/api/v1/character-items");
    expect(response.statusCode).toBe(200);
  });

  it("details a character-item", async () => {
    const characterItem = await CharacterItems.create(payload);
    const response = await request(app).get(`/api/v1/character-items/${characterItem.id}`);
    expect(response.statusCode).toBe(200);
    await CharacterItems.delete(characterItem.id);
  });

  it("creates a character-item", async () => {
    const response = await request(app)
      .post("/api/v1/character-items/")
      .set(headersUser)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await CharacterItems.delete(response.body.id);
  });

  it("updates a character-item", async () => {
    const characterItem = await CharacterItems.create(payload);
    const response = await request(app)
      .patch(`/api/v1/character-items/${characterItem.id}`)
      .set(headersUser)
      .send({});

    expect(response.statusCode).toBe(200);
    await CharacterItems.delete(characterItem.id);
  });

  it("deletes a character-item", async () => {
    const characterItem = await CharacterItems.create(payload);
    await request(app)
      .delete(`/api/v1/character-items/${characterItem.id}`)
      .set(headersUser)
      .expect(200);
  });
});
