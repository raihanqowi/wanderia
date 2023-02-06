const request = require("supertest");
const app = require("../app");
const { createToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize, Partner, Category, Business } = require("../models");
const queryInterface = sequelize.queryInterface;
const secret = `wanderiasangatrahasia`;
let access_token;

const dataPartner = [
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

const dataCategory = [
  {
    name: "Travel",
    symbol:
      "https://ih1.redbubble.net/image.3888203723.1875/st,small,507x507-pad,600x600,f8f8f8.jpg",
  },
];

const dataBusiness = [
  {
    name: "test",
    description: "test",
    CategoryId: 1,
    mapUrl:
      "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
    PartnerId: 1,
    imageUrl:
      "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d",
    latitude: -6.2778307,
    longitude: 106.7672179,
    status: "pending",
  },
  {
    name: "Jalan Jalan",
    description: "Jalan jalan",
    CategoryId: 1,
    mapUrl:
      "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
    PartnerId: 1,
    imageUrl:
      "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d",
    latitude: -6.2778307,
    longitude: 106.7672179,
    status: "pending",
  },
];

beforeAll(async () => {
  dataPartner.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hashPassword(el.password);
  });
  await queryInterface.bulkInsert("Partners", dataPartner, {});

  dataCategory.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
  });
  await queryInterface.bulkInsert("Categories", dataCategory, {});

  dataBusiness.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
  });
  await queryInterface.bulkInsert("Businesses", dataBusiness, {});

  const userPartner = {
    name: "hanon1",
    email: "hanon1@gmail.com",
    password: "123456",
  };
  const User = await Partner.create(userPartner);
  access_token = createToken({ id: User.id }, secret);
});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await Partner.destroy({
    cascade: true,
    truncate: true,
    restartIdentity: true,
  });

  await Category.destroy({
    cascade: true,
    truncate: true,
    restartIdentity: true,
  });

  await Business.destroy({
    cascade: true,
    truncate: true,
    restartIdentity: true,
  });
});

describe("POST:/business", () => {
  test("POST: /business - 201 - Bussiness Partner Create Success", async () => {
    const res = await request(app)
      .post("/business")
      .send({
        name: "Travel The Best",
        description: "Come With Us",
        CategoryId: 1,
        mapUrl:
          "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
        PartnerId: 3,
        imageUrl:
          "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d",
        latitude: -6.2778307,
        longitude: 106.7672179,
        status: "pending",
      })
      .set("access_token", access_token);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", expect.any(Number));
    expect(res.body).toHaveProperty("name", expect.any(String));
    expect(res.body).toHaveProperty("description", expect.any(String));
    expect(res.body).toHaveProperty("CategoryId", expect.any(Number));
    expect(res.body).toHaveProperty("mapUrl", expect.any(String));
    expect(res.body).toHaveProperty("PartnerId", expect.any(Number));
    expect(res.body).toHaveProperty("imageUrl", expect.any(String));
    expect(res.body).toHaveProperty("status", expect.any(String));
    expect(res.body).toHaveProperty("latitude", expect.any(Number));
    expect(res.body).toHaveProperty("longitude", expect.any(Number));
  });

  test("POST: /business - 400 - Error Name Required", async () => {
    const res = await request(app)
      .post("/business")
      .send({
        description: "Come With Us",
        CategoryId: 1,
        mapUrl:
          "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
        PartnerId: 1,
        imageUrl:
          "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d",
      })
      .set("access_token", access_token);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Name is Required");
  });
  


});

describe("PATCH: /bussiness/:id", () => {
  test("PATCH: /bussiness/:id - 201 - Success Edit Bussiness", async () => {
    const res = await request(app)
      .patch("/business/3")
      .send({
        name: "Test Jalan",
        description: "test",
        CategoryId: 1,
        mapUrl:
          "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
        imageUrl:
          "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d",
      })
      .set("access_token", access_token);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "data berhasil di update");
  });

  test("PATCH: /bussiness/:id - 404 - Data Not Found", async () => {
    const res = await request(app)
      .patch("/business/100")
      .send({
        name: "Test Jalan",
        description: "test",
        CategoryId: 1,
        mapUrl:
          "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
        imageUrl:
          "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d",
      })
      .set("access_token", access_token);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "error not found");
  });
});

describe("GET: /business", () => {
  test("GET: /business - 200 - Read All Data", async () => {
    const res = await request(app)
      .get("/business")
      .set("access_token", access_token);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((el) => {
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("name", expect.any(String));
      expect(el).toHaveProperty("latitude", expect.any(Number));
      expect(el).toHaveProperty("longitude", expect.any(Number));
      expect(el).toHaveProperty("description", expect.any(String));
      expect(el).toHaveProperty("description", expect.any(String));
    });
  });

  test("GET: /business - 200 - Read Detail Business", async () => {
    const res = await request(app)
      .get("/business/1")
      .set("access_token", access_token);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("id", expect.any(Number));
    expect(res.body).toHaveProperty("name", expect.any(String));
    expect(res.body).toHaveProperty("latitude", expect.any(Number));
    expect(res.body).toHaveProperty("longitude", expect.any(Number));
    expect(res.body).toHaveProperty("description", expect.any(String));
    expect(res.body).toHaveProperty("description", expect.any(String));
  });

  test("testing read Product if error", async () => {
    jest
      .spyOn(Business, "findAll")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app)
      .get("/business")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });

  test("testing read Product if error", async () => {
    jest
      .spyOn(Business, "findAll")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app)
      .get("/business/1001")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
});
