import prisma from "../utils/prisma";
import { IInvoiceRepository } from "./IInvoiceRepository";
import { Invoice } from "../domain/Invoice";
import { DocumentStatus } from "../domain/FinancialDocument";
import { InvoiceItem } from "../domain/InvoiceItem";

export class PrismaInvoiceRepository implements IInvoiceRepository {
    public async save(invoice: Invoice): Promise<void> {
        const itemsToSave = invoice.getItems().map(item => ({
            id: item.getId(),
            description: item.getDescription(),
            hsnCode: item.getHsnCode(),
            amount: item.getAmount(),
            gstRate: item.getGstRate()
        }))

        await prisma.invoice.upsert({
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
        })
    }

    public async findById(id: string): Promise<Invoice | null> {
        const raw = await prisma.invoice.findUnique({
            where : {id},
            include : {items: true}
        })
        if(!raw) return null
        const invoice = new Invoice(raw.id, raw.userId, raw.vendorGstin, Number(raw.totalAmount), raw.invoiceDate, raw.status as DocumentStatus)
        for (const item of raw.items){
            invoice.addItem(new InvoiceItem(item.id, item.description, item.hsnCode, Number(item.amount), Number(item.gstRate)))
        }
        return invoice
    }
    
    public async findByUser(userId: string): Promise<Invoice[]> {
        const raws = await prisma.invoice.findMany({
            where : { userId },
            include : { items: true },
            orderBy: { createdAt: 'desc' }
        })
        return raws.map((raw) => {
            const invoice = new Invoice(raw.id, raw.userId, raw.vendorGstin, Number(raw.totalAmount), raw.invoiceDate, raw.status as DocumentStatus)
            for (const item of raw.items){
                invoice.addItem(new InvoiceItem(item.id, item.description, item.hsnCode, Number(item.amount), Number(item.gstRate)))
            }
            return invoice;
        })
    }
}
