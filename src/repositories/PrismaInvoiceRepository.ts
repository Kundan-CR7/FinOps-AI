import { PrismaClient } from "../generated/prisma";
import { IInvoiceRepository } from "./IInvoiceRepository";
import { Invoice } from "../domain/Invoice";

const prisma = new PrismaClient()

export class PrismaInvoiceRepository implements IInvoiceRepository{
    public async save(invoice: Invoice): Promise<void> {
        const itemsToSave = invoice.getItems().map(item => ({
            id : item.getId(),
            description : item.getDescription(),
            hsnCode: item.getHsnCode(),
            amount : item.getAmount(),
            gstRate: item.getGstRate()
        }))

        await prisma.invoice.upsert({
            where : {id: invoice.getId()},
            update: {
                status : invoice.getStatus()
            },
            create : {
                id : invoice.getId(),
                userId : invoice.getUserId(),
                vendorGstin : invoice.getVendorGstin(),
                totalAmount : invoice.getTotalAmount(),
                status: invoice.getStatus(),
                invoiceDate: invoice.getInvoiceDate(),
                items : {
                    create : itemsToSave
                }
            }
        })
    }

    public async findById(id: string): Promise<Invoice | null> {
        return null
    }
}
