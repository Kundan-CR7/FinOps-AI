"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransactionController_1 = require("../controllers/TransactionController");
const TransactionService_1 = require("../services/TransactionService");
const PrismaTransactionRepository_1 = require("../repositories/PrismaTransactionRepository");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
//Dependency Injection
const transactionRepo = new PrismaTransactionRepository_1.PrismaTransactionRepository();
const transactionService = new TransactionService_1.TransactionService(transactionRepo);
const transactionController = new TransactionController_1.TransactionController(transactionService);
router.use(authMiddleware_1.requireAuth);
router.post("/upload", (req, res) => (transactionController.upload(req, res)));
router.get("/", (req, res) => (transactionController.getAll(req, res)));
router.get("/statements", (req, res) => {
    transactionController.getUserStatements(req, res);
});
exports.default = router;
