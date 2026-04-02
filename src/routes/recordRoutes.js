const express = require("express");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  getRecordById,
} = require("../controllers/recordController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("admin"), createRecord);
router.get("/", authMiddleware, roleMiddleware("admin", "analyst"), getRecords);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  getRecordById,
);
router.patch("/:id", authMiddleware, roleMiddleware("admin"), updateRecord);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteRecord);

module.exports = router;
