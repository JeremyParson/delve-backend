import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import Monsters from "../data/monsters";

describe("The monster path", () => {
  const payload = {
    name: "Kobold"
  };

  const jwt_token = process.env.JWT_SECRET || "";
  let userToken = "";
  let adminToken = "";
  const headersAdmin = {
    Authorization: "",
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    const user = await Users.detail({ role: "user" });
    userToken = jwt.sign({ id: user?.id }, jwt_token);
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
  });

  it("indexes all monsters", async () => {
    const response = await request(app).get("/api/v1/monsters");
    expect(response.statusCode).toBe(200);
  });

  it("details an monster", async () => {
    const monsters = await Monsters.index();
    const response = await request(app).get(
      `/api/v1/monsters/${monsters[0].id}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("creates an monster", async () => {
    const response = await request(app)
      .post("/api/v1/monsters/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await Monsters.delete(response.body.id);
  });

  it("updates an monster", async () => {
    const monster = await Monsters.create(payload);
    const response = await request(app)
      .patch(`/api/v1/monsters/${monster.id}`)
      .set(headersAdmin)
      .send({
        ...payload,
        name: "Red Kobold",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Red Kobold");
    await Monsters.delete(monster.id);
  });

  it("deletes an monster", async () => {
    const monster = await Monsters.create(payload);
    await request(app)
      .delete(`/api/v1/monsters/${monster.id}`)
      .set(headersAdmin)
      .expect(200);
  });

  it("does not allow users to delete monsters", async () => {
    const monster = await Monsters.create(payload);
    await request(app)
      .delete(`/api/v1/monsters/${monster.id}`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .expect(401);
    await Monsters.delete(monster.id);
  });

  it("does not allow users to update monsters", async () => {
    const monster = await Monsters.create(payload);

    await request(app)
      .patch(`/api/v1/monsters/${monster.id}`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .send({
        name: "Acid Blast",
      })
      .expect(401);

    await Monsters.delete(monster.id);
  });
});
