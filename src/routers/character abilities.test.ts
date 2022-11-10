import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import CharacterAbilities from "../data/character abilities";
import Characters from "../data/characters";
import Abilities from "../data/ability";

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
    const character = await Characters.detail();
    const ability = await Abilities.detail();
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
    payload = {
      abilities: {
        connect: {
          id: ability.id,
        },
      },
      characters: {
        connect: {
          id: character.id,
        },
      },
    };
  });

  it("indexes all character-abilities", async () => {
    const response = await request(app).get("/api/v1/character-abilities");
    expect(response.statusCode).toBe(200);
  });

  it("details a character-ability", async () => {
    const characterAbility = await CharacterAbilities.create(payload);
    const response = await request(app).get(
      `/api/v1/character-abilities/${characterAbility.id}`
    );
    expect(response.statusCode).toBe(200);
    await CharacterAbilities.delete(characterAbility.id);
  });

  it("creates a character-ability", async () => {
    const response = await request(app)
      .post("/api/v1/character-abilities/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await CharacterAbilities.delete(response.body.id);
  });

  it("updates a character-ability", async () => {
    const ability = await Abilities.create({});
    const characterAbility = await CharacterAbilities.create({
      cooldown: 10,
    });
    const response = await request(app)
      .patch(`/api/v1/character-abilities/${characterAbility.id}`)
      .set(headersAdmin)
      .send({
        cooldown: 20
      });

    expect(response.status).toBe(200);
    expect(response.body.cooldown).toBe(20);
    await CharacterAbilities.delete(characterAbility.id);
    await Abilities.delete(ability.id);
  });

  it("deletes a character-ability", async () => {
    const characterAbility = await CharacterAbilities.create(payload);
    await request(app)
      .delete(`/api/v1/character-abilities/${characterAbility.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
