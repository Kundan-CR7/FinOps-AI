import { IMatchingStrategy } from "./IMatchingStrategy";
import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";

export class ExactMatchStrategy implements IMatchingStrategy{
    public isMatch(invoice: Invoice, transaction: Transaction): boolean {
        return (invoice.validateTotals() && invoice.getStatus() === "VERIFIED"
            && transaction.getAmount() === invoice.getTotalAmount())
    }
}