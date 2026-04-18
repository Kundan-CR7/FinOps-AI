import { Transaction } from "../domain/Transaction";

export interface ITransactionRepository{
    save(transaction: Transaction): Promise<void>
    findById(id: string): Promise<Transaction | null>
    findByStatementId(statementId: string): Promise<Transaction[]>
}