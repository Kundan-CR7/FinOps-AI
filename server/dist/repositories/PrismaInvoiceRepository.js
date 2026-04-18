"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaInvoiceRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const Invoice_1 = require("../domain/Invoice");
const InvoiceItem_1 = require("../domain/InvoiceItem");
class PrismaInvoiceRepository {
    async save(invoice) {
        const itemsToSave = invoice.getItems().map(item => ({
            id: item.getId(),
            description: item.getDescription(),
            hsnCode: item.getHsnCode(),
            amount: item.getAmount(),
            gstRate: item.getGstRate()
        }));
        await prisma_1.default.invoice.upsert({
            where: { id: invoice.getId() },
            update: {
                status: invoice.getStatus()
            },
            create: {
                id: invoice.getId(),
                userId: invoice.getUserId(),
                vendorGstin: invoice.getVendorGstin(),
                totalAmount: invoice.getTotalAmount(),
                status: invoice.getStatus(),
                invoiceDate: invoice.getInvoiceDate(),
                items: {
                    create: itemsToSave
                }
            }
        });
    }
    async findById(id) {
        const raw = await prisma_1.default.invoice.findUnique({
            where: { id },
            include: { items: true }
        });
        if (!raw)
            return null;
        const invoice = new Invoice_1.Invoice(raw.id, raw.userId, raw.vendorGstin, Number(raw.totalAmount), raw.invoiceDate, raw.status);
        for (const item of raw.items) {
            invoice.addItem(new InvoiceItem_1.InvoiceItem(item.id, item.description, item.hsnCode, Number(item.amount), Number(item.gstRate)));
        }
        return invoice;
    }
    async findByUser(userId) {
        const raws = await prisma_1.default.invoice.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
        return raws.map((raw) => {
            const invoice = new Invoice_1.Invoice(raw.id, raw.userId, raw.vendorGstin, Number(raw.totalAmount), raw.invoiceDate, raw.status);
            for (const item of raw.items) {
                invoice.addItem(new InvoiceItem_1.InvoiceItem(item.id, item.description, item.hsnCode, Number(item.amount), Number(item.gstRate)));
            }
            return invoice;
        });
    }
}
exports.PrismaInvoiceRepository = PrismaInvoiceRepository;
