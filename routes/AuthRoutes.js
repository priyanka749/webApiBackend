const express = require("express");
const { register, verifyOtp, login, getUserIdFromToken} = require("../controller/AuthController");
const multer = require("multer");
const { authenticateToken } = require("../security/Auth");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("image"), register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/get-user-profile",authenticateToken, getUserIdFromToken);



module.exports = router;
