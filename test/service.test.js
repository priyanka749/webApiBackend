require("dotenv").config({ path: ".env.test" });

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Service = require("../model/Service");
const ServiceProvider = require("../model/ServiceProvider");
const User = require("../model/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { expect } = chai;
chai.use(chaiHttp);

let serviceId;
let providerId;
let userId;
let authToken;

describe("Service API Tests", function () {
    before(async function () {
        this.timeout(10000); // Ensure enough time for database connection

        if (!process.env.LOCAL_DATABASE_URI) {
            throw new Error("LOCAL_DATABASE_URI is not defined in .env.test");
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.LOCAL_DATABASE_URI);
        }

        await Service.deleteMany({});
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
            skills: ["Plumbing", "Electrician"]
        });

        await testProvider.save();
        providerId = testProvider._id.toString();

        // ✅ Create a service
        const testService = new Service({
            userId,
            title: "Test Service",
            description: "Test service description",
            skills: ["Plumbing", "Electrician"],
            image: "testimage.jpg"
        });

        await testService.save();
        serviceId = testService._id.toString();
    });

    after(async function () {
        this.timeout(10000);
        await Service.deleteMany({});
        await ServiceProvider.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it("should ADD a new service", function (done) {
        chai.request(app)
            .post("/api/services/add")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userId,
                title: "New Test Service",
                description: "New service description",
                skills: "Carpentry, Painting"
            })
            .end(function (err, res) {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("message").equal("Service added successfully");
                expect(res.body.service).to.have.property("title").equal("New Test Service");
                expect(res.body.service).to.have.property("description").equal("New service description");
                done();
            });
    });

    it("should GET all services", function (done) {
        chai.request(app)
            .get("/api/services")
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });

    it("should return 404 if no services exist", async function () {
        await Service.deleteMany({}); // Clear all services
        const res = await chai.request(app).get("/api/services");
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message").equal("No services found");
    });

    it("should GET services for a provider", async function () {
        // ✅ Add a test service again
        const testService = new Service({
            userId,
            title: "Test Service for Provider",
            description: "Service for provider",
            skills: ["Plumbing"],
            image: "testimage.jpg"
        });
        await testService.save();

        const res = await chai.request(app).get(`/api/services/${userId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
    });

    it("should return 404 if no services exist for provider", async function () {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await chai.request(app).get(`/api/services/${fakeId}`);
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message").equal("No services found for this provider");
    });

});
