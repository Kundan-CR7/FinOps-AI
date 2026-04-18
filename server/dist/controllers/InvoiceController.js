"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
class InvoiceController {
    invoiceService;
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async upload(req, res) {
        try {
            const invoice = await this.invoiceService.processNewInvoice(req.body);
            res.status(201).json({
                message: "Invoice processed successfully",
                data: {
                    id: invoice.getId(),
                    status: invoice.getStatus(),
                    isFlagged: invoice.getStatus() === "FLAGGED"
                }
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const invoices = await this.invoiceService.getUserInvoices(userId);
            // Map domain models to raw objects for JSON
            const data = invoices.map(inv => ({
                id: inv.getId(),
                vendorGstin: inv.getVendorGstin(),
                totalAmount: inv.getTotalAmount(),
                invoiceDate: inv.getInvoiceDate(),
                status: inv.getStatus(),
                items: inv.getItems().map(item => ({
                    id: item.getId(),
                    description: item.getDescription(),
                    amount: item.getAmount(),
                    gstRate: item.getGstRate()
                }))
            }));
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.InvoiceController = InvoiceController;
