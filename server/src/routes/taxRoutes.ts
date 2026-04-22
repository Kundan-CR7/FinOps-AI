import { Router } from "express";
import { TaxController } from "../controllers/TaxController";
import { TaxEngine } from "../services/TaxEngine";
import { TaxRuleRepository } from "../repositories/TaxRuleRepository";
import { PrismaInvoiceRepository } from "../repositories/PrismaInvoiceRepository";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Dependency Injection
const taxRuleRepo = new TaxRuleRepository();
const invoiceRepo = new PrismaInvoiceRepository();
const taxEngine = new TaxEngine(taxRuleRepo);
const taxController = new TaxController(taxEngine, taxRuleRepo, invoiceRepo);

router.use(requireAuth);

router.get("/calculate/:invoiceId", (req, res) => (
    taxController.calculateTax(req, res)
));

router.get("/compliance/:invoiceId", (req, res) => (
    taxController.checkCompliance(req, res)
));

router.get("/rules", (req, res) => (
    taxController.getRules(req, res)
));

router.post("/rules", (req, res) => (
    taxController.createRule(req, res)
));

export default router;
