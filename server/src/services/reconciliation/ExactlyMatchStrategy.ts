import { IMatchingStrategy } from "./IMatchingStrategy";
import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";

export class ExactMatchStrategy implements IMatchingStrategy {
    public findMatches(invoice: Invoice, transactions: Transaction[]): Transaction[] | null {
        const isStatusValid = invoice.getStatus() === "VERIFIED" || invoice.getStatus() === "EXTRACTED";
        if (!isStatusValid) return null;

        for (const transaction of transactions) {
            if (transaction.getStatus() !== "PENDING") continue;
            
            if (transaction.getAmount() === invoice.getTotalAmount()) {
                return [transaction];
            }
        }
        
        return null;
    }
}