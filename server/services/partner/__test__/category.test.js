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
    name:"qowi",
    email:"qowi@gmail.com",
    password:"123456",
  },
  {
    name: "Raihan",
    email: "raihan@gmail.com",
    password: "123456",
  },
];

const dataCategory = [
  {
    name: "Kedai Kopi",
    symbol:
      "2615",
  },
];

const dataBusiness = [
  {
    name: "Kopi Poci Rajawali",
    latitude: -6.143049,
    longitude: 106.839994,
    address: "Jl. Rajawali Selatan Jl. Gn. Sahari 11 Dalam No.1B, RT.13/RW.2",
    price: "$",
    rating:
    "4.8",
    CategoryId: 1,
    PartnerId: 1,
    status: "pending",
    imageUrl: "https://lh5.googleusercontent.com/p/AF1QipMgRi3MQEnn46AudVTSZWm7CJgR5uMM4ljpNYWi=w122-h92-k-no",

  }
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
    name:"Leexo",
    email:"sbucham0@google.ru",
    password:"7qvl1Kf"
  }
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
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((el) => {
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("name", expect.any(String));
      expect(el).toHaveProperty("symbol", expect.any(String));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
      el.businesses.forEach((val) => {
        expect(val).toHaveProperty("id", expect.any(Number));
        expect(val).toHaveProperty("name", expect.any(String));
        expect(val).toHaveProperty("latitude", expect.any(Number));
        expect(val).toHaveProperty("longitude", expect.any(Number));
        expect(val).toHaveProperty("address", expect.any(String));
        expect(val).toHaveProperty("price", expect.any(String));
        expect(val).toHaveProperty("rating", expect.any(String));
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
  });

  test("GET: /categories/:id - 200 - Get Categories By ID", async () => {
    const res = await request(app)
      .get("/categories/1")
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("name", expect.any(String));
      expect(res.body).toHaveProperty("symbol", expect.any(String));
      expect(res.body).toHaveProperty("createdAt", expect.any(String));
      expect(res.body).toHaveProperty("updatedAt", expect.any(String));
      res.body.businesses.forEach((val) => {
        expect(val).toHaveProperty("id", expect.any(Number));
        expect(val).toHaveProperty("name", expect.any(String));
        expect(val).toHaveProperty("latitude", expect.any(Number));
        expect(val).toHaveProperty("longitude", expect.any(Number));
        expect(val).toHaveProperty("address", expect.any(String));
        expect(val).toHaveProperty("price", expect.any(String));
        expect(val).toHaveProperty("rating", expect.any(String));
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

  test("testing read Product if error", async () => {
    jest
      .spyOn(Category, "findAll")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app)
      .get("/categories")
      .set("access_token", access_token);
    expect(response.status).toBe(500);
  });

  test("testing read Product if error", async () => {
    jest
      .spyOn(Category, "findOne")
      .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
    const response = await request(app)
      .get("/categories/1000")
    expect(response.status).toBe(500);
  });


 
});
