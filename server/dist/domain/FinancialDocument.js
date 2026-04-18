"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialDocument = void 0;
class FinancialDocument {
    id;
    status;
    createdAt;
    constructor(id, status = "PENDING", createdAt) {
        this.id = id;
        this.status = status;
        this.createdAt = createdAt || new Date();
    }
    getId() { return this.id; }
    getStatus() { return this.status; }
    getCreatedAt() { return this.createdAt; }
    flagAsAnomaly() {
        this.status = "FLAGGED";
    }
}
exports.FinancialDocument = FinancialDocument;
