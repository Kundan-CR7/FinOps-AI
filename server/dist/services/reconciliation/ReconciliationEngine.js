"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationEngine = void 0;
class ReconciliationEngine {
    strategies;
    transactionRepo;
    constructor(transactionRepo, strategies) {
        this.transactionRepo = transactionRepo;
        this.strategies = strategies;
    }
    async reconcile(invoice, transactions) {
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
        invoice.flagAsAnomaly(); //no match is found 
        return false;
    }
}
exports.ReconciliationEngine = ReconciliationEngine;
