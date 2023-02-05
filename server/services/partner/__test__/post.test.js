// const request = require('supertest');
// const app = require('../app');
// const { hashPassword } = require('../helpers/bcrypt');
// const { createToken } = require('../helpers/jwt');
// const {sequelize, Post, Partner, Category, Business} = require('../models')
// const queryInterface = sequelize.queryInterface;
// let access_token

// const dataPartner = [
//     {
//         "name": "Qowi",
//         "email": "qowi@gmail.com",
//         "password": "123456"
//     },
//     {
//         "name": "Raihan",
//         "email": "raihan@gmail.com",
//         "password": "123456"
//     }
// ]

// const dataCategory = [
//     {
//         name: "Travel",
//         symbol: "https://ih1.redbubble.net/image.3888203723.1875/st,small,507x507-pad,600x600,f8f8f8.jpg"
//     }
// ]

// const dataBusiness = [
//     {
//         name:"test",
//         description:"test",
//         CategoryId: 1,
//         mapUrl: "https://www.google.co.id/maps/place/Anjani+Jakarta/@-6.2778307,106.7672179,15.14z/data=!4m5!3m4!1s0x2e69f10f9bffd94d:0x788dc70a196640c9!8m2!3d-6.2658315!4d106.7718614",
//         PartnerId: 1,
//         imageUrl: "https://external-preview.redd.it/iSzqr1SrC4gczNc2DCJaWrykdasN0jcnSLjKAav8-1w.jpg?auto=webp&s=3e9532725ed6e40bd3f6b353c4f6d0d3fb691d8d"
//     }
// ]

// beforeAll(async() => {
//     dataPartner.forEach(el => {
//         el.createdAt = new Date()
//         el.updatedAt = new Date()
//         el.password = hashPassword(el.password)
//     })
//      await queryInterface.bulkInsert("Partners", dataPartner, {}),

//     dataCategory.forEach(el => {
//         el.createdAt = new Date()
//         el.updatedAt = new Date()
//     })
//     await queryInterface.bulkInsert("Categories", dataCategory, {}),

//     dataBusiness.forEach(el => {
//         el.createdAt = new Date()
//         el.updatedAt = new Date()
//     })
//     await queryInterface.bulkInsert("Businesses", dataBusiness, {})

//     access_token = createToken({id: 1})
// })

// beforeEach(() => {
//     jest.restoreAllMocks();
//     jest.mock("multer", () => {
//       const multer = () => {
//         return {
//           array: () => {
//             return (req, res, next) => {
//               req.files = [
//                 {
//                   url: "http://mock.url/a.png",
//                 },
//               ];
//               return next();
//             };
//           },
//         };
//       };
//       return multer;
//     });
// })


// afterAll(async() => {
//     await Partner.destroy({
//         cascade: true,
//         truncate: true,
//         restartIdentity: true
//     })

//     await Category.destroy({
//         cascade: true,
//         truncate: true,
//         restartIdentity: true
//     })

//     await Business.destroy({
//         cascade: true,
//         truncate: true,
//         restartIdentity: true
//     })
// })

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
