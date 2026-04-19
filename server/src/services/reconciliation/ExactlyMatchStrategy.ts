import { IMatchingStrategy } from "./IMatchingStrategy";
import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";

export class ExactMatchStrategy implements IMatchingStrategy {
    public findMatches(invoice: Invoice, transactions: Transaction[]): Transaction[] | null {
        const blockedStatuses = ["PAID", "RECONCILED"];
        if (blockedStatuses.includes(invoice.getStatus())) return null;

        for (const transaction of transactions) {
            if (transaction.getStatus() !== "PENDING") continue;
            
            if (transaction.getAmount() === invoice.getTotalAmount()) {
                return [transaction];
            }
        }
        
        return null;
    }
}