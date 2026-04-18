import { promises } from "node:dns";
import { Invoice } from "../domain/Invoice";
import { InvoiceItem } from "../domain/InvoiceItem";
import { IInvoiceRepository } from "../repositories/IInvoiceRepository";

export class InvoiceService {
    private readonly invoiceRepo: IInvoiceRepository

    constructor(invoiceRepo: IInvoiceRepository) {
        this.invoiceRepo = invoiceRepo
    }

    public async processNewInvoice(payload: any): Promise<Invoice> {
        const invoice = new Invoice(
            payload.id,
            payload.userId,
            payload.vendorGstin,
            payload.totalAmount,
            new Date(payload.invoiceDate)
        )

        for (const itemPayload of payload.items) {
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
        await this.invoiceRepo.save(invoice)
        return invoice
    }
}