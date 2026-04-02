const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");
const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  getDashboardSummary,
);

module.exports = router;
