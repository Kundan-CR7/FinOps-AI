import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";
import { TransactionService } from "../services/TransactionService";
import { PrismaTransactionRepository } from "../repositories/PrismaTransactionRepository";

import { requireAuth } from "../middleware/authMiddleware";

const router = Router()

//Dependency Injection
const transactionRepo = new PrismaTransactionRepository()
const transactionService = new TransactionService(transactionRepo)
const transactionController = new TransactionController(transactionService)

router.use(requireAuth);

router.post("/upload",(req,res) => (
    transactionController.upload(req,res)
))

router.get("/", (req,res) => (
    transactionController.getAll(req,res)
))

router.get("/statements", (req,res) => {
    transactionController.getUserStatements(req,res)
})

export default router