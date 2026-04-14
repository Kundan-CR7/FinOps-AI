import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";
import { IMatchingStrategy } from "./IMatchingStrategy";
import { ITransactionRepository } from "../../repositories/ITransactionRepository";

export class ReconciliationEngine{
    private strategies: IMatchingStrategy[]
    private transactionRepo: ITransactionRepository

    constructor(transactionRepo: ITransactionRepository, strategies: IMatchingStrategy[]){
        this.transactionRepo = transactionRepo
        this.strategies = strategies
    }
    
    public async reconcile(invoice: Invoice, transactions: Transaction[]): Promise<boolean> {
        for (const transaction of transactions){
            for (const strategy of this.strategies){
                if(strategy.isMatch(invoice, transaction)){
                    transaction.markAsReconciled()   //update both states

                    //Persist the updated transaction state
                    await this.transactionRepo.save(transaction)
                    return true
                }
            }
        }
        
        invoice.flagAsAnomaly()    //no match is found 
        return false
    }
}