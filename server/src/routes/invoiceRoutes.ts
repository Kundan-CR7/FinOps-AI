import { Router } from "express";
import multer from "multer";
import { InvoiceController } from "../controllers/InvoiceController";
import { InvoiceService } from "../services/InvoiceService";
import { PrismaInvoiceRepository } from "../repositories/PrismaInvoiceRepository";
import { DocumentExtractionService } from "../services/DocumentExtractionService";
import { ExtractionController } from "../controllers/ExtractionController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router()
const upload = multer({ storage: multer.memoryStorage()})

const invoiceRepo = new PrismaInvoiceRepository()
const invoiceService = new InvoiceService(invoiceRepo)
const invoiceController = new InvoiceController(invoiceService)

const extractionService = new DocumentExtractionService()
const extractionController = new ExtractionController(extractionService, invoiceService)

router.use(requireAuth);

router.post("/upload",(req,res) => (
    invoiceController.upload(req,res)
))

router.get("/", (req,res) => (
    invoiceController.getAll(req,res)
))

router.post("/extract", upload.single("document"), (req, res) => (
    extractionController.extract(req, res)
))

export default router


