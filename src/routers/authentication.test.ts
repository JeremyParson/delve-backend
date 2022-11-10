import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import Users from "../data/user";

describe("The authentication path", () => {
  const jwt_token = process.env.JWT_SECRET || "";
  let adminToken = '';
  const headersAdmin = {
    Authorization: '',
    "Content-type": "application/json",
  };

  beforeAll(async () => {
    const admin = await Users.detail({ role: "admin" });
    adminToken = jwt.sign({ id: admin?.id }, jwt_token);
    headersAdmin.Authorization = `Bearer ${adminToken}`;
  });

  it('Authenticates users', async () => {
    const response = await request(app).post('/api/v1/authentication')
      .set(headersAdmin)
      .send({
        email: 'jsbparson@gmail.com',
        password: 'qwerty123'
      });
    expect(response.status).toBe(200);
  });

  it('Profiles the user', async () => {
    const response = await request(app).get('/api/v1/authentication/profile')
      .set(headersAdmin);
    expect(response.statusCode).toBe(200);
  });
});
