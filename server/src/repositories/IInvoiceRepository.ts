import { Invoice } from "../domain/Invoice";

export interface IInvoiceRepository{
    save(invoice: Invoice): Promise<void>
    findById(id: string): Promise<Invoice | null>
    findByUser(userId: string): Promise<Invoice[]>
}