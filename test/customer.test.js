require("dotenv").config({ path: ".env.test" });

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Customer = require("../model/Customer");
const User = require("../model/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { expect } = chai;
chai.use(chaiHttp);

let customerId;
let userId;
let authToken;

describe("Customer API Tests", function () {
    before(async function () {
        this.timeout(10000); // Ensure enough time for database connection

        if (!process.env.LOCAL_DATABASE_URI) {
            throw new Error("LOCAL_DATABASE_URI is not defined in .env.test");
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.LOCAL_DATABASE_URI);
        }

        await Customer.deleteMany({});
        await User.deleteMany({});

        // ✅ Create a test user
        const testUser = new User({
            name: "Customer User",
            email: "customer@example.com",
            phone_number: "9876543210",
            role: "Customer",
            password: "hashedpassword"
        });

        await testUser.save();
        userId = testUser._id.toString();

        // ✅ Generate an authentication token
        authToken = jwt.sign(
            { id: userId, role: "Customer" },
            "3e4e2edff417b77fd9d27502ccb53e329c43c0976405f9858a50bbc79752b77c",
            { expiresIn: "1d" }
        );

        // ✅ Create a customer
        const testCustomer = new Customer({
            userId,
            name: "Test Customer",
            email: "customer@example.com",
            phoneNumber: "9876543210",
            location: "Test Location",
            profileImage: "testimage.jpg"
        });

        await testCustomer.save();
        customerId = testCustomer._id.toString();
    });

    after(async function () {
        this.timeout(10000);
        await Customer.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it("should GET all customers", function (done) {
        chai.request(app)
            .get("/api/customers")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });

    it("should GET a customer profile by ID", function (done) {
        chai.request(app)
            .get(`/api/customers/profile/${customerId}`)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("id").equal(customerId);
                expect(res.body).to.have.property("name").equal("Test Customer");
                expect(res.body).to.have.property("email").equal("customer@example.com");
                expect(res.body).to.have.property("phoneNumber").equal("9876543210");
                done();
            });
    });

    it("should return 404 if customer profile does not exist", function (done) {
        const fakeId = new mongoose.Types.ObjectId().toString();
        chai.request(app)
            .get(`/api/customers/profile/${fakeId}`)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property("message").equal("Customer not found.");
                done();
            });
    });

    it("should return 400 for invalid customer ID format", function (done) {
        chai.request(app)
            .get(`/api/customers/profile/invalidID`)
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("message").equal("Invalid ID format.");
                done();
            });
    });

    it("should UPDATE a customer profile", function (done) {
        chai.request(app)
            .put(`/api/customers/profile/${userId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: "Updated Customer",
                phoneNumber: "1234567890",
                location: "Updated Location"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("message").equal("Profile updated successfully!");
                expect(res.body.customer).to.have.property("name").equal("Updated Customer");
                expect(res.body.customer).to.have.property("phoneNumber").equal("1234567890");
                expect(res.body.customer).to.have.property("location").equal("Updated Location");
                done();
            });
    });

});
