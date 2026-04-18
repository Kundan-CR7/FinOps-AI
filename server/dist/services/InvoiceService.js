"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const Invoice_1 = require("../domain/Invoice");
const InvoiceItem_1 = require("../domain/InvoiceItem");
class InvoiceService {
    invoiceRepo;
    constructor(invoiceRepo) {
        this.invoiceRepo = invoiceRepo;
    }
    async processNewInvoice(payload) {
        const invoice = new Invoice_1.Invoice(payload.id, payload.userId, payload.vendorGstin, payload.totalAmount, new Date(payload.invoiceDate));
        for (const itemPayload of payload.items) {
            const item = new InvoiceItem_1.InvoiceItem(itemPayload.id, itemPayload.description, itemPayload.hsnCode, itemPayload.amount, itemPayload.gstRate);
            invoice.addItem(item);
        }
        invoice.process();
        await this.invoiceRepo.save(invoice);
        return invoice;
    }
    async getUserInvoices(userId) {
        return await this.invoiceRepo.findByUser(userId);
    }
}
exports.InvoiceService = InvoiceService;
