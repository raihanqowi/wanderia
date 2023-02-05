const chai = require("chai");
const { ObjectId } = require("mongodb");
const expect = chai.expect;
const request = require("supertest");
const app = require("../../app");
const { runConnection, getDatabase } = require("../../config/mongodb");

let userIdDuringTesting;

describe("Test GET /users endpoint", () => {
  it("should return an array of users with a 200 status code", async () => {
    const res = await request(app).get("/users/");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body[0]).to.have.property("_id");
    expect(res.body[0]).to.have.property("name");
    expect(res.body[0]).to.have.property("email");
    expect(res.body[0]).to.not.have.property("password");
    expect(res.body[0]).to.have.property("dateOfBirth");
    expect(res.body[0]).to.have.property("createdAt");
    expect(res.body[0]).to.have.property("updatedAt");
  });
});

describe("Test GET /users/:id endpoint", () => {
  it("should return a user object with a 200 status code", async () => {
    const res = await request(app).get("/users/63da8d0c624ef9527e594d1f");
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("_id", "63da8d0c624ef9527e594d1f");
    expect(res.body).to.have.property("name", "Lina");
    expect(res.body).to.have.property("email", "herlinalim93@gmail.com");
    expect(res.body).to.not.have.property("password");
    expect(res.body).to.have.property("dateOfBirth");
    expect(res.body).to.have.property("createdAt");
    expect(res.body).to.have.property("updatedAt");
  });
});

describe("Test POST /users endpoint", () => {
  it("should create a user and return with 201 status code and the created user data", async () => {
    const res = await request(app).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
      phoneNumber: "1234567890",
      address: "123 Main St",
      dateOfBirth: "2000-01-01",
    });
    userIdDuringTesting = res.body._id;
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("_id");
    expect(res.body).to.have.property("name", "John Doe");
    expect(res.body).to.have.property("email", "johndoe@example.com");
    expect(res.body).to.not.have.property("password");
    expect(res.body).to.have.property("dateOfBirth", "2000-01-01");
    expect(res.body).to.have.property("createdAt");
    expect(res.body).to.have.property("updatedAt");
  });

  it("should return a 409 status code and an error message if the email is duplicated", async () => {
    const res = await request(app).post("/users").send({
      name: "Jane Doe",
      email: "johndoe@example.com",
      password: "password",
      phoneNumber: "0987654321",
      address: "456 Main St",
      dateOfBirth: "1998-01-01",
    });

    expect(res.statusCode).to.equal(409);
    // expect(res.body).to.have.property("message", "Email already exists");
  });
});

describe("Test DELETE /users/:id endpoint", () => {
  it("should failed to delete by returning a 404 status code if the user is not found", async () => {
    const res = await request(app).delete("/users/63da8d0c624ef9527e594d1a");
    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property("code", 404);
    expect(res.body).to.have.property("message", "Not found");
  });
  it("should successfully delete a user and return a 200 status code", async () => {
    const deleteRes = await request(app).delete(
      `/users/${userIdDuringTesting}`
    );
    expect(deleteRes.statusCode).to.equal(200);
  });
});
