import { Transaction } from "../domain/Transaction";
import { ITransactionRepository } from "../repositories/ITransactionRepository";

export class TransactionService{
    //Dependency Injection
    private readonly transactionRepo : ITransactionRepository

    constructor(transactionRepo: ITransactionRepository){
        this.transactionRepo = transactionRepo
    }

    public async processNewTransaction(payload: {id: string, amount: number, type: 'CREDIT' | 'DEBIT'}): Promise<Transaction>{
        const transaction = new Transaction(payload.id, payload.amount, payload.type)
        const isFraud = false  //Mocking an external call
        if(isFraud){
            transaction.flagAnomaly("Failed externam fraud check")
        }

        await this.transactionRepo.save(transaction)

        return transaction
    }
}