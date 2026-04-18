"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExactMatchStrategy = void 0;
class ExactMatchStrategy {
    findMatches(invoice, transactions) {
        const isStatusValid = invoice.getStatus() === "VERIFIED" || invoice.getStatus() === "EXTRACTED";
        if (!isStatusValid)
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
