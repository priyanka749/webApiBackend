const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, update } = require("../controller/UserController");

router.get("/", findAll);
router.post("/", save);
router.get("/:id", findById);
router.put("/:id", update);
router.delete("/:id", deleteById);

module.exports = router;
