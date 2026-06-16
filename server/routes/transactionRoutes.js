const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
