export class TaxProfile{
    private readonly gstin: string;
    private readonly businessType: string;
    private isGstRegistered: boolean;

    constructor(gstin: string, businessType: string, isGstRegistered: boolean){
        if(isGstRegistered && !gstin){
            throw new Error("GSTIN is required for registered businesses.")
        }
        this.gstin = gstin
        this.businessType = businessType
        this.isGstRegistered = isGstRegistered
    }

    //Business Logic Method
    calculateApplicableTax(baseAmount: number): number{
        if(!this.isGstRegistered) return 0;

        const STANDARD_GST_RATE = 0.18
        return baseAmount * STANDARD_GST_RATE
    }

    //Getters only - no setters to protect data integrity
    getGstin(): string{
        return this.gstin
    }
}