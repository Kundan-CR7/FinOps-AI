import { promises } from "node:dns";
import { Invoice } from "../domain/Invoice";
import { InvoiceItem } from "../domain/InvoiceItem";

export class InvoiceService{
    public async processNewInvoice(payload: any): Promise<Invoice>{
        const invoice = new Invoice(
            payload.id,
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