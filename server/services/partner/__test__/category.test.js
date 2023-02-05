const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { sequelize, Post, Partner, Category, Business } = require("../models");
const queryInterface = sequelize.queryInterface;
let access_token;
const secret = `wanderiasangatrahasia`;

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

const dataPost = [
  {
    name: "Travel Kucing",
    imageUrl:
      "https://res.cloudinary.com/dcbsnkbgr/image/upload/v1675593569/Wanderia/tlcb5mdm3d04a2utn1z1.jpg",
    BusinessId: 1,
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

  dataPost.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
  });
  await queryInterface.bulkInsert("Posts", dataPost, {});

  const userPartner = {
    name: "hanon1",
    email: "hanon1@gmail.com",
    password: "123456",
  };
  const User = await Partner.create(userPartner);
  access_token = createToken({ id: User.id }, secret);
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

  await Post.destroy({
    cascade: true,
    truncate: true,
    restartIdentity: true,
  });
});

describe("GET: /categories", () => {
  test("GET: /categories - 200 - Get All Categories Success", async () => {
    const res = await request(app)
      .get("/categories")
      .set("access_token", access_token);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((el) => {
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("symbol", expect.any(String));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
      el.businesses.forEach((val) => {
        expect(val).toHaveProperty("id", expect.any(Number));
        expect(val).toHaveProperty("name", expect.any(String));
        expect(val).toHaveProperty("latitude", expect.any(Number));
        expect(val).toHaveProperty("longitude", expect.any(Number));
        expect(val).toHaveProperty("description", expect.any(String));
        expect(val).toHaveProperty("mapUrl", expect.any(String));
        expect(val).toHaveProperty("CategoryId", expect.any(Number));
        expect(val).toHaveProperty("PartnerId", expect.any(Number));
        expect(val).toHaveProperty("status", expect.any(String));
        expect(val).toHaveProperty("imageUrl", expect.any(String));
        expect(val).toHaveProperty("createdAt", expect.any(String));
        expect(val).toHaveProperty("updatedAt", expect.any(String));
        expect(val).toHaveProperty("author", expect.any(Object));
        expect(val.author).toHaveProperty("id", expect.any(Number));
        expect(val.author).toHaveProperty("name", expect.any(String));
        expect(val.author).toHaveProperty("email", expect.any(String));
        expect(val.author).toHaveProperty("createdAt", expect.any(String));
        expect(val.author).toHaveProperty("updatedAt", expect.any(String));
        expect(val).toHaveProperty("posts", expect.any(Array));
      });
    });
    // console.log(res)
  });

  test("testing read Product if error", async () => {
    jest
      .spyOn(Category, "findAll")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app)
      .get("/categories")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });
});
