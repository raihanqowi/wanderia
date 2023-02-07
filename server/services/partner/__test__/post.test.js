const request = require('supertest');
const app = require('../app');
const { hashPassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const {sequelize, Post, Partner, Category, Business} = require('../models')
const queryInterface = sequelize.queryInterface;
let access_token

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

  },
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
    {
        name: "Travel Anjing",
        imageUrl:
          "https://res.cloudinary.com/dcbsnkbgr/image/upload/v1675593569/Wanderia/tlcb5mdm3d04a2utn1z1.jpg",
        BusinessId: 1,
      }
  ];

beforeAll(async() => {
    dataPartner.forEach(el => {
        el.createdAt = new Date()
        el.updatedAt = new Date()
        el.password = hashPassword(el.password)
    })
     await queryInterface.bulkInsert("Partners", dataPartner, {}),

    dataCategory.forEach(el => {
        el.createdAt = new Date()
        el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert("Categories", dataCategory, {}),

    dataBusiness.forEach(el => {
        el.createdAt = new Date()
        el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert("Businesses", dataBusiness, {})

    dataPost.forEach((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
      });
      await queryInterface.bulkInsert("Posts", dataPost, {});

    access_token = createToken({id: 1})
})


beforeEach(() => {
  jest.restoreAllMocks();
});


afterAll(async() => {
    await Partner.destroy({
        cascade: true,
        truncate: true,
        restartIdentity: true
    })

    await Category.destroy({
        cascade: true,
        truncate: true,
        restartIdentity: true
    })

    await Business.destroy({
        cascade: true,
        truncate: true,
        restartIdentity: true
    })

    await Post.destroy({
        cascade: true,
        truncate: true,
        restartIdentity: true,
      });
})

describe("POST:/post/add/:id", () => {
    test("POST: /post/ - 201 - Business Post", async () => {
        const res = await request(app)
        .post('/post/add/1')
        .send({
          name: "Kopi Lawak With Cami",
          imageUrl: "kosong"
        })
        .set('access_token', access_token)
        expect(res.body).toHaveProperty("id", expect.any(Number));
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("BusinessId", expect.any(Number));
        expect(res.body).toHaveProperty("createdAt", expect.any(String));
        expect(res.body).toHaveProperty("updatedAt", expect.any(String));
    })

    test("POST: /post/ - 401 - Failed Because a dongt have access_token", async () => {
      const res = await request(app)
      .post('/post/add/1')
      .send({
        name: "Kopi Lawak With Cami",
        imageUrl: "kosong"
      })
     expect(res.status).toBe(401)
     expect(res.body).toHaveProperty('message', 'Must login first')
  })

  test("POST: /post/ - 401 - Failed Because a dongt have access_token", async () => {
    const res = await request(app)
    .post('/post/add/1')
    .send({
      nam: "Kopi Lawak With Cami",
      imageUrl: "kosong"
    })
    .set('access_token', access_token)
    // console.log(res);
   expect(res.status).toBe(400)
   expect(res.body).toHaveProperty('message', 'Name is Required')
})
})

describe("GET: /post", () => {
    test("GET: /post - 200 - Read Post", async () => {
        const res =  await request(app)
        .get("/post")
        .set("access_token", access_token)
        // console.log(res);
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach((el) => {
            expect(el).toHaveProperty("id", expect.any(Number));
            expect(el).toHaveProperty("name", expect.any(String));
            expect(el).toHaveProperty("imageUrl", expect.any(String));
            expect(el).toHaveProperty("BusinessId", expect.any(Number));
            expect(el).toHaveProperty("createdAt", expect.any(String));
            expect(el).toHaveProperty("updatedAt", expect.any(String));
        })
    })

    test("testing read Product if error", async () => {
        jest
          .spyOn(Post, "findAll")
          .mockRejectedValue(() => Promise.reject({ name: "something wrong" }));
        const response = await request(app)
          .get("/post")
          .set("access_token", access_token);
        expect(response.status).toBe(500);
      });
})


describe("DELETE: /post/:id", () => {
    test("DELETE: /post/:id - 200 - Delete Post", async () => {
        const res = await request(app)
        .delete("/post/1")
        .set("access_token", access_token)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("message", "Success to Delete")
    })

    test("DELETE: /post/:id - 404 - Delete Post Data Not Found", async () => {
        const res = await request(app)
        .delete("/post/10000001")
        .set("access_token", access_token)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("message", "error not found")
    })

    
})
