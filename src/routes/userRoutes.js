const express = require("express");
const {
  createUser,
  getUsers,
  updateUserStatus,
  getUserById,
  updateUserRole,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("admin"), createUser);
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getUserById);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserStatus,
);
router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserRole,
);

module.exports = router;
