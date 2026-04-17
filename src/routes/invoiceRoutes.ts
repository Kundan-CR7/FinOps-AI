import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { InvoiceService } from "../services/InvoiceService";
import { PrismaInvoiceRepository } from "../repositories/PrismaInvoiceRepository";

const router = Router()

const invoiceRepo = new PrismaInvoiceRepository()
const invoiceService = new InvoiceService(invoiceRepo)
const invoiceController = new InvoiceController(invoiceService)

router.post("/upload",(req,res) => (
    invoiceController.upload(req,res)
))

export default router


