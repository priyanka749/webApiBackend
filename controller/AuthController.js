// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { sendEmail } = require("../utils/emailService");
// const TempUser = require("../model/TempUser");
// const User = require("../model/User");
// const Customer = require("../model/Customer");
// const ServiceProvider = require("../model/ServiceProvider");

// const SECRET_KEY = "c597cfe12544544faa9f04ef0860c5882dd30a5dbd65b567c6a511504823cdd5";

// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const register = async (req, res) => {
//     console.log("register api hit");
//     try {
//         const { name, email, phone_number, password, role, location, bio, skills } = req.body;

//         const existingTempUser = await TempUser.findOne({ email });
//         const existingUser = await User.findOne({ email });
//         const existingPhone = await User.findOne({ phone_number });
//         if (existingTempUser || existingUser || existingPhone) {
//             return res.status(400).json({ message: "User with Email or Phone Number already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const otp = generateOTP();
//         const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
//        // Handle profile image (if uploaded)
//        let profileImage = null;
//        if (req.file) {
//            profileImage = req.file.path; // Cloudinary returns the URL of the uploaded image
//        }

//         const tempUser = new TempUser({
//             name,
//             email,
//             phone_number,
//             password: hashedPassword,
//             role,
//             location,
//             image: profileImage,
//             bio,
//             skills,
//             otp,
//             otpExpiresAt,
//         });
//         console.log("Attempting to Register",tempUser);
//         await tempUser.save();

//         const htmlContent = `
//         <html>
//         <body>
//             <h1>Confirm your email address!</h1>
//             <p>Hi ${name},</p>
//             <p>Your OTP is: <strong>${otp}</strong></p>
//             <p>This code will expire in 5 minutes.</p>
//         </body>
//         </html>
//         `;

//         await sendEmail(email, "Verify Your Email", "Your OTP is ready.", htmlContent);

//         res.status(201).json({ message: "OTP sent to your email. Please verify to complete registration." });
//     } catch (error) {
//         console.error("Error during registration:", error);
//         res.status(500).json({ message: error.message });
//     }
// };




// const verifyOtp = async (req, res) => {
    
//     try {
//         const { email, otp } = req.body;
//         // Find the user in tempUsers
//         const tempUser = await TempUser.findOne({ email });
//         if (!tempUser) {
//             return res.status(404).json({ message: "User not registered or already verified" });
//         }


//         // Check OTP validity
//         if (tempUser.otp !== otp) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }
//         if (tempUser.otpExpiresAt < Date.now()) {
//             return res.status(400).json({ message: "OTP has expired" });
//         }

//         // Move the user to the users collection
//         const { name, phone_number, password, role, location, image, bio, skills } = tempUser;
//         const newUser = new User({ email, phone_number, password, role });
//         await newUser.save();

//         // Role-specific logic
//         if (role === "Customer") {
//             const newCustomer = new Customer({
//                 userid: newUser._id,
//                 name,
//                 image,
//                 location,
//             });
//             await newCustomer.save();
//         } else if (role === "Service Provider") {
//             const newServiceProvider = new ServiceProvider({
//                 userId: newUser._id,
//                 image,
//                 bio,
//                 location,
//                 skills,
//             });

//             console.log("new service provider:", newServiceProvider);
//             await newServiceProvider.save();
//         }

//         // Delete the user from tempUsers
//         await TempUser.deleteOne({ email });

//         res.status(200).json({ message: "OTP verified successfully. Registration complete." });
//     } catch (error) {
//         console.error("Error during OTP verification:", error);
//         res.status(500).json({ message: error.message });
//     }
// };


// // Login Function
// const login = async (req, res) => {
//     console.log("login api hit");
//     try {
//         const { email, password } = req.body;
 
//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if the password is correct
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate a token
//         const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

//         res.status(200).json({ message: "Login successful", token, user });
//     } catch (error) {
//         console.error("Error during login:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = { verifyOtp, register, login };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");
const TempUser = require("../model/TempUser");
const User = require("../model/User");
const Customer = require("../model/Customer");
const ServiceProvider = require("../model/ServiceProvider");

const SECRET_KEY = "c597cfe12544544faa9f04ef0860c5882dd30a5dbd65b567c6a511504823cdd5";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Registration Function
const register = async (req, res) => {
    console.log("register api hit");
    try {
        const { name, email, phone_number, password, role, location, bio, skills } = req.body;

        if (!email || !phone_number || !password || !role) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const existingTempUser = await TempUser.findOne({ $or: [{ email }, { phone_number }] });
        const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });

        if (existingTempUser || existingUser) {
            return res.status(400).json({ message: "User with this email or phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        let profileImage = req.file ? req.file.path : null;

        const tempUser = new TempUser({
            name,
            email,
            phone_number,
            password: hashedPassword,
            role,
            location,
            image: profileImage,
            bio,
            skills,
            otp,
            otpExpiresAt,
        });

        console.log("Attempting to Register", tempUser);
        await tempUser.save();

        const htmlContent = `
        <html>
        <body>
            <h1>Confirm your email address!</h1>
            <p>Hi ${name},</p>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This code will expire in 5 minutes.</p>
        </body>
        </html>
        `;

        await sendEmail(email, "Verify Your Email", "Your OTP is ready.", htmlContent);
        res.status(201).json({ message: "OTP sent to your email. Please verify to complete registration." });

    } catch (error) {
        console.error("Error during registration:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate entry for email or phone number" });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

// OTP Verification Function
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const tempUser = await TempUser.findOne({ email });

        if (!tempUser) {
            return res.status(404).json({ message: "User not registered or already verified" });
        }

        if (tempUser.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (tempUser.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        const { name, phone_number, password, role, location, image, bio, skills } = tempUser;
        const newUser = new User({ email, phone_number, password, role });
        await newUser.save();

        if (role === "Customer") {
            const newCustomer = new Customer({
                userid: newUser._id,
                name,
                image,
                location,
            });
            await newCustomer.save();
        } else if (role === "Service Provider") {
            const newServiceProvider = new ServiceProvider({
                userId: newUser._id,
                image,
                bio,
                location,
                skills,
            });
            console.log("new service provider:", newServiceProvider);
            await newServiceProvider.save();
        }

        await TempUser.deleteOne({ email });

        res.status(200).json({ message: "OTP verified successfully. Registration complete." });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login Function
const login = async (req, res) => {
    console.log("login api hit");
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, verifyOtp, login };
