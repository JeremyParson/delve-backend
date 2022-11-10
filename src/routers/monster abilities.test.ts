import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import MonsterAbilities from "../data/monster abilities";
import Abilities from "../data/ability";
import Monsters from "../data/monsters";

describe("The monster ability path", () => {
  let payload = {};
  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = "";
  const headersAdmin = {
    Authorization: "",
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    const abilities = await Abilities.detail();
    const monster = await Monsters.detail();
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
    payload = {
      abilities: {
        connect: {
          id: abilities.id,
        },
      },
      monsters: {
        connect: {
          id: monster.id,
        },
      },
    };
  });

  it("indexes all monster-abilities", async () => {
    const response = await request(app).get("/api/v1/monster-abilities");
    expect(response.statusCode).toBe(200);
  });

  it("details a monster-ability", async () => {
    const monsterAbility = await MonsterAbilities.create(payload);
    const response = await request(app).get(
      `/api/v1/monster-abilities/${monsterAbility.id}`
    );
    expect(response.statusCode).toBe(200);
    await MonsterAbilities.delete(monsterAbility.id);
  });

  it("creates a monster-ability", async () => {
    const response = await request(app)
      .post("/api/v1/monster-abilities/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await MonsterAbilities.delete(response.body.id);
  });

  it("updates a monster-ability", async () => {
    const monsterAbility = await MonsterAbilities.create(payload);
    const response = await request(app)
      .patch(`/api/v1/monster-abilities/${monsterAbility.id}`)
      .set(headersAdmin)
      .send({});

    expect(response.status).toBe(200);
    await MonsterAbilities.delete(monsterAbility.id);
  });

  it("deletes a monster-ability", async () => {
    const monsterAbility = await MonsterAbilities.create(payload);
    await request(app)
      .delete(`/api/v1/monster-abilities/${monsterAbility.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
