const request = require('supertest');
const app = require('../app');
const { hashPassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const {sequelize, Post, Partner, Category, Business} = require('../models')
const queryInterface = sequelize.queryInterface;
let access_token

const dataPartner = [
    {
        "name": "Qowi",
        "email": "qowi@gmail.com",
        "password": "123456"
    },
    {
        "name": "Raihan",
        "email": "raihan@gmail.com",
        "password": "123456"
    }
]

const dataCategory = [
    {
        name: "Travel",
        symbol: "https://ih1.redbubble.net/image.3888203723.1875/st,small,507x507-pad,600x600,f8f8f8.jpg"
    }
]

const dataBusiness = [
    {
        name:"test",
        description:"test",
        CategoryId: 1,
        mapUrl: "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
        PartnerId: 1,
        imageUrl: "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d"
    }
]

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
    jest.mock("multer", () => {
      const multer = () => {
        return {
          array: () => {
            return (req, res, next) => {
              req.files = [
                {
                  url: "http://mock.url/a.png",
                },
              ];
              return next();
            };
          },
        };
      };
      return multer;
    });
})


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

// describe("POST:/post/add-post/:id", () => {
//     test("POST: /post/ - 201 - Business Post", async () => {
//         const res = await request(app)
//         .post('post/add-post/1')
//         .field("name", "test")
//         .attach("imageUrl", "./assets/kucing2.jpeg")
//         .field("BusinessId", "1")
//         .set('access_token', access_token)
//        console.log(res);
//     })
// })

describe("GET: /post", () => {
    test("GET: /post - 200 - Read Post", async () => {
        const res =  await request(app)
        .get("/post")
        .set("access_token", access_token)
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
        .delete("/post/1001")
        .set("access_token", access_token)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("message", "error not found")
    })

    
})
