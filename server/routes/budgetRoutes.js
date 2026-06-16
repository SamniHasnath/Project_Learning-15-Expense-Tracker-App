const express = require("express");
const router = express.Router();
const { getBudgets, upsertBudget, deleteBudget } = require("../controllers/budgetController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/", getBudgets);
router.post("/", upsertBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
