"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionController = void 0;
const crypto_1 = require("crypto");
class ExtractionController {
    extractionService;
    invoiceService;
    constructor(extractionService, invoiceService) {
        this.extractionService = extractionService;
        this.invoiceService = invoiceService;
    }
    async extract(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No document uploaded" });
                return;
            }
            const extractedJson = await this.extractionService.extractInvoiceData(req.file.buffer, req.file.mimetype);
            // Map extracted AI data to our expected domain payload format
            const payload = {
                id: (0, crypto_1.randomUUID)(),
                userId: req.user.id,
                vendorGstin: extractedJson.vendorGstin || "UNKNOWN",
                totalAmount: extractedJson.totalAmount || 0,
                invoiceDate: extractedJson.invoiceDate || new Date().toISOString(),
                items: (extractedJson.items || []).map((i) => ({
                    id: (0, crypto_1.randomUUID)(),
                    description: i.description || "Unknown item",
                    hsnCode: i.hsnCode || "0000",
                    amount: i.amount || 0,
                    gstRate: i.gstRate || 0
                }))
            };
            // Persist securely to DB
            const savedInvoice = await this.invoiceService.processNewInvoice(payload);
            res.status(200).json({
                message: "Extraction and Save successful",
                data: {
                    id: savedInvoice.getId(),
                    vendorGstin: savedInvoice.getVendorGstin(),
                    totalAmount: savedInvoice.getTotalAmount(),
                    status: savedInvoice.getStatus(),
                    invoiceDate: savedInvoice.getInvoiceDate()
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: String(error.message || error) });
        }
    }
}
exports.ExtractionController = ExtractionController;
