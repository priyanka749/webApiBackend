require("dotenv").config({ path: ".env.test" });

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../model/User");
const TempUser = require("../model/TempUser");
const Customer = require("../model/Customer");
const ServiceProvider = require("../model/ServiceProvider");
const mongoose = require("mongoose");

const { expect } = chai;
chai.use(chaiHttp);

let testUser = {
    name: "Test User",
    email: "testuser@example.com",
    phone_number: "1234567890",
    password: "testpassword",
    role: "Customer",
    location: "Test Location"
};

let otp;
let token;
let userId;

describe("Auth API Tests", function () {
    before(async function () {
        this.timeout(10000);

        if (!process.env.LOCAL_DATABASE_URI) {
            throw new Error("LOCAL_DATABASE_URI is not defined in .env.test");
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.LOCAL_DATABASE_URI);
        }

        await User.deleteMany({});
        await TempUser.deleteMany({});
        await Customer.deleteMany({});
        await ServiceProvider.deleteMany({});
    });

    after(async function () {
        this.timeout(10000);
        await User.deleteMany({});
        await TempUser.deleteMany({});
        await Customer.deleteMany({});
        await ServiceProvider.deleteMany({});
        await mongoose.connection.close();
    });

    // ✅ 1. User Registration
    it("should register a new user and send OTP", function (done) {
        chai.request(app)
            .post("/api/auth/register")
            .send(testUser)
            .end(function (err, res) {
                console.log("Registration Response:", res.body);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("message").equal("OTP sent to your email. Please verify to complete registration.");
                done();
            });
    });

    // ✅ 2. Fetch OTP for verification
    it("should retrieve the OTP from the database", async function () {
        const tempUser = await TempUser.findOne({ email: testUser.email });
        expect(tempUser).to.exist;
        otp = tempUser.otp;
        expect(otp).to.exist;
    });

    // ✅ 3. OTP Verification
    it("should verify OTP and complete registration", function (done) {
        chai.request(app)
            .post("/api/auth/verify-otp")
            .send({ email: testUser.email, otp })
            .end(function (err, res) {
                console.log("OTP Verification Response:", res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("message").equal("OTP verified successfully. Registration complete.");
                done();
            });
    });

    // ✅ 4. Login
    it("should login with valid credentials", function (done) {
        chai.request(app)
            .post("/api/auth/login")
            .send({ email: testUser.email, password: testUser.password })
            .end(function (err, res) {
                console.log("Login Response:", res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("message").equal("Login successful");
                expect(res.body).to.have.property("token");
                expect(res.body).to.have.property("userId");
                expect(res.body).to.have.property("name").equal(testUser.name);
                expect(res.body).to.have.property("role").equal(testUser.role);
                token = res.body.token;
                userId = res.body.userId;
                done();
            });
    });
   
    
    });
