require("dotenv").config({ path: ".env.test" });

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const ServiceProvider = require("../model/ServiceProvider");
const User = require("../model/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { expect } = chai;
chai.use(chaiHttp);

let serviceProviderId;
let userId;
let authToken;

describe("Service Provider API Tests", function () {
    before(async function () {
        this.timeout(10000); // Ensure enough time for database connection

        if (!process.env.LOCAL_DATABASE_URI) {
            throw new Error("LOCAL_DATABASE_URI is not defined in .env.test");
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.LOCAL_DATABASE_URI);
        }

        await ServiceProvider.deleteMany({});
        await User.deleteMany({});

        // ✅ Create a test user
        const testUser = new User({
            name: "Service Provider User",
            email: "provider@example.com",
            phone_number: "9876543210",
            role: "Service Provider",
            password: "hashedpassword"
        });

        await testUser.save();
        userId = testUser._id.toString();

        // ✅ Generate an authentication token
        authToken = jwt.sign(
            { id: userId, role: "Service Provider" },
            "3e4e2edff417b77fd9d27502ccb53e329c43c0976405f9858a50bbc79752b77c",
            { expiresIn: "1d" }
        );

        // ✅ Create a service provider
        const testProvider = new ServiceProvider({
            userId,
            name: "Test Provider",
            email: "provider@example.com",
            phoneNumber: "9876543210",
            bio: "Test bio",
            location: "Test Location",
            skills: ["Plumbing", "Electrician"],
            profileImage: "testimage.jpg"
        });

        await testProvider.save();
        serviceProviderId = testProvider._id.toString();
    });

    after(async function () {
        this.timeout(10000);
        await ServiceProvider.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it("should GET all service providers", function (done) {
        chai.request(app)
            .get("/api/provider")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("providers");
                expect(res.body.providers).to.be.an("array");
                expect(res.body.providers.length).to.be.greaterThan(0);
                done();
            });
    });



    it("should return 404 if service provider profile does not exist", function (done) {
        const fakeId = new mongoose.Types.ObjectId().toString();
        chai.request(app)
            .get(`/api/provider/profile/${fakeId}`)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property("message").equal("Service provider profile not found");
                done();
            });
    });

    it("should UPDATE a service provider profile", function (done) {
        chai.request(app)
            .put(`/api/provider/${userId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                name: "Updated Provider",
                bio: "Updated bio",
                phoneNumber: "1234567890",
                location: "Updated Location",
                skills: "Carpentry, Painting"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("message").equal("Profile updated successfully");
                expect(res.body.provider).to.have.property("name").equal("Updated Provider");
                expect(res.body.provider).to.have.property("bio").equal("Updated bio");
                expect(res.body.provider).to.have.property("phoneNumber").equal("1234567890");
                expect(res.body.provider).to.have.property("location").equal("Updated Location");
                done();
            });
    });
});


