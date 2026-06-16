const express = require("express");
const router = express.Router();
const {
  getOverview,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAllTransactions,
  getAnalytics,
} = require("../controllers/adminController");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.use(authenticate, requireAdmin);

router.get("/overview", getOverview);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/transactions", getAllTransactions);
router.get("/analytics", getAnalytics);

module.exports = router;
