import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";
import Items from "../data/items";

describe("The item path", () => {
  const payload = {
    name: "Sword",
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

  it("indexes all items", async () => {
    const response = await request(app).get("/api/v1/items");
    expect(response.statusCode).toBe(200);
  });

  it("details a item", async () => {
    const item = await Items.detail();
    const response = await request(app).get(
      `/api/v1/items/${item.id}`
    );
    expect(response.statusCode).toBe(200);
  });

  it("creates a item", async () => {
    const response = await request(app)
      .post("/api/v1/items/")
      .set(headersAdmin)
      .send(payload);
    expect(response.statusCode).toBe(200);
    await Items.delete(response.body.id);
  });

  it("updates a item", async () => {
    const item = await Items.create(payload);
    const response = await request(app)
      .patch(`/api/v1/items/${item.id}`)
      .set(headersAdmin)
      .send({
        ...payload,
        name: "Axe",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Axe");
    await Items.delete(item.id);
  });

  it("deletes a item", async () => {
    const item = await Items.create(payload);
    await request(app)
      .delete(`/api/v1/items/${item.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
