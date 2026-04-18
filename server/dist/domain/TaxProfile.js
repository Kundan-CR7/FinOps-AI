"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxProfile = void 0;
class TaxProfile {
    gstin;
    businessType;
    isGstRegistered;
    constructor(gstin, businessType, isGstRegistered) {
        if (isGstRegistered && !gstin) {
            throw new Error("GSTIN is required for registered businesses.");
        }
        this.gstin = gstin;
        this.businessType = businessType;
        this.isGstRegistered = isGstRegistered;
    }
    //Business Logic Method
    calculateApplicableTax(baseAmount) {
        if (!this.isGstRegistered)
            return 0;
        const STANDARD_GST_RATE = 0.18;
        return baseAmount * STANDARD_GST_RATE;
    }
    //Getters only - no setters to protect data integrity
    getGstin() {
        return this.gstin;
    }
}
exports.TaxProfile = TaxProfile;
