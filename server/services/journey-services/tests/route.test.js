const chai = require("chai");
const { ObjectId } = require("mongodb");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app");
const { clientDB, connectDB, getClient } = require("../configs/mongoDb");
const Route = require("../models");
// await connectDB()
let tripId;

beforeAll(async () => {
     await connectDB()
     let routes = await Route.findAll()
     tripId = routes[0].tripId
    //  console.log(routes, "routescoy");
    //  console.log(tripId, " ini route");
})


afterAll(async () => {
    const client = getClient()
    client.close()
})

describe("Test GET /routes endpoint", () => {
    it("should return an array of users with a 200 status code", async () => {
       
        const res = await request(app).get("/routes")
        expect(res.statusCode).to.equal(200);
        // console.log(res);
        expect(res.body).to.be.an("Array")
        res.body.forEach(el => {
            expect(el).to.have.property("_id")
            expect(el).to.have.property("name")
            expect(el).to.have.property("latitude")
            expect(el).to.have.property("longitude")
            expect(el).to.have.property("address")
            expect(el).to.have.property("address")
        })
    })

    it("should return a user with a 200 status code", async () => {
        const res = await request(app)
        .get(`/routes/${tripId}`)
        console.log(res);
    })


    // it("should return a 500 status code and and error message", async () => {
    //     const res = await request(app).get("/routes")
    //     console.log(res, "ini res");
    // })

})
