const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize, Partner } = require("../models");
const queryInterface = sequelize.queryInterface;

let dataPartner = [
  {
    name: "Qowi",
    email: "qowi@gmail.com",
    password: "123456",
  },
  {
    name: "Raihan",
    email: "raihan@gmail.com",
    password: "123456",
  },
];

beforeAll(async () => {
  dataPartner.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hashPassword(el.password);
  });
  await queryInterface.bulkInsert("Partners", dataPartner, {});
});

afterAll(async () => {
  await Partner.destroy({
    cascade: true,
    truncate: true,
    restartIdentity: true,
  });
});

describe("POST:/partner/register", () => {
  test("POST: /partner/register - 201 - Register Partner Success", async () => {
    const res = await request(app).post("/partner/register").send({
      name: "argi",
      email: "argiAI@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", expect.any(Number));
    expect(res.body).toHaveProperty("name", expect.any(String));
    expect(res.body).toHaveProperty("email", expect.any(String));
    expect(res.body).toHaveProperty("password", expect.any(String));
  });

  test("POST: /register/partner - Failed Name is Required", async () => {
    const res = await request(app).post("/partner/register").send({
      email: "argiAI@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "partner name is required");
  });
});

describe("POST: /partner/login", () => {
  test("POST: /partner/login - 200 - Success Login", async () => {
    const res = await request(app).post("/partner/login").send({
      email: "qowi@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token", expect.any(String));
  });
  test("POST: /partner/login - 401 - Invalid Credential", async () => {
    const res = await request(app).post("/partner/login").send({
      email: "qowi@gmail.com",
      password: "123455",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid username, email or password"
    );
  });

  test("POST: /partner/login - 400 - Email Required", async () => {
    const res = await request(app).post("/partner/login").send({
      password: "123456",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Email required");
  });

  test("POST: /partner/login - 400 - Password Required", async () => {
    const res = await request(app).post("/partner/login").send({
      email: "qowi@gmail.com",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Password required");
  });

  test("POST: /partner/login - 400 - Partner Not Found", async () => {
    const res = await request(app).post("/partner/login").send({
      email: "hanon@gmail.com",
      password: "hanon12",
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid username, email or password"
    );
  });
});
