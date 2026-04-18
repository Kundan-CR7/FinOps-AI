"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    id;
    statementId;
    amount;
    type;
    status;
    anomalyReason;
    transactionDate;
    narration;
    constructor(id, statementId, amount, type, transactionDate = new Date(), narration = null) {
        if (amount <= 0) {
            throw new Error("Transaction amount must be strictly positive.");
        }
        this.id = id;
        this.statementId = statementId;
        this.amount = amount;
        this.type = type;
        this.status = "PENDING";
        this.anomalyReason = null;
        this.transactionDate = transactionDate;
        this.narration = narration;
    }
    //Behaviour: Mutating state through strictly controlled methods
    markAsReconciled() {
        if (this.status === "FLAGGED") {
            throw new Error("Cannot reconcile a flagged transaction without manual review.");
        }
        this.status = "MATCHED";
    }
    flagAnomaly(reason) {
        this.status = "FLAGGED";
        this.anomalyReason = reason;
    }
    getStatus() {
        return this.status;
    }
    getAmount() {
        return this.amount;
    }
    getStatementId() {
        return this.statementId;
    }
    getId() {
        return this.id;
    }
    getType() {
        return this.type;
    }
    getTransactionDate() {
        return this.transactionDate;
    }
    getNarration() {
        return this.narration;
    }
}
exports.Transaction = Transaction;
