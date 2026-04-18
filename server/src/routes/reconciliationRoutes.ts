import { Router } from "express";
import { PrismaTransactionRepository } from "../repositories/PrismaTransactionRepository";
import { PrismaInvoiceRepository } from "../repositories/PrismaInvoiceRepository";
import { ExactMatchStrategy } from "../services/reconciliation/ExactlyMatchStrategy";
import { ReconciliationEngine } from "../services/reconciliation/ReconciliationEngine";
import { ReconciliationController } from "../controllers/ReconciliationController";

const router = Router()

//Dependency Injection
const transactionRepo = new PrismaTransactionRepository()
const invoiceRepo = new PrismaInvoiceRepository()

const strategies = [new ExactMatchStrategy()]
const engine = new ReconciliationEngine(transactionRepo, strategies)
const reconciliationController = new ReconciliationController(engine, invoiceRepo, transactionRepo)

router.post("/run",(req,res) => (
    reconciliationController.runReconciliation(req,res)
))

export default router
