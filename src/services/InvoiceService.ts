import { promises } from "node:dns";
import { Invoice } from "../domain/Invoice";
import { InvoiceItem } from "../domain/InvoiceItem";
import { PrismaInvoiceRepository } from "../repositories/PrismaInvoiceRepository";

export class InvoiceService{
    invoiceRepo: PrismaInvoiceRepository

    constructor(invoiceRepo: PrismaInvoiceRepository){
        this.invoiceRepo = invoiceRepo
    }

    public async processNewInvoice(payload: any): Promise<Invoice>{
        const invoice = new Invoice(
            payload.id,
            payload.userId,
            payload.vendorGstin,
            payload.totalAmount,
            new Date(payload.invoiceDate)
        )

        for (const itemPayload of payload.items){
            const item = new InvoiceItem(
                itemPayload.id,
                itemPayload.description,
                itemPayload.hsnCode,
                itemPayload.amount,
                itemPayload.gstRate
            )
            invoice.addItem(item)
        }

        invoice.process()
        return invoice
    }
}