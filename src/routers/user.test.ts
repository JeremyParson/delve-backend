import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";

describe("The user path", () => {
  const payload = {
    username: "Test User",
    email: "test@gmail.com",
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

  it("indexes all users", async () => {
    const response = await request(app).get("/api/v1/users");
    expect(response.statusCode).toBe(200);
  });

  it("details a user", async () => {
    const user = await Users.detail();
    const response = await request(app).get(`/api/v1/users/${user.id}`);
    expect(response.statusCode).toBe(200);
  });

  it("creates a user", async () => {
    const response = await request(app)
      .post("/api/v1/users/")
      .set(headersAdmin)
      .send({
        ...payload,
        password: "qwerty123",
      });
    expect(response.statusCode).toBe(200);
    console.log("adasdsaasdasdsads", response.body, response.status)
    //await Users.delete(response.body.id);
  });

  it("updates a user", async () => {
    const user = await Users.create(payload);
    const response = await request(app)
      .patch(`/api/v1/users/${user.id}`)
      .set(headersAdmin)
      .send({
        username: "JParson",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("JParson");
    await Users.delete(user.id);
  });

  it("deletes a user", async () => {
    const user = await Users.create(payload);
    await request(app)
      .delete(`/api/v1/users/${user.id}`)
      .set(headersAdmin)
      .expect(200);
  });
});
