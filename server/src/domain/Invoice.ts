import { FinancialDocument, DocumentStatus } from "./FinancialDocument";
import { InvoiceItem } from "./InvoiceItem";

export class Invoice extends FinancialDocument{
    private readonly userId: string
    private readonly vendorGstin: string
    private readonly totalAmount: number
    private readonly invoiceDate: Date
    private items: InvoiceItem[]

    constructor(id: string, userId: string, vendorGstin: string, totalAmount: number, invoiceDate:Date, status?: DocumentStatus){
        super(id,status)

        if(totalAmount <=0){
            throw new Error("Invoice total must be strictly positive.");
            
        }
        this.userId = userId
        this.vendorGstin = vendorGstin
        this.totalAmount = totalAmount
        this.invoiceDate = invoiceDate
        this.items = []
    }

    public addItem(item: InvoiceItem): void{
        this.items.push(item)
    }

    public validateTotals(): boolean{
        const calculatedTotal = this.items.reduce((sum, item) => {
            return sum + item.getAmount() + item.calculateTaxAmount()
        },0)

        const marginOfError = 1.0      //allowing a tiny floating-point margin of error
        const isValid = Math.abs(calculatedTotal - this.totalAmount) <= marginOfError      

        if(!isValid){
            this.flagAsAnomaly()
        }

        return isValid
    }

    public process(): void {
        if(this.status === "FLAGGED"){
            throw new Error("Cannot process a flagged invoice. Manual review required");
        }

        const isMathValid = this.validateTotals()
        if(isMathValid){
            this.status = "VERIFIED"
        }
    }

    public getItems(): ReadonlyArray<InvoiceItem>{
        return [...this.items]
    }

    public getUserId(): string { return this.userId}
    public getTotalAmount(): number { return this.totalAmount }
    public getVendorGstin(): string { return this.vendorGstin }
    public getInvoiceDate(): Date { return this.invoiceDate }

}