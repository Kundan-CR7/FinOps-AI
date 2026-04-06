type TransactionType = "CREDIT" | "DEBIT"
type TransactionStatus = "PENDING" | "RECONCILED" | "FLAGGED"

export class Transaction{
    private readonly id: string;
    private amount: number
    private type: TransactionType
    private status: TransactionStatus
    private anomalyReason: string | null

    constructor(id: string, amount: number, type: TransactionType){
        if(amount <= 0){
            throw new Error("Transaction amount must be strictly positive.")
        }
        this.id = id
        this.amount = amount
        this.type = type 
        this.status = "PENDING"
        this.anomalyReason = null
    }

    //Behaviour: Mutating state through strictly controlled methods
    markAsReconciled(): void{
        if(this.status === "FLAGGED"){
            throw new Error("Cannot reconcile a flagged transaction without manual review.")
        }
        this.status = "RECONCILED"
    }

    flagAnomaly(reason: string): void{
        this.status = "FLAGGED"
        this.anomalyReason = reason
    }

    getStatus(): TransactionStatus{
        return this.status
    }

    getAmount(): number{
        return this.amount
    }
}