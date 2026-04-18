"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const FinancialDocument_1 = require("./FinancialDocument");
class Invoice extends FinancialDocument_1.FinancialDocument {
    userId;
    vendorGstin;
    totalAmount;
    invoiceDate;
    items;
    constructor(id, userId, vendorGstin, totalAmount, invoiceDate, status) {
        super(id, status);
        if (totalAmount <= 0) {
            throw new Error("Invoice total must be strictly positive.");
        }
        this.userId = userId;
        this.vendorGstin = vendorGstin;
        this.totalAmount = totalAmount;
        this.invoiceDate = invoiceDate;
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
    validateTotals() {
        const calculatedTotal = this.items.reduce((sum, item) => {
            return sum + item.getAmount() + item.calculateTaxAmount();
        }, 0);
        const marginOfError = 1.0; //allowing a tiny floating-point margin of error
        const isValid = Math.abs(calculatedTotal - this.totalAmount) <= marginOfError;
        if (!isValid) {
            this.flagAsAnomaly();
        }
        return isValid;
    }
    process() {
        if (this.status === "FLAGGED") {
            throw new Error("Cannot process a flagged invoice. Manual review required");
        }
        const isMathValid = this.validateTotals();
        if (isMathValid) {
            this.status = "VERIFIED";
        }
    }
    getItems() {
        return [...this.items];
    }
    getUserId() { return this.userId; }
    getTotalAmount() { return this.totalAmount; }
    getVendorGstin() { return this.vendorGstin; }
    getInvoiceDate() { return this.invoiceDate; }
    markAsPaid() {
        this.status = "PAID";
    }
}
exports.Invoice = Invoice;
