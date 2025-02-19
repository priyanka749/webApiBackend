const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");
const TempUser = require("../model/TempUser");
const User = require("../model/User");
const Customer = require("../model/Customer");
const ServiceProvider = require("../model/ServiceProvider");


const SECRET_KEY = "3e4e2edff417b77fd9d27502ccb53e329c43c0976405f9858a50bbc79752b77c";


// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Registration Function
const register = async (req, res) => {
  console.log("register api hit");
  try {
    const { name, email, phone_number, password, role, location, bio, skills } = req.body;

    if (!email || !phone_number || !password || !role) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const existingTempUser = await TempUser.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingTempUser || existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes


          // Handle profile  profileImage (if uploaded)
          let profileImage = null;
          if (req.file) {
              profileImage = req.file.path; // Cloudinary returns the URL of the uploaded  profileImage
          }
          
    const tempUser = new TempUser({
      name,
      email,
      phone_number,
      password: hashedPassword,
      role,
      location,
      profileImage,
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
  
      if (tempUser.otp !== otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      if (tempUser.otpExpiresAt < Date.now()) {
        return res.status(400).json({ message: "OTP has expired" });
      }
  
      const { name, phone_number, password, role, location,  profileImage, bio, skills } = tempUser;
  
      const newUser = new User({
        email,
        phone_number,
        password,  // Already hashed
        role,
         profileImage,
      });
      await newUser.save();
       // Role-specific handling
        if (role === "Customer") {
            const newCustomer = new Customer({
                userId: newUser._id,
                name,
               profileImage,
                phone_number,
                location,
            });
            await newCustomer.save();
          } else if (role === "Service Provider") {
        const newServiceProvider = new ServiceProvider({
          userId: newUser._id,
          email,  // Ensure you pass the email here
          name,
          phoneNumber: phone_number || "",
          profileImage,
          bio,
          location,
          skills,
        });
        await newServiceProvider.save();
        console.log("New service provider created:", newServiceProvider);
      }
  
      await TempUser.deleteOne({ email });
      res.status(200).json({ message: "OTP verified successfully. Registration complete." });
    } catch (error) {
      console.error("Error during OTP verification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Extract user ID from JWT token via POST request
const getUserIdFromToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(200).json({ userId: decoded.userId });
  } catch (error) {
    console.error("Error extracting userId from token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req, res) => {
  console.log("login API hit");
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

    // ✅ Ensure token is generated before using it
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

    console.log("User found:", user); // Debugging

    res.status(200).json({ 
      message: "Login successful", 
      token,        // ✅ Send the token properly
      userId: user._id,  
      name: user.name
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { register, verifyOtp, login , getUserIdFromToken};
