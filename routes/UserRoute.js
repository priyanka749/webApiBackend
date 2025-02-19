
// const router = express.Router();

// router.get("/", findAll);
// router.post("/", save);
// router.get("/:id", findById);
// router.put("/:id", update);
// router.delete("/:id", deleteById);

// module.exports = router;



const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/AuthMiddleware");

const upload = require("../middleware/uploads");

const {
  getuser,

  register,
  login,
  updateuser,
  deleteuser,
  uploadImage,
  getMe,
} = require("../controller/usercontroller");


router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.get("/getAlluser", protect, getuser);
router.get("/getuser/:id", protect, getuser);
router.put("/updateuser/:id", protect, updateuser);

router.delete("/deleteuser/:id", protect, deleteuser);
router.get("/getMe", protect, getMe);

module.exports = router;
