"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItem = void 0;
class InvoiceItem {
    id;
    description;
    hsnCode;
    amount;
    gstRate; //Stored as a percentage(eg 18 for 18%)
    constructor(id, description, hsnCode, amount, gstRate) {
        if (amount < 0) {
            throw new Error("Invoice item cannot be negative.");
        }
        if (gstRate < 0 || gstRate > 100) {
            throw new Error("Invalid GST rate");
        }
        this.id = id;
        this.description = description;
        this.hsnCode = hsnCode;
        this.amount = amount;
        this.gstRate = gstRate;
    }
    calculateTaxAmount() {
        return this.amount * (this.gstRate / 100);
    }
    getAmount() { return this.amount; }
    getGstRate() { return this.gstRate; }
    getHsnCode() { return this.hsnCode; }
    getId() { return this.id; }
    getDescription() { return this.description; }
}
exports.InvoiceItem = InvoiceItem;
