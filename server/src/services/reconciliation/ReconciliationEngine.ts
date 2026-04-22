import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";
import { IMatchingStrategy } from "./IMatchingStrategy";
import { ITransactionRepository } from "../../repositories/ITransactionRepository";
import { NotificationService } from "../NotificationService";

export class ReconciliationEngine {
    private strategies: IMatchingStrategy[]
    private transactionRepo: ITransactionRepository
    private notificationService: NotificationService | null

    constructor(transactionRepo: ITransactionRepository, strategies: IMatchingStrategy[], notificationService?: NotificationService) {
        this.transactionRepo = transactionRepo
        this.strategies = strategies
        this.notificationService = notificationService || null
    }

    public async reconcile(invoice: Invoice, transactions: Transaction[], userId?: string): Promise<boolean> {
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

        // Observer Pattern: Fire an alert when anomaly is detected
        if (this.notificationService && userId) {
            await this.notificationService.sendAlert(
                userId,
                "HIGH",
                `Reconciliation failed for invoice ${invoice.getId()} (₹${invoice.getTotalAmount().toLocaleString('en-IN')}). No matching transaction combination found.`,
                invoice.getId()
            );
        }

        return false;
    }
}