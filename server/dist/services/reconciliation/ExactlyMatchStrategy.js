"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExactMatchStrategy = void 0;
class ExactMatchStrategy {
    findMatches(invoice, transactions) {
        const blockedStatuses = ["PAID", "RECONCILED"];
        if (blockedStatuses.includes(invoice.getStatus()))
            return null;
        for (const transaction of transactions) {
            if (transaction.getStatus() !== "PENDING")
                continue;
            if (transaction.getAmount() === invoice.getTotalAmount()) {
                return [transaction];
            }
        }
        return null;
    }
}
exports.ExactMatchStrategy = ExactMatchStrategy;
