import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";
import { IMatchingStrategy } from "./IMatchingStrategy";
import { ITransactionRepository } from "../../repositories/ITransactionRepository";

export class ReconciliationEngine {
    private strategies: IMatchingStrategy[]
    private transactionRepo: ITransactionRepository

    constructor(transactionRepo: ITransactionRepository, strategies: IMatchingStrategy[]) {
        this.transactionRepo = transactionRepo
        this.strategies = strategies
    }

    public async reconcile(invoice: Invoice, transactions: Transaction[]): Promise<boolean> {
        for (const strategy of this.strategies) {
            const matchedTransactions = strategy.findMatches(invoice, transactions);
            
            if (matchedTransactions && matchedTransactions.length > 0) {
                // Update both states
                for (const transaction of matchedTransactions) {
                    transaction.markAsReconciled();
                    // Persist the updated transaction state
                    await this.transactionRepo.save(transaction);
                }
                invoice.markAsPaid();
                return true;
            }
        }

        invoice.flagAsAnomaly();    //no match is found 
        return false;
    }
}