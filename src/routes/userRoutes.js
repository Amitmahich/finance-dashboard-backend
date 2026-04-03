const express = require("express");
const {
  createUser,
  getUsers,
  updateUserStatus,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("admin"), createUser);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);
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
