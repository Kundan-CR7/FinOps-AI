import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { ReportService } from "../services/ReportService";
import { FilingService } from "../services/FilingService";
import { TaxEngine } from "../services/TaxEngine";
import { TaxRuleRepository } from "../repositories/TaxRuleRepository";
import { AuditLogRepository } from "../repositories/AuditLogRepository";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

// Dependency Injection
const taxRuleRepo = new TaxRuleRepository();
const auditLogRepo = new AuditLogRepository();
const taxEngine = new TaxEngine(taxRuleRepo);
const reportService = new ReportService(taxEngine);
const filingService = new FilingService(auditLogRepo);
const reportController = new ReportController(reportService, filingService);

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.post("/gstr1", (req, res) => (
    reportController.generateGSTR1(req, res)
));

router.post("/file", (req, res) => (
    reportController.fileReturn(req, res)
));

export default router;
