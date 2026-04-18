import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";
import { TransactionService } from "../services/TransactionService";
import { PrismaTransactionRepository } from "../repositories/PrismaTransactionRepository";

const router = Router()

//Dependency Injection
const transactionRepo = new PrismaTransactionRepository()
const transactionService = new TransactionService(transactionRepo)
const transactionController = new TransactionController(transactionService)

router.post("/upload",(req,res) => (
    transactionController.upload(req,res)
))

export default router