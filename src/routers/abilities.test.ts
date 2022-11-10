import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import Abilities from "../data/ability";

describe("The ability path", () => {
  const payload = {
    name: "Ice Blast",
    i_icon: "iceBlast.jpg",
    description: "Release an expanding cloud of ice.",
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

  it("indexes all abilities", async () => {
    const response = await request(app).get("/api/v1/abilities");
    expect(response.statusCode).toBe(200);
  });

  it("details an ability", async () => {
    const abilities = await Abilities.index();
    const response = await request(app).get(
      `/api/v1/abilities/${abilities[0].id}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("creates an ability", async () => {
    const response = await request(app)
      .post("/api/v1/abilities/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await Abilities.delete(response.body.id);
  });

  it("updates an ability", async () => {
    const ability = await Abilities.create(payload);
    const response = await request(app)
      .patch(`/api/v1/abilities/${ability.id}`)
      .set(headersAdmin)
      .send({
        ...payload,
        name: "Fire Blast",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Fire Blast");
    await Abilities.delete(ability.id);
  });

  it("deletes an ability", async () => {
    const ability = await Abilities.create(payload);
    await request(app)
      .delete(`/api/v1/abilities/${ability.id}`)
      .set(headersAdmin)
      .expect(200);
  });

  it("does not allow users to delete abilities", async () => {
    const ability = await Abilities.create(payload);
    await request(app)
      .delete(`/api/v1/abilities/${ability.id}`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .expect(401);
    await Abilities.delete(ability.id);
  });

  it("does not allow users to update abilities", async () => {
    const ability = await Abilities.create(payload);

    await request(app)
      .patch(`/api/v1/abilities/${ability.id}`)
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .send({
        name: "Acid Blast",
      })
      .expect(401);

    await Abilities.delete(ability.id);
  });
});
