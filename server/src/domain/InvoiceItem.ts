export class InvoiceItem{
    private readonly id: string
    private readonly description: string
    private readonly hsnCode: string
    private readonly amount: number
    private readonly gstRate: number     //Stored as a percentage(eg 18 for 18%)

    constructor(id:string, description:string, hsnCode: string, amount: number, gstRate: number){
        if(amount < 0){
            throw new Error("Invoice item cannot be negative.")
        }
        if(gstRate < 0 || gstRate > 100){
            throw new Error("Invalid GST rate");
        }
        this.id = id
        this.description = description
        this.hsnCode = hsnCode
        this.amount = amount
        this.gstRate = gstRate
    } 

    public calculateTaxAmount(): number {
        return this.amount * (this.gstRate / 100)
    }

    public getAmount(): number { return this.amount; }
    public getGstRate(): number { return this.gstRate; }
    public getHsnCode(): string { return this.hsnCode; }
    public getId(): string { return this.id; }
    public getDescription(): string { return this.description; }
}