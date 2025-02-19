const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: { 
    type: String },
  
  
  role: {
    type: String,
    enum: ["Customer", "Service Provider"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema); // Changed from "users" to "User"
module.exports = User;


// Encrypt password using bcrypt
// studentSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   });
  
//   // Sign JWT and return
//   studentSchema.methods.getSignedJwtToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRE,
//       //expiresIn: 5,
//     });
//   };
  
//   // Match user entered password to hashed password in database
//   Schema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
//   };
  
//   // Generate and hash password token
//   studentSchema.methods.getResetPasswordToken = function () {
//     // Generate token
//     const resetToken = crypto.randomBytes(20).toString("hex");
  
//     // Hash token and set to resetPasswordToken field
//     this.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
  
//     // Set expire
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
//     return resetToken;
//   };
  
//   module.exports = mongoose.model("Student", studentSchema);
  