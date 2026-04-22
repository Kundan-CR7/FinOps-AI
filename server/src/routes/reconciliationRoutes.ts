import { Router } from "express";
import { PrismaTransactionRepository } from "../repositories/PrismaTransactionRepository";
import { PrismaInvoiceRepository } from "../repositories/PrismaInvoiceRepository";
import { ExactMatchStrategy } from "../services/reconciliation/ExactlyMatchStrategy";
import { SumMatchStrategy } from "../services/reconciliation/SumMatchStrategy";
import { ReconciliationEngine } from "../services/reconciliation/ReconciliationEngine";
import { ReconciliationController } from "../controllers/ReconciliationController";
import { NotificationService } from "../services/NotificationService";
import { AlertRepository } from "../repositories/AlertRepository";

import { requireAuth } from "../middleware/authMiddleware";

const router = Router()

//Dependency Injection
const transactionRepo = new PrismaTransactionRepository()
const invoiceRepo = new PrismaInvoiceRepository()
const alertRepo = new AlertRepository()
const notificationService = new NotificationService(alertRepo)

const strategies = [new ExactMatchStrategy(), new SumMatchStrategy()]
const engine = new ReconciliationEngine(transactionRepo, strategies, notificationService)
const reconciliationController = new ReconciliationController(engine, invoiceRepo, transactionRepo)

router.use(requireAuth);

router.post("/run", (req, res) => (
    reconciliationController.runReconciliation(req, res)
))

export default router
