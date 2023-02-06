const chai = require("chai");
const { ObjectId } = require("mongodb");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app");
const { clientDB, connectDB, getClient } = require("../configs/mongoDb");
// await connectDB()

beforeAll(async () => {
     await connectDB()
})

afterAll(async () => {
    const client = getClient()
    // console.log(client, "ini test after");
    client.close()
})

describe("Test GET /routes endpoint", () => {
    it("should return an array of users with a 200 status code", async () => {
       
        const res = await request(app).get("/routes")
        console.log(res);
        
        // console.log(res);
        // expect(res.statusCode).to.equal(200);
        // let db = clientDB()
        // console.log(db, "INI DB");
        // console.log(res.body, "INI BODY")
        // console.log(res, "ini res");
        
    })
})